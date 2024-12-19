import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { useAuth } from "@/context/authentication";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Participant {
  user_id: string;
  full_name: string;
  image: string | null;
}

interface Message {
  message_id: string;
  content: string;
  created_at: string;
  sender_id: string;
}

interface Conversation {
  conversation_id: string;
  updated_at: string;
  participants: Participant[];
  messages: Message[];
  unread_count: number;
}

interface ChatContextType {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  loading: boolean;
  markAsRead: (conversationId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `/api/conversations?user_id=${user.sub}`
        );
        setConversations(response.data.data);
      } catch (error) {
        console.log("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await axios.put("/api/conversations/read", {
        user_id: user?.sub,
        conversation_id: conversationId,
      });
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === conversationId
            ? { ...conversation, unread_count: 0 }
            : conversation
        )
      );
    } catch (error) {
      console.log("Error marking as read:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    const subscribeToEvents = (
      channelName: string,
      tableName: string,
      callback: () => void
    ) => {
      const subscription: RealtimeChannel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          (payload) => {
            console.log(`Event on ${tableName}:`, payload);
            callback();
          }
        )
        .subscribe();

      return subscription;
    };

    const conversationsSubscription = subscribeToEvents(
      "public:conversations",
      "conversations",
      fetchConversations
    );

    const messagesSubscription = subscribeToEvents(
      "public:messages",
      "messages",
      fetchConversations
    );

    return () => {
      supabase.removeChannel(conversationsSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        loading,
        markAsRead,
        fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
