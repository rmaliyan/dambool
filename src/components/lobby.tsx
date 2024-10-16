import Link from "next/link";
import React from "react";
import { IconElement } from "./icon-element";
import { TextButton } from "./button-text";
import { api } from "~/utils/api";
import { cn } from "~/utils/css";
import { usePeer } from "~/hooks/usePeer";
import Image from "next/image";
import type{ StaticImageData } from "next/image";

import DamboolLogo from "~/assets/dambool-logo-final-300.webp";
import IconCrown from "~/assets/icons/icon-crown.svg";
import IconEdit from "~/assets/icons/icon-edit.svg";
import IconDelete from "~/assets/icons/icon-delete.svg";
import IconLoading from "~/assets/icons/icon-loading.svg";
import IconCheck from "~/assets/icons/icon-check.svg";

//Try to figur out later how to customize svg imput as a certain type. Check custom.d.ts in root
// const IconCrownUrl:StaticImageData = IconCrown;
// const IconEditUrl:StaticImageData = IconEdit;
// const IconDeleteUrl:StaticImageData = IconDelete;
// const IconLoadingUrl:StaticImageData = IconLoading;
// const IconCheckUrl:StaticImageData = IconCheck;


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IconCrownUrl:StaticImageData = IconCrown;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IconEditUrl:StaticImageData = IconEdit;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IconDeleteUrl:StaticImageData = IconDelete;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IconLoadingUrl:StaticImageData = IconLoading;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IconCheckUrl:StaticImageData = IconCheck;


export type LobbyComponentProps = {
  className?: string;
  roomId: number;
  ownerId: number;
  playerId: number;
};

export const LobbyComponent: React.FC<LobbyComponentProps> = ({
  className,
  roomId,
  ownerId,
  playerId,
}) => {
  const {
    data: currentRoomPlayers,
    isLoading,
    isError,
  } = api.roomLobby.getPlayerList.useQuery({ roomId: roomId });

  const currentRoomActivePlayers = currentRoomPlayers
    ? currentRoomPlayers.filter((elem) => elem.isReady)
    : [];

  const utils = api.useUtils();

  const { triggerEvent } = usePeer()!;

  const { mutate: mutateStartGame, error:StartGameError } = api.game.startGame.useMutation({
    async onSuccess() {
      await utils.game.getCurrentGame.invalidate();
      triggerEvent("game");
    },
  });

  const { mutateAsync: mutateSetReady, error: setReadyError } =
    api.roomLobby.setReady.useMutation({
      async onSuccess(_) {
        await utils.roomLobby.getPlayerList.invalidate();
        triggerEvent("lobby");
      },
    });

  const { mutate: mutatePlayerName } = api.roomLobby.setPlayerName.useMutation({
    async onSuccess() {
      await utils.roomLobby.getPlayerList.invalidate();
      triggerEvent("lobby");
    },
  });

  const { mutate: mutateRmovePlayer } = api.roomLobby.removePlayer.useMutation({
    async onSuccess() {
      await utils.roomLobby.getPlayerList.invalidate();
      triggerEvent("lobby");
    },
  });

  if (isError) {
    return <div>error</div>;
  }

  if (isLoading) {
    return <div>loading</div>;
  }

  const isReady = currentRoomPlayers!.find(
    (element) => element.playerId === playerId,
  )!.isReady;

  const isOwner = playerId === ownerId;

  const handleStartGame = () => {
    mutateStartGame({ roomId });
    if (StartGameError) {
      console.log (StartGameError.message)
    };
  };

  const handleCopyRoomUrl = async () => {
    await navigator.clipboard.writeText(window.location.toString());
  };

  const handleSetReady = async () => {
    await mutateSetReady({ roomId, isReadyState: !isReady });
    if (setReadyError) {
      console.log (setReadyError)
    };
  };

  const handleEditName = (playerName: string) => {
    const newName = prompt("Input new name", playerName);
    if (!newName || newName === "") {
      return;
    }
    mutatePlayerName({ roomId: roomId, playerName: newName });
  };

  const handleRemovePlayer = (deletedPlayerId: number) => {
    if (playerId !== ownerId) {
      alert("You don't have the right, O you don't have the right!");
    }
    mutateRmovePlayer({ roomId, deletedPlayerId });
  }; 

  return (
    // isSmaller = isSmaller ?? false;

    <div
      className={cn(
        "mx-6 flex w-[420px] flex-col items-center justify-center rounded-xl bg-white",
        className,
      )}
    >
      <Link href="/" target="_blank">
        {/* <Image
          className="pointer-events-none w-[350px]"
          src="/assets/dambool-logo-final-300.webp"
          alt="dambool logo"
        /> */}
        <div className="relative w-[350px] h-[188px]">               
                <Image 
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={DamboolLogo} alt="DamboolLogo" fill={true} /> 
        </div>
      </Link>

      {
        /* <div>
        <span className="font-semibold text-neutral-600">Game room</span>{" "}
        <span className="font-semibold text-[#B032E7]">{roomId}</span>
      </div>
      <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr>

      <div className="text-sm text-neutral-600">
        Games list should be added here.
      </div> */
        // Games list should be added here
      }

      <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr>

      <div className="text-center text-sm text-neutral-600">
        <span>
          Share this lobby&apos;s{" "}
          <span
            className="cursor-pointer font-bold hover:text-violet-500 active:text-gray-800"
            onClick={handleCopyRoomUrl}
          >
            url
          </span>{" "}
          to invite friends.
          <br />
        </span>

        {isOwner && (
          <span>
            You can start the game when <br /> at least 2 players are ready.
          </span>
        )}
      </div>

      <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr>

      <span className="font-semibold text-neutral-600">Players List</span>
      {/* <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr> */}

      <div className="flex flex-col">
        {currentRoomPlayers!.map((player) => (
          <div className="flex items-center gap-2" key={player.playerId}>
            <div
              className={cn({
                ["hidden"]: !(player.playerId === ownerId),
              })}
            >
              <IconElement
                imageUrl={IconCrownUrl}
                iconAltText="Icon Crown"
                selectable={false}
              />
            </div>

            <div
              className={cn({
                ["hidden"]: !player.isReady,
              })}
            >
              <IconElement
                imageUrl={IconCheckUrl}
                iconAltText="Icon Check"
                selectable={false}
              />
            </div>

            <div
              className={cn({
                ["hidden"]: player.isReady || player.playerId === ownerId,
              })}
            >
              <IconElement
                imageUrl={IconLoadingUrl}
                iconAltText="Icon Loading"
                selectable={false}
              />
            </div>

            <div
              className={cn({
                ["text-neutral-600"]:
                  player.isReady || player.playerId === ownerId,
                ["text-neutral-400"]:
                  !player.isReady && player.playerId !== ownerId,
                ["text-[#B032E7]"]: player.playerId === playerId,
              })}
              title={"PlayerId:" + player.playerId.toString()}
            >
              {/* player name: */}
              {player.playerName}
            </div>

            <div
              className={cn({
                ["hidden"]: !(player.playerId === playerId),
              })}
            >
              <IconElement
                imageUrl={IconEditUrl}
                iconAltText="Icon Edit"
                selectable={true}
                onClick={() => handleEditName(player.playerName)}
              />
            </div>

            <div
              className={cn("ml-[-3px]", {
                ["hidden"]:
                  // player.playerId === ownerId ||
                  player.playerId === playerId || playerId !== ownerId,
              })}
            >
              <IconElement
                imageUrl={IconDeleteUrl}
                iconAltText="Icon Delete"
                selectable={true}
                onClick={() => handleRemovePlayer(player.playerId)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 mt-8 flex gap-10 pb-4 transition-all">
        {isOwner && (
          <TextButton
            onClick={handleStartGame}
            className="text-2xl"
            isActive={currentRoomActivePlayers?.length > 0}
          ><span>Start Game</span></TextButton>
        )}

        <TextButton
          onClick={handleCopyRoomUrl}
          className="text-2xl"
        ><span>Copy Url</span></TextButton>

        {!isOwner && (
          <TextButton
            onClick={handleSetReady}
            className="text-2xl"
          ><span>{!isReady ? "Ready" : "Not Ready"}</span></TextButton>
        )}
      </div>
    </div>
  );
};
