import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { games, roomPlayers } from "~/server/db/schema";
import { GameModel } from "~/game-logic";

export const getServerSideProps = (async (context) => {
  const roomId = parseInt(context.params!.id as string);

  let playerId = parseInt(context.req.cookies["playerId"]!);

  if (isNaN(playerId)) {
    playerId = Math.floor(Math.random() * Math.pow(2, 31));
    context.res.setHeader(
      "set-cookie",
      `playerId=${playerId}; Max-Age=31536000`,
    );
  }

  let currentGame: GameModel | null = null;

  const roomFinishedGames = await db
    .select()
    .from(games)
    .where(and(eq(games.isFinished, false), eq(games.roomId, roomId)));

  const currentRoomPlayers = await db
    .select({
      playerId: roomPlayers.playerId,
      playerName: roomPlayers.playerName,
    })
    .from(roomPlayers)
    .where(eq(roomPlayers.roomId, roomId));

  if (roomFinishedGames.length != 0) {
    currentGame = roomFinishedGames[0]!.gameJson;
  }

  if (
    currentRoomPlayers.filter((player) => player.playerId === playerId)
      .length === 0
  ) {
    const newPlayerName = `Player ${currentRoomPlayers.length + 1}`;
    await db
      .insert(roomPlayers)
      .values({
        roomId: roomId,
        playerName: newPlayerName,
        playerId: playerId,
      });
    currentRoomPlayers.push({ playerId: playerId, playerName: newPlayerName });
  }

  return { props: { roomId, playerId, currentGame, currentRoomPlayers } };
}) satisfies GetServerSideProps<{}>;

export default function CreateRoom({
  roomId,
  playerId,
  currentGame,
  currentRoomPlayers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <div>{roomId}</div>
      <div>{playerId}</div>
      <div>{currentGame ? currentGame.toString() : "No current game"}</div>
      <div>
        {currentRoomPlayers.map((player) => (
          <div className="flex flex-col">
            <div>player id: {player.playerId}</div>{" "}
            <div>player name: {player.playerName}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
