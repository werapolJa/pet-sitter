import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import profiledefault from "@/public/assets/profile-default-icon.svg";
import { useAuth } from "@/context/authentication";
import { useRouter } from 'next/router';

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
}



export function SidebarChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/conversations?user_id=${user.sub}`);
          setConversations(response.data.data);
          console.log(response.data.data)
        } catch (error) {
          console.log('Error fetching conversations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <aside className="bg-black w-[368px] h-full flex flex-col">
      <h3 className="text-white font-bold text-2xl p-10">Messages</h3>
      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <span className="loading loading-dots loading-lg text-white"></span>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {conversations.map((conversation) => {
            // Get the first participant excluding the logged-in user
            const otherParticipant = conversation.participants.find(
              (participant) => participant.user_id !== user?.sub
            );

            // Get the last message from the messages array
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            return (
              <div
                key={conversation.conversation_id}
                className="flex gap-3 p-3 cursor-pointer hover:bg-gray-800"
                onClick={() => router.push(`/chats/${conversation.conversation_id}`)}
              >
                <div className="rounded-full">
                  <Image
                    src={otherParticipant?.image || profiledefault}
                    alt={otherParticipant?.full_name || 'Profile'}
                    width={60}
                    height={60}
                    className="w-[60px] h-[60px] rounded-full bg-white object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <p className="text-white truncate">{otherParticipant?.full_name || 'Unknown User'}</p>
                  <p className="text-gray-400 truncate">
                    {lastMessage?.sender_id === user?.sub ? 'You: ' : ''}
                    {lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
