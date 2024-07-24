import React from "react";
import { BattleAreaModel } from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";

export type BattleAreaComponentProps = {
  battleArea: BattleAreaModel;
  className?: string;
  onPairClick?: (pairIndex: number) => void;
};

export const BattleAreaComponent: React.FC<BattleAreaComponentProps> = ({
  battleArea,
  className,
  onPairClick,
}) => {
  return (
    <div
      className={cn(
        "flex w-full h-[128px] shrink-0 items-center justify-center gap-4 pr-14",
        className,
      )}
    >
      {battleArea.pairs.map((element, index) => {
        return (
          <div className="relative h-[128px] max-w-[100px] flex-auto">
            <div className="absolute h-[128px] w-[96px]" key={index}>
              <CardComponent
                card={element.attack}
                className="absolute left-0 top-0"
                onClick={() => onPairClick?.(index)}
                showFace={true}
              />
              {element.defence ? (
                <CardComponent
                  className="absolute bottom-0 right-0"
                  card={element.defence}
                  showFace={true}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
