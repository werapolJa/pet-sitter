import Header from "@/components/home-page/Header";
import { SidebarChat } from "@/components/pet-owner/SidebarChat";

export default function Chat() {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFB]">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <SidebarChat />
        <div className="flex-1 overflow-auto w-full justify-center items-center flex">
          <h1>Start a conversation!</h1>
        </div>
      </main>
    </div>
  );
}

