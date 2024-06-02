import React from "react";
import { BeatenModel } from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";

export type BeatenAreaComponentProps = {
  beaten: BeatenModel;
  className?: string;
};

export const BeatenAreaComponent: React.FC<BeatenAreaComponentProps> = ({
  beaten,
  className,
}) => {
  return (
      
      <div className={cn("flex items-center justify-center", className)}>
        {beaten.cards.slice(1).map((element, index) => (
          <div className="relative h-24 w-[0.8px] flex-auto" key = {index}>
            <CardComponent
              className="absolute"
              card={element}
              showFace={false}
              dropShadow={index == 0}         
            />
          </div>
        ))}
      </div>   
  );
};
