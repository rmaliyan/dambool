import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { db } from "~/server/db";
import { eq, and, count } from "drizzle-orm";
import { rooms, games, roomPlayers } from "~/server/db/schema";
import { GameModel } from "~/game-logic";
import { api, createPlayerId, getPlayerId } from "~/utils/api";
import { GameComponent } from "~/components/game-area";
import { PeerContextProvider } from "~/components/peer-context-provider";
import { LobbyComponent } from "~/components/lobby";

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

  if (roomRunningGames.length != 0) {
    currentGame = roomRunningGames[0]!.gameJson;
  }

  const newPlayerCount = await db
    .select({ value: count(roomPlayers.id) })
    .from(roomPlayers)
    .where(
      and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.playerId, playerId)),
    );

  const isNewPlayer = newPlayerCount[0]!.value === 0;

  if (isNewPlayer) {
    const currentPlayerCount = await db
      .select({ value: count(roomPlayers.id) })
      .from(roomPlayers)
      .where(eq(roomPlayers.roomId, roomId));

    const newPlayerName = `Player ${currentPlayerCount[0]!.value + 1}`;
    await db.insert(roomPlayers).values({
      roomId: roomId,
      playerName: newPlayerName,
      playerId: playerId,
      isReady: false,
    });
  }

  return {
    props: { roomId, playerId, ownerId },
  };
}) satisfies GetServerSideProps<NonNullable<unknown>>;

export default function CreateRoom({
  roomId,
  playerId,
  ownerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const {data:game} = api.game.getCurrentGame.useQuery({roomId});

  return (
    <PeerContextProvider roomId={roomId}>
      <main className="flex w-full items-center justify-center">
        {/* {error && <div className="text-red-600">{error.message}</div>} */}

        {!game && (
          <LobbyComponent
            roomId={roomId}
            ownerId={ownerId}
            playerId={playerId}
          />
        )}

        {game && (
          <GameComponent
            roomId={roomId}
            playerId={playerId}
          />
        )}
      </main>
    </PeerContextProvider>
  );
}
