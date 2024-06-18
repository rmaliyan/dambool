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
  onClick?: () => void;  
};

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  showFace,
  className,
  selectable,
  dropShadow,
  transparent,  
  onClick
}) => {

  // selectable = selectable === undefined ? true : selectable 
  // selectable = selectable ?? true;     

  dropShadow = dropShadow ?? true;
  selectable = showFace && selectable;
  transparent = transparent ?? false;
  
  const suitColorStyle = {
    ["hidden"]: !showFace,
    ["text-rose-600 "]: card.suit == "♥" || card.suit == "♦",
    ["text-neutral-600"]: card.suit == "♠" || card.suit == "♣",
  };

  const selectableStyle = "hover:z-50 hover:scale-110 hover:shadow-[0px_0px_3px_4px_rgba(10,10,10,0.2)] active:scale-90 active:shadow-[0px_0px_2px_1px_rgba(10,10,10,0.5)]";

  return (
    <div    
      onClick = {onClick}       
      className={cn(
        "relative h-24 w-16 min-w-16 overflow-hidden rounded-lg transition-all duration-100 shadow-[0px_0px_2px_2px_rgba(10,10,10,0.04)]",
        className,
        {
          ["opacity-25"]:
          transparent,
          ["shadow-[0px_0px_2px_2px_rgba(10,10,10,0.2)]"]:
            dropShadow,
          ["bg-[url('/assets/card-back-red-border.jpg')] bg-cover bg-center"]:
            !showFace,
          ["bg-white"]:
            showFace,
            [selectableStyle] :
            selectable
        }
      )}
    >
      <div className="absolute h-full w-full bg-transparent">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={cn(
              "h-full w-1 rotate-45 transform bg-gradient-to-b from-transparent via-gray-100 to-transparent",
              { ["hidden"]: !showFace },
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
              suitColorStyle,
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
              suitColorStyle,
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
        ></div>
      </div>
    </div>

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //   <div className={cn("overflow-hidden h-24 w-16 min-w-16 rounded-lg shadow-[0px_0px_2px_2px_rgba(10,10,10,0.2)] transition-all duration-100", className,{["bg-[url('/assets/card-back-red.jpg')] bg-cover bg-center"]:!showFace,["bg-white hover:z-50 hover:scale-110 hover:shadow-[0px_0px_3px_4px_rgba(10,10,10,0.2)] active:scale-90 active:shadow-[0px_0px_2px_1px_rgba(10,10,10,0.5)]"]:showFace,},)}>

    //   <div className="absolute bg-transparent w-full h-full" >
    //     <div className="flex items-center justify-center h-full w-full">
    //       <div className= {cn("bg-gradient-to-b from-transparent via-gray-200 to-transparent w-1 h-full transform rotate-45",{["hidden"]: !showFace,},)} ></div>
    //     </div>
    //   </div>

    //   <div className="flex h-full w-full items-center justify-center">

    //     <div className="h-full w-full text-center pt-2">

    //       <div className={cn("h-1/4 w-full select-none text-center text-3xl flex items-center justify-center", {["hidden"]: !showFace,["text-rose-600 "]: card.suit == "♥" || card.suit == "♦",["text-neutral-600"]: card.suit == "♠" || card.suit == "♣",})}>{card.suit}
    //       </div>

    //       <div className={cn("h-1/4 w-full pt-1 select-none text-center text-xl font-semibold text-neutral-600 flex items-center justify-center",{["hidden"]: !showFace,},)}>{getRankText(card.rank)}
    //       </div>

    //       <div className="h-1/4 w-full grow bg-transparent">
    //       </div>
    //       <div className="h-1/4 w-full grow bg-transparent">
    //       </div>

    //     </div>

    //     <div className="h-full w-full flex flex-col items-center justify-center text-center pb-2">

    //       <div className="h-1/4 w-full grow bg-transparent ">
    //       </div>
    //       <div className="h-1/4 w-full grow bg-transparent ">
    //       </div>

    //       <div className={cn("flex items-center justify-center h-1/4 w-full select-none text-center text-xl font-semibold text-neutral-600 rotate-180 ",{["hidden"]: !showFace,},)}>{getRankText(card.rank)}
    //       </div>

    //       <div className={cn("flex items-center justify-center h-1/4 w-full select-none text-center text-3xl rotate-180 ", {["hidden"]: !showFace,["text-rose-600 "]: card.suit == "♥" || card.suit == "♦",["text-neutral-600"]: card.suit == "♠" || card.suit == "♣",})}>{card.suit}
    //       </div>

    //     </div>

    //     <div className={cn("absolute opacity-15 bg-transparent w-full h-full bg-gradient-to-t from-black",{["hidden"]: !showFace,},)} ></div>

    //   </div>
    // </div>

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Simpler card variant: only 1 copy of suit and rank

    //   <div
    //   className={cn(
    //     "h-24 w-16 min-w-16 rounded-lg shadow-[0px_0px_2px_2px_rgba(10,10,10,0.2)] transition-all duration-100",
    //     className,
    //     {
    //       ["bg-[url('/assets/card-back-red.jpg')] bg-cover bg-center"]:
    //         !showFace,
    //       ["bg-white hover:z-50 hover:scale-110 hover:shadow-[0px_0px_3px_4px_rgba(10,10,10,0.2)] active:scale-90 active:shadow-[0px_0px_2px_1px_rgba(10,10,10,0.5)]"]:
    //         showFace,
    //     },
    //   )}
    // >
    //   <div className="flex h-full w-full flex-col items-center justify-center">
    //     <div
    //       className={cn("select-none text-4xl", {
    //         ["hidden"]: !showFace,
    //         ["text-rose-600 "]: card.suit == "♥" || card.suit == "♦",
    //         ["text-neutral-600"]: card.suit == "♠" || card.suit == "♣",
    //       })}
    //     >
    //       {card.suit}
    //     </div>

    //     <div
    //       className={cn("select-none text-3xl font-semibold text-neutral-600", {
    //         ["hidden"]: !showFace,
    //       })}
    //     >
    //       {getRankText(card.rank)}
    //     </div>
    //   </div>
    // </div>
  );
};
