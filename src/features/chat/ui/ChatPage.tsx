"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
//import { Card } from "@/components/ui/card";
// import ChatList from "./ChatList";
import ChatInterface from "./ChatInterface";
import type { ChatRequest } from "@/types/chat";
import { MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function ChatPage() {
  const { data: session } = useSession();
  const [selectedChat, setSelectedChat] = useState<ChatRequest | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // التحقق من حجم الشاشة مع مراعاة السايدبار
  useEffect(() => {
    const checkScreenSize = () => {
      // افتراض أن السايدبار بعرض 250px، عدل حسب ديزاينك
      const sidebarWidth = 250;
      const availableWidth = window.innerWidth - sidebarWidth;
      setIsMobile(availableWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">يجب تسجيل الدخول للوصول إلى المحادثات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* هيدر للموبايل */}
      {isMobile && selectedChat && (
        <div className="flex items-center gap-3 p-4 border-b bg-white lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChat(null)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">
              {selectedChat.patient_full_name || selectedChat.consultant_full_name}
            </h2>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        {/* القائمة الجانبية للمحادثات */}
        <div
          className={`
            ${isMobile && selectedChat ? "hidden" : "flex"}
            ${isMobile ? "w-full" : "w-full lg:w-96 xl:w-1/3"}
            flex-col border-l bg-white
            lg:flex lg:static
          `}
        >
          {/* <ChatList
            selectedChat={selectedChat}
            onSelectChat={(chat) => {
              setSelectedChat(chat);
              if (isMobile) setMobileMenuOpen(false);
            }}
            isMobile={isMobile}
          /> */}
        </div>

        {/* Sheet للقائمة في الموبايل */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0">
            {/* <ChatList
              selectedChat={selectedChat}
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setMobileMenuOpen(false);
              }}
              isMobile={isMobile}
            /> */}
          </SheetContent>
        </Sheet>

        {/* واجهة المحادثة */}
        <div
          className={`
            ${isMobile && !selectedChat ? "hidden" : "flex"}
            flex-1 flex-col
            bg-gray-50
          `}
        >
          {selectedChat ? (
            <ChatInterface
              chatRequest={selectedChat}
              onBack={() => {
                setSelectedChat(null);
                if (isMobile) setMobileMenuOpen(true);
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8f7a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  مرحباً في المحادثات
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  اختر محادثة من القائمة لبدء التحدث مع المرضى أو المستشارين.
                  يمكنك إرسال الرسائل النصية والملفات والصور.
                </p>
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                    <span>محادثات فورية مع المرضى والمستشارين</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                    <span>إرسال الصور والملفات حتى 10MB</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                    <span>واجهة مستخدم متجاوبة لجميع الأجهزة</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}