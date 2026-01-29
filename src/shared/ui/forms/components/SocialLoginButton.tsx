import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SocialLoginButtonProps {
  provider: "google" | "facebook" | "twitter" | "apple";
  iconSrc?: string;
  label?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const providerDefaults = {
  google: {
    label: "Google",
    iconSrc: "/images/auth/google-icon.png",
  },
  facebook: {
    label: "Facebook",
    iconSrc: "/images/auth/facebook-icon.png",
  },
  twitter: {
    label: "Twitter",
    iconSrc: "/images/auth/twitter-icon.png",
  },
  apple: {
    label: "Apple",
    iconSrc: "/images/auth/apple-icon.png",
  },
};

const SocialLoginButton = React.forwardRef<
  HTMLButtonElement,
  SocialLoginButtonProps
>(({ provider, iconSrc, label, className, ...props }, ref) => {
  const defaults = providerDefaults[provider];
  const finalIconSrc = iconSrc || defaults.iconSrc;
  const finalLabel = label || defaults.label;

  return (
    <Button
      ref={ref}
      variant="outline"
      type="button"
      className={cn("w-full h-14 bg-transparent hover:bg-[#F0FDF4]", className)}
      {...props}
    >
      <Image
        src={finalIconSrc || "/images/placeholder.svg"}
        alt={`${finalLabel} Icon`}
        width={25}
        height={25}
        className="mr-2"
      />
      {finalLabel}
    </Button>
  );
});

SocialLoginButton.displayName = "SocialLoginButton";

export { SocialLoginButton };
