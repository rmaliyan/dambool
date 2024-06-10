import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { rooms, games, roomPlayers } from "~/server/db/schema";
import { GameModel } from "~/game-logic";
import { cn } from "~/utils/css";
import { api } from "~/utils/api";
import { GameComponent } from "~/components/game-area";

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

  let playerId = parseInt(context.req.cookies["playerId"]!);

  if (isNaN(playerId)) {
    playerId = Math.floor(Math.random() * Math.pow(2, 31));
    context.res.setHeader(
      "set-cookie",
      `playerId=${playerId}; Max-Age=31536000`,
    );
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

  const isNewPlayer = currentRoomPlayers.filter((player) => player.playerId === playerId)
  .length === 0;

  if (
    isNewPlayer
  ) {
    const newPlayerName = `Player ${currentRoomPlayers.length + 1}`;
    await db.insert(roomPlayers).values({
      roomId: roomId,
      playerName: newPlayerName,
      playerId: playerId,
      isReady: false
    });

    currentRoomPlayers.push({ playerId: playerId, playerName: newPlayerName, isReady: false});
  }

  return {
    props: { roomId, playerId, currentGame, currentRoomPlayers, ownerId },
  };
}) satisfies GetServerSideProps<{}>;

export default function CreateRoom({
  roomId,
  playerId,
  currentGame,
  currentRoomPlayers,
  ownerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { mutate : mutateStartGame, error } = api.game.startGame.useMutation();

  const { mutate : mutateSetReady, error : setReadyError } = api.game.setReady.useMutation();

  const isReady = false;

  const handleStartGame = () => {
    mutateStartGame({ roomId });
  };

  const handleSetReady = () => {    
    mutateSetReady({ roomId, isReadyState : !isReady});
  };

  return (
    <main>

      {currentGame && <GameComponent game = {currentGame} />}

      {error && <div className="text-red-600">{error.message}</div>}
      
      <div>
        <div>{roomId}</div>
        <div>{playerId}</div>
        <div>{currentGame ? currentGame.toString() : "No current game"}</div>
        <div>
          {currentRoomPlayers.map((player) => (
            <div className="flex flex-col">
              <div
                className={cn({
                  ["invisible"]: !(player.playerId === ownerId),
                })}
              >
                👑
              </div>
              {player.isReady && <div className = "text-cyan-600">is ready</div>}
              <div>player id:{player.playerId}</div>
              <div
                className={cn({
                  ["text-blue-700"]: player.playerId === playerId,
                })}
              >
                player name: {player.playerName}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleStartGame}>Start Game</button>

        <button onClick={handleSetReady}>{!isReady? "Ready" : "Not Ready"}</button>
      </div>
    </main>
  );
}
