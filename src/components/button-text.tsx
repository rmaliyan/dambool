import Link from "next/link";
import React from "react";
import { cn } from "~/utils/css";

type TextButtonProps = {
  buttonText: string;
  className?: string;
  hrefLink?: string;
  onClick?: () => void;
};

export const TextButton: React.FC<TextButtonProps> = ({
  buttonText,
  className,
  hrefLink,
  onClick,
}) => {
  const selectableStyle =
    "hover:z-50 hover:scale-110 active:scale-90";

  const textButtonStyle =
    "group relative select-none bg-gradient-to-r from-[#c74ee6] to-[#783fa7] bg-clip-text text-center font-mono font-extrabold uppercase italic tracking-tighter text-transparent transition-all active:scale-100 group-hover:scale-110";

  const textShadowStyle =
    "group-hover:drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]";

  const spanStyle =
    "absolute -bottom-1 h-1 w-0 bg-[#CA33EF] transition-all group-hover:w-3/6 group-hover:opacity-80 group-hover:shadow-[0_0_3px_rgba(202,51,239,0.5)]";

  const ContentWrapper = hrefLink ? Link : 'div';

  return (
    <ContentWrapper
      className={cn(textButtonStyle, selectableStyle, className)}
      href={hrefLink!}
      onClick={onClick}
    >
      <span className={textShadowStyle}>{buttonText}</span>
      <span className={cn(spanStyle, "left-1/2")}></span>
      <span className={cn(spanStyle, "right-1/2")}></span>
    </ContentWrapper>
  );
};