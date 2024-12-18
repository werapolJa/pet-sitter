import Header from "@/components/home-page/Header";
import { SidebarChat } from "@/components/pet-owner/SidebarChat";
import { useAuth } from "@/context/authentication";
import { useEffect, useState, useCallback } from "react";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import btnChat from "@/public/assets/chat.svg";
import axios from "axios";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    // This will run only on the client side
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initialize the state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

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

interface UserProfile {
  full_name: string;
  user_id: string;
  image: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const markAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await axios.put("/api/conversations/read", {
          user_id: user?.sub,
          conversation_id: conversationId,
        });
        setConversations((prevConversations) =>
          prevConversations.map((conversation) => {
            if (conversation.conversation_id === conversationId) {
              return { ...conversation, unread_count: 0 };
            }
            return conversation;
          })
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    },
    [user?.sub]
  );

  useEffect(() => {
    if (!id) return;

    const conversation = conversations.find(
      (conv) => conv.conversation_id === id
    );
    if (conversation) {
      const participant = conversation.participants[0];
      setProfile({
        full_name: participant.full_name,
        user_id: participant.user_id,
        image: participant.image || profiledefault,
      });
      setMessages(conversation.messages);
    }
  }, [id, conversations]);

  const profileImage = profile?.image ? profile.image : profiledefault;

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFB]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <SidebarChat
            id={typeof id === "string" ? id : undefined}
            setChat={setConversations}
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          {/* Header ด้านบน */}
          <ChatHeader profile={profile} profileImage={profileImage} />

          {/* กล่องแชทตรงกลาง */}
          <ChatBody
            messages={messages}
            user={user}
            profile={profile}
            id={typeof id === "string" ? id : undefined}
            markAsRead={markAsRead}
          />
        </div>
      </main>
    </div>
  );
}

interface SidebarChatProps {
  profile: UserProfile | null;
  profileImage: string | StaticImageData;
}

export function ChatHeader({ profile, profileImage }: SidebarChatProps) {
  const router = useRouter();
  return (
    <div className="w-full bg-gray-100 px-5 md:px-10 py-2 flex justify-between">
      <div className="flex gap-3">
        <div className="rounded-full">
          <Image
            src={profileImage}
            alt="profile"
            width={48}
            height={48}
            className="w-[48px] h-[48px] rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold">{profile?.full_name}</h3>
        </div>
      </div>
      <button
        className="text-gray-400 font-bold"
        onClick={() => router.push("/chats")}
      >
        X
      </button>
    </div>
  );
}

interface ChatBodyProps {
  messages: Message[];
  profile: UserProfile | null;
  user: { sub: string } | null;
  id?: string;
  markAsRead: (conversationId: string) => void;
}

export function ChatBody({
  messages,
  profile,
  user,
  id,
  markAsRead,
}: ChatBodyProps) {
  const [newMessage, setNewMessage] = useState<string>("");

  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (id && newMessage.trim() !== "") {
      markAsRead(id);
    }
  }, [newMessage, id, markAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const conversation_id = id;
    const sender_id = user?.sub;

    try {
      const response = await axios.post("/api/conversations/messages", {
        conversation_id,
        sender_id,
        content: newMessage,
      });

      if (response.status === 200) {
        setNewMessage("");
      } else {
        console.log("Error sending message:", response.data.message);
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  if (
    !messages ||
    messages.length === 0 ||
    messages.every((msg) => msg.content === null)
  ) {
    return (
      <>
        <div className="w-full h-full px-10 py-6">
          <div className="flex items-center justify-center h-full w-full">
            <h1>Start a conversation!</h1>
          </div>
        </div>
        <div className="w-full h-auto bg-white py-6 px-10 flex gap-6">
          <input
            type="text"
            placeholder="Type here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input w-full focus-within:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="btn bg-orange-500 shadow-sm w-12 h-12 rounded-full hover:bg-orange-600 p-0"
          >
            <Image className="w-5 h-5" src={btnChat} alt="icon button" />
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div
        className={`flex-1 flex flex-col-reverse gap-4 px-10 overflow-y-auto ${
          ((windowWidth ?? Infinity) <= 768 && messages.length > 5) || messages.length > 8
            ? "pb-28"
            : "pb-10"
        }`}
      >
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === user?.sub;
          const senderImage = isOwnMessage ? null : profile?.image;

          return (
            <div
              key={message.message_id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              {!isOwnMessage && senderImage && (
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <Image
                      alt="User Avatar"
                      src={senderImage}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              )}
              <div
                className={`chat-bubble px-6 py-4 rounded-full shadow-md ${
                  isOwnMessage
                    ? "bg-[#E44A0C] text-white"
                    : "bg-white text-black"
                }`}
              >
                {message.content}
              </div>
              <div className={`dropdown ${isOwnMessage ? "dropdown-left" : "dropdown-right"}`}>
                <div tabIndex={0} role="button">
                  ...    
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a>Change message</a>
                  </li>
                  <li>
                    <a>Delete message</a>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input ส่งข้อความ */}
      <div className="w-full h-auto bg-white py-6 px-10 flex gap-6 sticky bottom-0">
        <input
          type="text"
          placeholder="Type here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input w-full focus-within:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="btn bg-orange-500 shadow-sm w-12 h-12 rounded-full hover:bg-orange-600 p-0"
        >
          <Image className="w-5 h-5" src={btnChat} alt="icon button" />
        </button>
      </div>
    </div>
  );
}
