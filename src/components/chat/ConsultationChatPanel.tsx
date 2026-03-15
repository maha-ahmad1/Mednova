"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/features/chat/ui/ChatInterface";
import type { ChatRequest } from "@/types/chat";
import type { ConsultationRequest } from "@/types/consultation";

interface ConsultationChatPanelProps {
  request: ConsultationRequest;
  canShowChat: boolean;
  onBackToDetails: () => void;
  backButtonLabel?: string;
}

const getChatUnavailableMessage = (status: ConsultationRequest["status"]) => {
  if (status === "pending") {
    return "يجب قبول الاستشارة أولاً لبدء المحادثة";
  }

  if (status === "cancelled") {
    return "تم رفض هذه الاستشارة";
  }

  return "لا يمكن الوصول إلى المحادثة في الوقت الحالي";
};

const mapRequestToChatRequest = (request: ConsultationRequest): ChatRequest => ({
  id: request.id,
  patient_id: request.data.patient.id,
  consultant_id: request.data.consultant.id,
  consultant_type: request.data.consultant_type,
  status: request.status,
  first_patient_message_at: request.data.first_patient_message_at,
  first_consultant_message_at: request.data.first_consultant_reply_at,
  patient_message_count: request.data.patient_message_count,
  consultant_message_count: request.data.consultant_message_count,
  max_messages_for_patient: request.data.max_messages_for_patient,
  created_at: request.created_at,
  updated_at: request.updated_at,
  consultant_full_name: request.data.consultant.full_name,
  patient_full_name: request.data.patient.full_name,
  patient_image: request.data.patient.image,
  consultant_image: request.data.consultant.image,
});

export default function ConsultationChatPanel({
  request,
  canShowChat,
  onBackToDetails,
  backButtonLabel = "العودة إلى التفاصيل",
}: ConsultationChatPanelProps) {
  if (!canShowChat) {
    return (
      <div className="p-8 text-center h-full flex items-center justify-center">
        <div>
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            المحادثة غير متاحة
          </h3>
          <p className="text-gray-500 text-sm">
            {getChatUnavailableMessage(request.status)}
          </p>
          <Button onClick={onBackToDetails} variant="outline" className="mt-4">
            {backButtonLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      chatRequest={mapRequestToChatRequest(request)}
      onBack={onBackToDetails}
    />
  );
}

