"use client";
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "../hooks/useChatApi";
import { useChatPusher } from "../hooks/useChatPusher";
import type { ChatRequest, Message } from "@/types/chat";
import { logger } from "@/lib/logger";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";

interface ChatInterfaceProps {
  chatRequest: ChatRequest;
  onBack?: () => void;
}

function ChatInterface({ chatRequest, onBack }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showUploadMenu, setShowUploadMenu] = useState<boolean>(false);
  const [shouldFollowOutput, setShouldFollowOutput] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastProcessedRef = useRef<number>(0);
  const markAsReadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);

  //const { data: messages = [], isLoading, error } = useMessages(chatRequest.id);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(chatRequest.id);

  const messages = useMemo(() => {
    if (!data || !data.pages) return [];

    console.log("📊 تحليل صفحات البيانات:", {
      totalPages: data.pages.length,
      pages: data.pages.map((page, idx) => ({
        pageIndex: idx,
        messageCount: page?.data?.length || 0,
        hasNextCursor: !!page?.next_cursor,
      })),
    });

    // دمج كل الرسائل من جميع الصفحات مع الاحتفاظ بالترتيب
    const allMessages = data.pages.flatMap((page) => {
      if (!page || !page.data) return [];
      return page.data;
    });

    console.log(`✅ إجمالي الرسائل المحملة: ${allMessages.length}`);

    // إزالة التكرارات بناءً على ID
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    );

    return uniqueMessages.reverse();

    // ترتيب من الأقدم للأحدث
    // return uniqueMessages.sort(
    //   (a, b) =>
    //     new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    // );
  }, [data]);

  console.log("Loaded messages:", messages);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  useChatPusher(
    chatRequest.id,
    chatRequest.patient_id,
    chatRequest.consultant_id
  );

  const currentUserId = session?.user?.id;
  const isPatient = session?.role === "patient";
  const otherUser = useMemo(
    () =>
      isPatient
        ? {
            id: chatRequest.consultant_id,
            name: chatRequest.consultant_full_name,
            type: chatRequest.consultant_type,
            image: chatRequest.consultant_image || "./images/placeholder.svg",
          }
        : {
            id: chatRequest.patient_id,
            name: chatRequest.patient_full_name,
            type: "patient",
            image: chatRequest.patient_image || "./images/placeholder.svg",
          },
    [isPatient, chatRequest]
  );

  const allMessages = useMemo(() => {
    console.log("🔄 إعادة حساب allMessages", {
      dataPages: data?.pages?.length,
      messagesLength: messages.length,
      optimisticCount: optimisticMessages.length,
    });

    // استخدام messages بدلاً من data.pages مباشرة
    const merged = [...messages, ...optimisticMessages];

    // إزالة التكرارات
    const uniqueMessages = merged.reduce<Message[]>((acc, current) => {
      if (!current || !current.id) return acc;

      const exists = acc.find((msg) => msg.id === current.id);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    // الترتيب من الأقدم للأحدث
    // const sorted = uniqueMessages.sort(
    //   (a, b) =>
    //     new Date(b.created_at).getTime() -  new Date(a.created_at).getTime()
    // );

    // console.log(`📈 allMessages النتيجة: ${sorted.length} رسالة`);

    return uniqueMessages;
  }, [messages, optimisticMessages, data]);


  useEffect(() => {
    // عندما ينتهي تحميل الصفحات التالية، أعد ضبط isLoadingMore
    if (!isFetchingNextPage && isLoadingMore) {
      console.log("🔄 إعادة ضبط isLoadingMore إلى false");
      setIsLoadingMore(false);
    }
  }, [isFetchingNextPage, isLoadingMore]);
  // أضف هذه الـ useEffect للتحقق من حالة البيانات
  useEffect(() => {
    console.log("🔍 فحص حالة الـ query:", {
      hasNextPage,
      isFetchingNextPage,
      pagesCount: data?.pages?.length || 0,
      totalMessages: messages.length,
      optimisticMessagesCount: optimisticMessages.length,
    });
  }, [
    data,
    hasNextPage,
    isFetchingNextPage,
    messages.length,
    optimisticMessages.length,
  ]);

  // 🔥 الحل الذكي: تحميل البيانات تلقائياً عند الوصول للأعلى دون الحاجة للسكرول للأسفل
  useEffect(() => {
    if (isAtTop && hasNextPage && !isFetchingNextPage) {
      console.log("⬆️ المستخدم في الأعلى وهناك بيانات أقدم - تحميل تلقائي");
      fetchNextPage();
      // لا نعيد setIsAtTop إلى false - نتركها كما هي حتى ينتهي التحميل
    }
  }, [isAtTop, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isAtBottom) {
      setShouldFollowOutput(true);
    }
  }, [isAtBottom]);

  useEffect(() => {
    // عند بدء تحميل رسائل جديدة، عطل المتابعة
    if (isFetchingNextPage) {
      setShouldFollowOutput(false);
    }

    // عند انتهاء التحميل، أعد تقييم المتابعة
    return () => {
      if (!isFetchingNextPage && isAtBottom) {
        setShouldFollowOutput(true);
      }
    };
  }, [isFetchingNextPage, isAtBottom]);

  const messageRenderer = useCallback(
    (index: number, message: Message) => {
      if (!message) return null;
      const senderId =
        typeof message.sender_id === "object"
          ? message.sender_id.id
          : message.sender_id;
      const isMyMessage = Number(senderId) === Number(currentUserId);

      return (
        <MessageBubble
          key={message.id}
          message={message}
          isMyMessage={isMyMessage}
        />
      );
    },
    [currentUserId]
  );

  // معالجة الرسائل غير المقروءة
  useEffect(() => {
    if (!allMessages || !currentUserId) return;

    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current);
    }

    markAsReadTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      if (now - lastProcessedRef.current < 500) return;

      const unreadSenders = new Set<number>();
      allMessages.forEach((msg) => {
        const senderId =
          typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;
        const receiverId =
          typeof msg.receiver_id === "object"
            ? msg.receiver_id.id
            : msg.receiver_id;

        if (
          Number(senderId) !== Number(currentUserId) &&
          Number(receiverId) === Number(currentUserId) &&
          !msg.is_read
        ) {
          unreadSenders.add(Number(senderId));
        }
      });

      if (unreadSenders.size > 0) {
        lastProcessedRef.current = now;
        unreadSenders.forEach((senderId) => {
          markAsReadMutation.mutate(senderId);
        });
      }
    }, 300);

    return () => {
      if (markAsReadTimeoutRef.current) {
        clearTimeout(markAsReadTimeoutRef.current);
      }
    };
  }, [allMessages, currentUserId, markAsReadMutation]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !currentUserId) return;

    setShouldFollowOutput(true);
    setIsAtBottom(true);
    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      message: newMessage.trim(),
      sender_id: Number(currentUserId),
      receiver_id: otherUser.id,
      chat_request_id: chatRequest.id,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attachment: selectedPreview || null,
      attachment_type: selectedFile
        ? selectedFile.type.startsWith("image/")
          ? "image"
          : "file"
        : null,
      read_at: null,
      status: "sending",
      deleted_at: null,
    };

    setOptimisticMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      let realMessage: Message;

      if (selectedFile) {
        const form = new FormData();
        form.append("receiver_id", String(otherUser.id));
        form.append("message", newMessage.trim());
        form.append("chat_request_id", String(chatRequest.id));
        form.append("attachment", selectedFile);
        const attType = selectedFile.type.startsWith("image/")
          ? "image"
          : "file";
        form.append("attachment_type", attType);

        const payload = {
          formData: form,
          onUploadProgress: (ev?: unknown) => {
            if (!ev || typeof ev !== "object") return;
            const maybe = ev as { loaded?: number; total?: number };
            const loaded = typeof maybe.loaded === "number" ? maybe.loaded : 0;
            const total = typeof maybe.total === "number" ? maybe.total : 0;
            if (total) {
              const percent = Math.round((loaded / total) * 100);
              setUploadProgress(percent);
            }
          },
        };

        realMessage = (await sendMessageMutation.mutateAsync(
          payload
        )) as Message;
      } else {
        realMessage = (await sendMessageMutation.mutateAsync({
          receiver_id: otherUser.id,
          message: newMessage.trim(),
          chat_request_id: chatRequest.id,
        })) as Message;
      }

      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...realMessage, status: "sent" } : msg
        )
      );

      handleRemoveFile();
    } catch (error) {
      logger.error("فشل في إرسال الرسالة:", error);
      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("حجم الملف أكبر من الحد المسموح (10MB)");
      e.currentTarget.value = "";
      return;
    }

    if (selectedPreview) URL.revokeObjectURL(selectedPreview);

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedPreview(url);
    setShowUploadMenu(false);
    setUploadProgress(0);
  };

  const handleRemoveFile = () => {
    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
      setSelectedPreview(null);
    }
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = (type: "image" | "file") => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.accept = type === "image" ? "image/*" : "*/*";
    setShowUploadMenu(false);
    fileInputRef.current.click();
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <div className="text-lg font-semibold mb-2">
              خطأ في تحميل المحادثة
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
          <span className="mr-2">جاري تحميل المحادثة...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[900px] flex flex-col">
      <ChatHeader otherUser={otherUser} onBack={onBack} />

      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1 overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              حدث خطأ في تحميل الرسائل
            </div>
          ) : allMessages.length > 0 ? (
            <Virtuoso
              ref={virtuosoRef}
              data={allMessages}
              itemContent={messageRenderer}
              overscan={500}
              className="h-full"
              // ✅ ابدأ من الأسفل (الأحدث)
              initialTopMostItemIndex={allMessages.length - 1}
              alignToBottom={true}
              // ✅ عند الوصول للأعلى (تحميل رسائل أقدم)
              atTopThreshold={200}
              atTopStateChange={(atTop) => {
                if (atTop) {
                  console.log("⬆️ المستخدم وصل للأعلى - سيتم التحميل التلقائي");
                  setIsAtTop(true);
                } else {
                  setIsAtTop(false);
                }
              }}
              // ✅ تتبع حالة الوصول للأسفل
              atBottomStateChange={(atBottom) => {
                console.log("📍 atBottomStateChange:", atBottom);
                setIsAtBottom(atBottom);
              }}
              increaseViewportBy={{ top: 400, bottom: 400 }}
              // ✅ تجاهل endReached
              endReached={() => {
                console.log("⬇️ وصلنا للأسفل (أحدث الرسائل)");
              }}
              // ✅ المتابعة التلقائية للأسفل
              followOutput={shouldFollowOutput ? "auto" : false}
              components={{
                Header: () =>
                  isFetchingNextPage && (
                    <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-[#32A88D]" />
                      <span className="mr-2 text-sm text-gray-500">
                        جاري تحميل رسائل أقدم...
                      </span>
                    </div>
                  ),
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              لا توجد رسائل بعد
            </div>
          )}
        </div>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedFile={selectedFile}
          selectedPreview={selectedPreview}
          uploadProgress={uploadProgress}
          showUploadMenu={showUploadMenu}
          fileInputRef={fileInputRef}
          onSendMessage={handleSendMessage}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onOpenFilePicker={openFilePicker}
          onSetShowUploadMenu={setShowUploadMenu}
          isSending={sendMessageMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default memo(ChatInterface);
