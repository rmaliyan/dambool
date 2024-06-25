import React from "react";
import { HandModel } from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";

export type HandComponentProps = {
  hand: HandModel;
  isPlayer: boolean;
  isSmaller?: boolean;
  className?: string;
  onCardClick?: (cardIndex: number) => void;
};

export const HandComponent: React.FC<HandComponentProps> = ({
  hand,
  isPlayer,
  className,
  isSmaller,
  onCardClick,
}) => {

  isSmaller = isSmaller ?? false;

  return (
    <div
      className={cn(
        // "flex w-full shrink-0 items-center justify-center gap-2",
        "flex w-[500px] shrink-0 items-center justify-center gap-2",
        className,
        { ["w-[200px]"]: isSmaller },
      )}
    >
      {hand.cards.map((element, index) => (
        <div className="relative h-24 max-w-16 flex-auto" key={index}>
          <CardComponent
            onClick={() => onCardClick?.(index)}
            className="absolute"
            card={element}
            showFace={isPlayer}
            selectable={isPlayer}
            smaller={isSmaller}
          />
        </div>
      ))}
    </div>
  );
};
