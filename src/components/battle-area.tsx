import React from "react";
import {BattleAreaModel} from "~/game-logic";
import { CardComponent } from "./card";
import { cn } from "~/utils/css";


export type BattleAreaComponentProps = {
    battleArea: BattleAreaModel;  
    className?: string;
    selectedIndex?: number | null;
  };

export const BattleAreaComponent: React.FC<BattleAreaComponentProps> = ({battleArea, className, selectedIndex}) => {

    return (
        <div className = {cn("flex flex-row gap-4", className)}>
            {battleArea.pairs.map((element, index) => {
                return (
                  <div key = {index}>
                    <CardComponent card = {element.attack} showFace = {true}/>       
                    {element.defence ? <CardComponent className = "mx-8 -mt-16" card = {element.defence} showFace = {true}/> : null}            
                  </div>         
                )
            })}
        </div>
    )
};