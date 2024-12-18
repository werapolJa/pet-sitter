import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import { useAuth } from "@/context/authentication";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

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

interface SidebarChatProps {
  id?: string;
  setChat?: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export function SidebarChat({ id, setChat }: SidebarChatProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `/api/conversations?user_id=${user.sub}`
          );
          setConversations(response.data.data);
          if (setChat) {
            setChat(response.data.data);
          }
        } catch (error) {
          console.log("Error fetching conversations:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    // Subscribe to Supabase Realtime for conversations and messages
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

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(conversationSubscription);
      supabase.removeChannel(messageSubscription);
    };
  }, [user, setChat]);

  const markAsRead = async (conversationId: string) => {
    try {
      await axios.put("/api/conversations/read", {
        user_id: user?.sub,
        conversation_id: conversationId,
      });
      const updatedConversations = conversations.map((conversation) => {
        if (conversation.conversation_id === conversationId) {
          return { ...conversation, unread_count: 0 };
        }
        return conversation;
      });
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <aside className="bg-black w-full md:w-[368px] h-full flex flex-col">
      <h3 className="text-white font-bold text-2xl p-5 md:p-10">Messages</h3>
      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <span className="loading loading-dots loading-lg text-white"></span>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (participant) => participant.user_id !== user?.sub
            );
            const lastMessage = conversation.messages[0];

            return (
              <div
                key={conversation.conversation_id}
                className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-800 ${
                  id === conversation.conversation_id ? "bg-gray-800" : ""
                }`}
                onClick={() => {
                  markAsRead(conversation.conversation_id);
                  router.push(`/chats/${conversation.conversation_id}`);
                }}
              >
                <div className="flex gap-3">
                  <div className="rounded-full">
                    <Image
                      src={otherParticipant?.image || profiledefault}
                      alt={otherParticipant?.full_name || "Profile"}
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full bg-white object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <p className="text-white truncate">
                      {otherParticipant?.full_name || "Unknown User"}
                    </p>
                    <p className="text-gray-400 truncate">
                      {lastMessage?.sender_id === user?.sub ? "You: " : ""}
                      {lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
                {conversation.unread_count === 0 ? null : (
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full text-center">
                    {conversation.unread_count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
