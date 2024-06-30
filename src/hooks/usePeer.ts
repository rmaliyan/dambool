import { useContext } from "react";
import { PeerContext } from "../context/PeerContext";

export function usePeer() {    
  return useContext(PeerContext);  
}
