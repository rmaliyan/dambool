import React from "react";
import { DeckModel } from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";

export type DeckAreaComponentProps = {
  deck: DeckModel;
  className?: string;
};

export const DeckAreaComponent: React.FC<DeckAreaComponentProps> = ({
  deck,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <CardComponent card={deck.trumpCard} showFace={true} />
      <div className="flex items-center justify-center">
        {deck.cards.slice(1).map((element, index) => (
          <div className="relative h-24 w-[0.5px] flex-auto">
            <CardComponent
              className="absolute"
              card={element}
              showFace={false}
              dropShadow={index == 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
