import Header from "@/components/home-page/Header";
import { SidebarChat } from "@/components/pet-owner/SidebarChat";
import { useAuth } from "@/context/authentication";
import axios from "axios";
import { useEffect, useState } from "react";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";

interface UserProfile {
  full_name: string;
  user_id: string;
  image: string;
}

export default function BookingPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchConversations = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `/api/conversations/participant?user_id=${user?.sub}&conversation_id=${id}`
          );
          console.log(response.data.data)
          setProfile(response.data.data);
        } catch (error) {
          console.log("Error fetching conversations:", error);
        }
      }
    };

    fetchConversations();
  }, [user,id]);
  const profileImage = profile?.image ? profile.image : profiledefault;

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFB]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <SidebarChat />
        <div className="flex-1 overflow-auto">
          <ChatHeader profile={profile} profileImage={profileImage} />
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
  return (
    <div className="w-full bg-gray-100 px-10 py-2">
      <div className="flex gap-3 p-3">
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
    </div>
  );
}

export function ChatBody() {
  return <div className="w-full px-10 py-6"></div>;
}
