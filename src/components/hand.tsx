import React from "react";
import type { CardModel, HandModel, Suit } from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";

const orderArray = ["♠", "♣", "♥", "♦"];

export type HandComponentProps = {
  hand: HandModel;
  isPlayer: boolean;
  isSmaller?: boolean;
  className?: string;
  trumpSuit?: Suit;
  selectedIndex?: number | null;
  onCardClick?: (cardIndex: number) => void;
};

export const HandComponent: React.FC<HandComponentProps> = ({
  hand,
  isPlayer,
  className,
  isSmaller,
  trumpSuit,
  selectedIndex,
  onCardClick,
}) => {
  isSmaller = isSmaller ?? false;

  function compare(a: CardModel, b: CardModel) {   

    if (a.suit === trumpSuit && b.suit === trumpSuit) {
      return b.rank - a.rank;
    }
    if (a.suit === trumpSuit) {
      return -1;
    }
    if (b.suit === trumpSuit) {
      return 1;
    }
    if (a.rank !== b.rank) {
      return b.rank - a.rank;
    }
    if (a.suit === b.suit) {
      return 0;
    }
    return orderArray.indexOf(b.suit) - orderArray.indexOf(a.suit);
  }


  const sortedHand = isPlayer ? [...hand.cards].sort(compare) : hand.cards;

  return (
    <div
      className={cn(
        // "flex w-full shrink-0 items-center justify-center gap-2",
        "flex w-[320px] shrink-0 items-center justify-center gap-2",
        className,
        { ["w-[200px]"]: isSmaller },        
      )}
    >
      {sortedHand.map((element) => (
        <div
          className={cn("relative h-24 max-w-16 flex-auto")}
          key={`${element.suit}${element.rank}`}
        >
          <CardComponent
            onClick={() => onCardClick?.(hand.cards.indexOf(element))}
            className="absolute"
            card={element}
            showFace={isPlayer}
            selectable={isPlayer}
            selected={typeof selectedIndex === "number" && hand.cards[selectedIndex] === element}
            smaller={isSmaller}
          />
        </div>
      ))}
    </div>
  );
};
