import React, { ReactNode } from "react";
import { cn } from "~/utils/css";

type BadgeProps = {
  children?: ReactNode;
  className?: string;
  isActive?: boolean;
  imageUrl: string;
  iconAltText?: string;
};

export const BadgeComponent: React.FC<BadgeProps> = ({
  children,
  className,
  imageUrl,
  iconAltText = "Badge describing player status",
  isActive = true,
}) => {
  const notActiveStyle =
    "group-pointer-events-none pointer-events-none opacity-30";

//   const textStyle =
//     "text-transparent bg-clip-text bg-gradient-to-r from-[#999999] to-[#535353] select-none text-center font-extrabold italic tracking-tighter transition-all";

  return (
    <div
      className={cn(
        "relative min-w-[100px] rounded-lg bg-white py-1 pl-9 pr-2 shadow-md transition-all",
        { [notActiveStyle]: !isActive },
        className,
      )}
    >
      <img
        className="absolute -left-12 -top-9 h-[100px] object-contain"
        src={imageUrl}
        alt={iconAltText}
      ></img>
      <span className="block select-none truncate bg-gradient-to-l from-[#7e7e7e] to-[#535353] bg-clip-text px-1 text-center text-lg font-extrabold italic tracking-tighter text-transparent transition-all">
        {children}
      </span>
    </div>
  );
};


