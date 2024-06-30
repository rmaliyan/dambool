import { createContext } from "react";

export type DamboolEventType = "game" | "lobby" 

interface IPeerContext {
  triggerEvent: (event:DamboolEventType) => void;
}

export const PeerContext = createContext<IPeerContext | undefined>(undefined);
