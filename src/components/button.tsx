import React, { ReactNode } from "react";
import { cn } from "~/utils/css";

type ButtonProps = {
  children?: ReactNode;
  className?: string;
  hrefLink?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  className,
  hrefLink,
  isActive = true,
  onClick,
}) => {
  const selectableStyle = "hover:z-50 hover:scale-105 active:scale-95";
  const textStyle =
    "text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#c74ee6] to-[#783fa7] select-none text-center font-extrabold uppercase italic tracking-tighter transition-all";
  const notActiveStyle =
    "group-pointer-events-none pointer-events-none opacity-30";

  return (
    <div
      className={cn(
        "h-9 rounded-lg bg-white transition-all",
        selectableStyle,
        { [notActiveStyle]: !isActive },
        className,
      )}
      onClick={onClick}
      
    >
      <div className={cn("mt-1 pl-2 pr-3", textStyle)}>{children}</div>
    </div>

    // <div
    //   className={cn(
    //     textButtonStyle,
    //     selectableStyle,
    //     { [notActiveStyle]: !isActive },
    //     { [cursorStyle]: !hrefLink },
    //     className,
    //   )}
    //   href={hrefLink!}
    //   onClick={onClick}
    // >
    //   <span className={cn(gradientTextStyle, textShadowStyle)}>
    //     {children}
    //   </span>
    //   <span className={cn(spanStyle, "left-1/2")}></span>
    //   <span className={cn(spanStyle, "right-1/2")}></span>
    // </div>
  );
};
