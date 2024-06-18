import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { rooms, games, roomPlayers } from "~/server/db/schema";
import { GameModel } from "~/game-logic";
import { cn } from "~/utils/css";
import { api, createPlayerId, getPlayerId } from "~/utils/api";
import { GameComponent } from "~/components/game-area";
import { IconElement } from "~/components";

export const getServerSideProps = (async (context) => {
  const roomId = parseInt(context.params!.id as string);

  const currentRoom = await db
    .select({
      ownerId: rooms.ownerId,
    })
    .from(rooms)
    .where(eq(rooms.id, roomId));

  if (currentRoom.length === 0) {
    return {
      notFound: true,
    };
  }

  const ownerId = currentRoom[0]!.ownerId;

  let playerId = getPlayerId(context.req);

  if (!playerId) {
    playerId = createPlayerId(context.res);
  }

  let currentGame: GameModel | null = null;

  const roomRunningGames = await db
    .select()
    .from(games)
    .where(and(eq(games.isFinished, false), eq(games.roomId, roomId)));

  const currentRoomPlayers = await db
    .select({
      playerId: roomPlayers.playerId,
      playerName: roomPlayers.playerName,
      isReady: roomPlayers.isReady,
    })
    .from(roomPlayers)
    .where(eq(roomPlayers.roomId, roomId))
    .orderBy(roomPlayers.id);

  if (roomRunningGames.length != 0) {
    currentGame = roomRunningGames[0]!.gameJson;
  }

  const isNewPlayer =
    currentRoomPlayers.filter((player) => player.playerId === playerId)
      .length === 0;

  if (isNewPlayer) {
    const newPlayerName = `Player ${currentRoomPlayers.length + 1}`;
    await db.insert(roomPlayers).values({
      roomId: roomId,
      playerName: newPlayerName,
      playerId: playerId,
      isReady: false,
    });

    currentRoomPlayers.push({
      playerId: playerId,
      playerName: newPlayerName,
      isReady: false,
    });
  }

  return {
    props: { roomId, playerId, currentGame, currentRoomPlayers, ownerId},
  };
}) satisfies GetServerSideProps<{}>;

export default function CreateRoom({
  roomId,
  playerId,
  currentGame,
  currentRoomPlayers,
  ownerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { mutate: mutateStartGame, error } = api.game.startGame.useMutation();

  const { mutate: mutateSetReady, error: setReadyError } =
    api.roomLobby.setReady.useMutation();

  const isReady = currentRoomPlayers.find(
    (element) => element.playerId === playerId,
  )!.isReady;

  const isOwner = playerId === ownerId;

  const handleStartGame = () => {
    mutateStartGame({ roomId });
  };

  const handleCopyRoomUrl = () => {
    navigator.clipboard.writeText(window.location.toString());
  };

  const handleSetReady = () => {
    console.log(roomId);
    mutateSetReady({ roomId, isReadyState: !isReady });
  };  

  return (
    <main className="flex w-full items-center justify-center">     

      {error && <div className="text-red-600">{error.message}</div>}

      <div className="mx-6 flex w-[420px] flex-col items-center justify-center rounded-xl bg-white">
        <img
          className="pointer-events: none w-[350px]"
          src="/assets/dambool logo final-300.png"
          alt="dambool logo"
        ></img>
        <div>
          <span className="font-semibold text-neutral-600">Game room</span>{" "}
          <span className="font-semibold text-[#B032E7]">{roomId}</span>
        </div>
        <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr>
        <div className="text-neutral-600">
          {currentGame ? JSON.stringify(currentGame) : "No current games"}
        </div>
        <span className="mt-8 font-semibold text-neutral-600">
          Players List
        </span>
        <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr>

        <div className="flex flex-col">
          {currentRoomPlayers.map((player, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div
                className={cn({
                  ["hidden"]: !(player.playerId === ownerId),
                })}
              >
                <IconElement
                  imageUrl="/assets/icon-crown.svg"
                  iconAltText="crown icon"
                  selectable={false}
                />
              </div>

              <div
                className={cn({
                  ["hidden"]: !player.isReady,
                })}
              >
                <IconElement
                  imageUrl="/assets/icon-check.svg"
                  iconAltText="check icon"
                  selectable={false}
                />
              </div>

              <div
                className={cn({
                  ["hidden"]: player.isReady || player.playerId === ownerId,
                })}
              >
                <IconElement
                  imageUrl="/assets/icon-loading.svg"
                  iconAltText="check icon"
                  selectable={false}
                />
              </div>

              <div
                className={cn({                  
                  ["text-neutral-600"]: player.isReady || player.playerId === ownerId,
                  ["text-neutral-400"]: !player.isReady && player.playerId !== ownerId,
                  ["text-[#B032E7]"]: player.playerId === playerId,
                })}
                title={"PlayerId:" + player.playerId.toString()}
              >
                player name: {player.playerName}
              </div>

              <div
                className={cn({
                  ["hidden"]: !(player.playerId === playerId),
                })}
              >
                <IconElement
                  imageUrl="/assets/icon-edit.svg"
                  iconAltText="check icon"
                  selectable={true}
                />
              </div>
            </div>
          ))}
        </div>

        {/* <hr className="my-2 h-px w-[70%] border-[1px] bg-neutral-300"></hr> */}

        <div className="mt-8 mb-4 flex gap-10">
          {isOwner && <button onClick={handleStartGame}>Start Game</button>}

          <button onClick={handleCopyRoomUrl}>Copy Room Url</button>

          {!isOwner && (
            <button onClick={handleSetReady}>
              {!isReady ? "Ready" : "Not Ready"}
            </button>
          )}
        </div>
      </div>

      {currentGame && <GameComponent game={currentGame} />}

    </main>

    // <main>
    // {currentGame && <GameComponent game={currentGame} />}

    // {error && <div className="text-red-600">{error.message}</div>}

    // <div>
    //   <div>{roomId}</div>
    //   <div>{playerId}</div>
    //   <div>{currentGame ? currentGame.toString() : "No current game"}</div>
    //   <div>
    //     {currentRoomPlayers.map((player, index) => (
    //       <div className="flex flex-col" key={index}>
    //         <div
    //           className={cn({
    //             ["invisible"]: !(player.playerId === ownerId),
    //           })}
    //         >
    //           👑
    //         </div>
    //         {player.isReady && <div className="text-cyan-600">is ready</div>}
    //         <div>player id:{player.playerId}</div>
    //         <div
    //           className={cn({
    //             ["text-blue-700"]: player.playerId === playerId,
    //           })}
    //         >
    //           player name: {player.playerName}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {isOwner && <button onClick={handleStartGame}>Start Game</button>}

    //   {!isOwner && (
    //     <button onClick={handleSetReady}>
    //       {!isReady ? "Ready" : "Not Ready"}
    //     </button>
    //   )}
    // </div>
    // </main>
  );
}
