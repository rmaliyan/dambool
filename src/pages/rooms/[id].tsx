import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { rooms, games, roomPlayers } from "~/server/db/schema";
import { GameModel } from "~/game-logic";
import { cn } from "~/utils/css";


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
    }
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
    })
    .from(roomPlayers)
    .where(eq(roomPlayers.roomId, roomId))
    .orderBy(roomPlayers.id);

  if (roomRunningGames.length != 0) {
    currentGame = roomRunningGames[0]!.gameJson;
  }

  if (
    currentRoomPlayers.filter((player) => player.playerId === playerId)
      .length === 0
  ) {
    const newPlayerName = `Player ${currentRoomPlayers.length + 1}`;
    await db.insert(roomPlayers).values({
      roomId: roomId,
      playerName: newPlayerName,
      playerId: playerId,
    });
    currentRoomPlayers.push({ playerId: playerId, playerName: newPlayerName });
  }

  return { props: { roomId, playerId, currentGame, currentRoomPlayers, ownerId} };
}) satisfies GetServerSideProps<{}>;


export default function CreateRoom({
  roomId,
  playerId,
  currentGame,
  currentRoomPlayers,
  ownerId

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
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
            <div>player id:{player.playerId}</div>
            <div
            className={cn({
              ["text-blue-700"]: player.playerId === playerId,
            })}
            >player name: {player.playerName}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
