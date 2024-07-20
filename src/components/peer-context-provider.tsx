import React, { useCallback, useEffect, useState } from "react";
import { DamboolEventType, PeerContext } from "../context/PeerContext";
import Peer, { PeerJSOption, PeerConnectOption, DataConnection } from "peerjs";
import { api } from "~/utils/api";

type PeerContextProviderProps = {
  peerOptions?: PeerJSOption;
  roomId: number;
};

type DamboolEvent = {
  type: DamboolEventType;
  serialNumber: number;
  senderId: string;
};

export function PeerContextProvider({
  children,
  roomId,
  peerOptions,
}: React.PropsWithChildren<PeerContextProviderProps>) {
  const [peer, setPeer] = useState<Peer | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: peerId, isSuccess: isPeerIdSuccess } =
    api.roomLobby.getPeerId.useQuery({
      roomId: roomId,
    });

  const { data: peerIdList, isSuccess: isPeerIdListSuccess } =
    api.roomLobby.getPeerIdList.useQuery({ roomId: roomId });

  const { mutateAsync: mutatePeerId } = api.roomLobby.setPeerId.useMutation();

  const { roomLobby, game } = api.useUtils();

  const handleLobbyEvent = useCallback(async () => {
    await roomLobby.getPlayerList.invalidate({ roomId });
  }, [roomId, roomLobby]);

  const handleGameEvent = useCallback(async () => {
    await game.getCurrentGame.invalidate({ roomId });
  }, [roomId, game]);

  const connectedHandler = useCallback((connection?: DataConnection) => {   
    if (!connection) {
      return;
    }
    // eslint-disable-next-line  @typescript-eslint/no-misused-promises
    connection.on("data", (event) => {
      if (event === "game") {
        void handleGameEvent();
        return;
      }      
      void handleLobbyEvent();
    });    
    void handleLobbyEvent();
  }, [handleLobbyEvent]);

  useEffect(() => {
    if (!isPeerIdSuccess) {
      return;
    }

    createPeer(peerId);
  }, [peerId, isPeerIdSuccess]);

  function createPeer(id?: string | null, peerOptions?: PeerJSOption) {
    setPeer(id ? new Peer(id, peerOptions) : new Peer());
  }

  function connect(id: string, peerConnectionOptions?: PeerConnectOption) {
    if (peer === undefined) {
      return;
    }
    return peer.connect(id, peerConnectionOptions);
  }

  function disconnect() {
    if (peer === undefined) {
      return;
    }

    peer.disconnect();
    peer.destroy();
    setPeer(undefined);
  }

  useEffect(() => {
    if (peer === undefined) {
      return;
    }

    const openHandler = (id: string) => {
      void mutatePeerId({ roomId: roomId, peerId: id });
      setIsOpen(true);
    };

    const disconnectedHandler = () => {
      setConnected(true);
    };

    peer.on("connection", connectedHandler);
    peer.on("disconnected", disconnectedHandler);
    peer.on("open", openHandler);

    return () => {
      peer.off("connection", connectedHandler);
      peer.off("disconnected", disconnectedHandler);
      peer.off("open", openHandler);
    };
  }, [peer, roomId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (!isPeerIdListSuccess) {
      return;
    }

    for (const peer of peerIdList) {
      const connection = connect(peer);
      connectedHandler(connection);
    }
  }, [peerIdList, isPeerIdListSuccess, isOpen]);

  const triggerEvent = (event: DamboolEventType) => {
    if (!peer) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const peerConectionList = peer.connections as {
      [key: string]: DataConnection[];
    };

    for (const peerId in peerConectionList) {
      for (const connection of peerConectionList[peerId]!) {
        void connection.send(event);
      }
    }
  };

  return (
    <PeerContext.Provider
      value={{
        triggerEvent,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
}
