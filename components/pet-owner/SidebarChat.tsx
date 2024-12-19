import { useChat } from '@/context/ChatContext';
import Image from "next/image";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import { useAuth } from "@/context/authentication";
import { useRouter } from "next/router";

interface SidebarChatProps {
  id?: string;
}

export function SidebarChat({ id }: SidebarChatProps) {
  const { user } = useAuth();
  const { conversations, loading, markAsRead } = useChat();
  const router = useRouter();

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

