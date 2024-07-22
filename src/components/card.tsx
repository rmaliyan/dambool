import React from "react";
import { CardModel, Rank } from "~/game-logic";
import { cn } from "~/utils/css";

function getRankText(rank: Rank) {
  switch (rank) {
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    case 14:
      return "A";
    default:
      return rank.toString();
  }
}

type CardComponentProps = {
  card: CardModel;
  showFace: boolean;
  selectable?: boolean;
  className?: string;
  dropShadow?: boolean;
  transparent?: boolean;
  smaller?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  showFace,
  className,
  selectable,
  dropShadow,
  transparent,
  smaller,
  selected = false,
  onClick,
}) => {
  dropShadow = dropShadow ?? true;
  selectable = showFace && selectable;
  transparent = transparent ?? false;
  smaller = smaller ?? false;

  const selectedStyle = "-translate-y-5";

  const isRed = card.suit == "♥" || card.suit == "♦";
  const isBlack = card.suit == "♠" || card.suit == "♣";

  const suitColorStyle = {
    ["hidden"]: !showFace,
    ["text-rose-600 "]: isRed,
    ["text-neutral-600"]: isBlack,
  };

  const cardFaceKing = {
    ["bg-[url('/assets/king-red.svg')] bg-cover bg-center"]:
      isRed && card.rank === 13 && showFace,
    ["bg-[url('/assets/king-black.svg')] bg-cover bg-center"]:
      isBlack && card.rank === 13 && showFace,
  };

  const cardFaceJack = {
    ["bg-[url('/assets/jack-red.svg')] bg-cover bg-center"]:
      isRed && card.rank === 11 && showFace,
    ["bg-[url('/assets/jack-black.svg')] bg-cover bg-center"]:
      isBlack && card.rank === 11 && showFace,
  };

  const cardFaceQueen = {
    ["bg-[url('/assets/queen-red.svg')] bg-cover bg-center"]:
      isRed && card.rank === 12 && showFace,
    ["bg-[url('/assets/queen-black.svg')] bg-cover bg-center"]:
      isBlack && card.rank === 12 && showFace,
  };

  const selectableStyle =
    "hover:z-50 hover:scale-110 hover:shadow-[0px_0px_3px_4px_rgba(10,10,10,0.2)] active:scale-90 active:shadow-[0px_0px_2px_1px_rgba(10,10,10,0.5)]";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-24 w-16 min-w-16 overflow-hidden rounded-lg shadow-[0px_0px_2px_2px_rgba(10,10,10,0.04)] transition-all duration-100",
        className,
        {
          ...cardFaceKing,
          ...cardFaceJack,
          ...cardFaceQueen,
          ["opacity-25"]: transparent,
          ["shadow-[0px_0px_2px_2px_rgba(10,10,10,0.2)]"]: dropShadow,
          ["bg-[url('/assets/card-back-red-border.webp')] bg-cover bg-center"]:
            !showFace,
          ["bg-white"]:
            showFace &&
            card.rank !== 11 &&
            card.rank !== 12 &&
            card.rank !== 13,
          ["scale-75"]: smaller,
          [selectableStyle]: selectable,
          [selectedStyle]: selected,
        },
      )}
    >

      <div className="absolute h-full w-full bg-transparent">
        <div className="flex h-full w-full items-center justify-center">
          
          <div className={cn("absolute text-center text-5xl", suitColorStyle,
          {["hidden"]: card.rank !== 14},
          )}>{card.suit}</div>

          <div
            className={cn(
              "h-full w-1 rotate-45 transform bg-gradient-to-b from-transparent via-gray-100 to-transparent",
              {
                ["hidden"]:
                  !showFace ||
                  card.rank === 11 ||
                  card.rank === 12 ||
                  card.rank === 13 ||
                  card.rank === 14
              },
            )}
          ></div>
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center">
        <div className="h-full w-full pt-1 text-center">

          <div
            className={cn(
              "flex h-1/4 w-full select-none items-center justify-center text-center text-xl font-bold text-neutral-600",
              suitColorStyle,             
            )}
          >
            {getRankText(card.rank)}
          </div>

          <div
            className={cn(
              "flex h-1/4 w-full select-none items-center justify-center text-center text-2xl",
              suitColorStyle,  {["hidden"]: card.rank === 14},
            )}
          >
            {card.suit}
          </div>

          <div className="h-1/4 w-full grow bg-transparent"></div>
          <div className="h-1/4 w-full grow bg-transparent"></div>
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center text-center ">
          <div className="h-1/4 w-full grow bg-transparent "></div>
          <div className="h-1/4 w-full grow bg-transparent "></div>

          <div
            className={cn(
              "flex h-1/4 w-full rotate-180 select-none items-center justify-center text-center text-2xl ",
              suitColorStyle,  {["hidden"]: card.rank === 14},
            )}
          >
            {card.suit}
          </div>

          <div
            className={cn(
              "flex h-1/4 w-full rotate-180 select-none items-center justify-center text-center text-xl font-bold text-neutral-600 ",
              suitColorStyle,             
            )}
          >
            {getRankText(card.rank)}
          </div>
        </div>

        <div
          className={cn(
            "absolute h-full w-full bg-transparent bg-gradient-to-t from-black opacity-15",
            { ["hidden"]: !showFace },
          )}
        >

        </div>
      </div>

    </div>
  );
};
