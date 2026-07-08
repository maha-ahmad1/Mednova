import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserInfo {
  id: number;
  name: string;
  type: string;
  image: string;
}

interface ChatHeaderProps {
  otherUser: UserInfo;
  onBack?: () => void;
}

export function ChatHeader({ otherUser, onBack }: ChatHeaderProps) {
  const t = useTranslations("chat.header");
  const isRtl = useLocale() === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const getUserTypeText = (type: string) => {
    switch (type) {
      case "therapist":
        return t("therapist");
      case "rehabilitation_center":
        return t("center");
      default:
        return t("patient");
    }
  };

  return (
    <CardHeader className="border-b bg-gray-50 py-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <BackIcon className="w-4 h-4" />
          </Button>
        )}

        <Avatar className="w-10 h-10 border-2 border-[#32A88D]">
          <AvatarImage src={otherUser.image} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <div className="font-semibold">{otherUser.name}</div>
          <div className="text-sm text-gray-500">
            {getUserTypeText(otherUser.type)}
          </div>
        </div>
      </div>
    </CardHeader>
  );
}