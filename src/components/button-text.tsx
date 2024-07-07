import Link from "next/link";
import React from "react";
import { cn } from "~/utils/css";

type TextButtonProps = {
  buttonText: string;
  className?: string;
  hrefLink?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export const TextButton: React.FC<TextButtonProps> = ({
  buttonText,
  className,
  hrefLink,
  isActive = true,
  onClick,
}) => {
  // isActive = isActive ?? true;

  const selectableStyle = "hover:z-50 hover:scale-110 active:scale-90";
  const textButtonStyle =
    "group relative select-none text-center font-mono font-extrabold uppercase italic tracking-tighter transition-all active:scale-100 group-hover:scale-110";
  const gradientTextStyle =
    "text-transparent bg-clip-text bg-gradient-to-r from-[#c74ee6] to-[#783fa7]";
  const textShadowStyle = "group-hover:drop-shadow-[0_0_3px_rgba(0,0,0,0.1)]";
  const spanStyle =
    "absolute -bottom-1 h-1 w-0 bg-[#CA33EF] transition-all group-hover:w-3/6 group-hover:opacity-80 group-hover:shadow-[0_0_3px_rgba(202,51,239,0.5)]";
  const notActiveStyle =
    "group-pointer-events-none pointer-events-none opacity-30";
  const cursorStyle = "cursor-pointer";

  const ContentWrapper = hrefLink ? Link : "div";

  return (
    <ContentWrapper
      className={cn(
        textButtonStyle,
        selectableStyle,
        { [notActiveStyle]: !isActive },
        { [cursorStyle]: !hrefLink },
        className,
      )}
      href={hrefLink!}
      onClick={onClick}
    >
      <span className={cn(gradientTextStyle, textShadowStyle)}>
        {buttonText}
      </span>
      <span className={cn(spanStyle, "left-1/2")}></span>
      <span className={cn(spanStyle, "right-1/2")}></span>
    </ContentWrapper>
  );
};
