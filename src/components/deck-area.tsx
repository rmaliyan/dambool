import React from "react";
import type { DeckModel } from "~/game-logic";
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
      <CardComponent card={deck.trumpCard} showFace={true} transparent={!(deck.cards.length > 0)}/>
      <div className="relative flex items-center justify-center">
        
      {deck.cards.length > 0 ? <div className="absolute left-[10px] top-[98px] opacity-50 block select-none truncate bg-gradient-to-l from-[#b1b0b0] to-[#ece9e9] bg-clip-text px-1 text-center text-3xl font-extrabold italic tracking-tighter text-transparent transition-all">{deck.cards.length}</div> : ""}
       
        {deck.cards.slice(1).map((element, index) => (
          <div className="relative h-24 w-[0.5px] flex-auto" key = {index}>
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
