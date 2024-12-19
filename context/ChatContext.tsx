import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { createClient } from "@supabase/supabase-js";
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

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (user) {
      try {
        const response = await axios.get(`/api/conversations?user_id=${user.sub}`);
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
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.conversation_id === conversationId
            ? { ...conversation, unread_count: 0 }
            : conversation
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    fetchConversations();

    const conversationSubscription = supabase
      .channel("public:conversations")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations" },
        (payload) => {
          console.log("Conversation Updated:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    const conversationCreateSubscription = supabase
      .channel("public:conversations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversations" },
        (payload) => {
          console.log("Conversation Updated:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    const messageSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("New Message:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    const messageDeleteSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Delete Message:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    const messageUpdateSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Update Message:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationSubscription);
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(messageDeleteSubscription);
      supabase.removeChannel(messageUpdateSubscription);
      supabase.removeChannel(conversationCreateSubscription);
    };
  }, [user]);

  return (
    <ChatContext.Provider value={{ conversations, setConversations, loading, markAsRead, fetchConversations }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

