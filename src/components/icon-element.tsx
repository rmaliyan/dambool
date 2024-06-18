import React from "react";
import { cn } from "~/utils/css";

type IconElementProps = {
  imageUrl: string;
  iconAltText: string;
  className?: string;
  selectable?: boolean;
  onClick?: () => void;
};

export const IconElement: React.FC<IconElementProps> = ({
  imageUrl,
  iconAltText,
  className,
  selectable,
  onClick,
}) => {
    
  selectable = selectable ?? false;

  const selectableStyle =
    "hover:z-50 hover:scale-110 hover:shadow-[0px_0px_3px_4px_rgba(10,10,10,0.1)] active:scale-90 active:shadow-[0px_0px_2px_1px_rgba(10,10,10,0.2)]";

  return (
    <div
      onClick={onClick}
      className={cn(
        "duration-100')] h-[18px] w-[18px] transition-all",
        className,        
        { [selectableStyle]: selectable },
      )}
    >
          <img
                className="h-full opacity-100"
                src={imageUrl}
                alt={iconAltText}
              ></img>
    </div>
  );
};
