import React from "react";
import { HandModel } from "~/game-logic";
import { CardComponent } from "./card";

export type HandComponentProps = {
  hand: HandModel;
  isPlayer: boolean;
  onCardClick?: (cardIndex: number) => void;
};

export const HandComponent: React.FC<HandComponentProps> = ({
  hand,
  isPlayer,
  onCardClick,
}) => {
  return (
    <div className="flex w-full shrink-0 items-center justify-center gap-2">
      {hand.cards.map((element, index) => (
        <div className="relative h-24 max-w-16 flex-auto" key={index}>
          <CardComponent
            onClick={() => onCardClick?.(index)}           
            className="absolute"
            card={element}
            showFace={isPlayer}
            selectable={isPlayer}
          />
        </div>
      ))}
    </div>
  );
};
