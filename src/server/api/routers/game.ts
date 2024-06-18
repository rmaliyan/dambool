import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { startGame } from "~/game-logic";
import { games, roomPlayers, rooms } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const gameRouter = createTRPCRouter({
  startGame: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // fetching room owneId from db
      const ownerId = await ctx.db
        .select({
          ownerId: rooms.ownerId,
        })
        .from(rooms)
        .where(eq(rooms.id, input.roomId));

      // checking if person atempting to start game is the room owner
      if (ctx.playerId !== ownerId[0]?.ownerId) {
        throw new TRPCError({
          message: "You are not the game room owner",
          code: "UNAUTHORIZED",
        });
      }
      // fetching ready players list from db
      const readyPlayers = await ctx.db
        .select({
          playerId: roomPlayers.playerId,
        })
        .from(roomPlayers)
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            eq(roomPlayers.isReady, true),
          ),
        );
      // checking if there are more than 1 ready players
      // excluding owner
      if (readyPlayers.length! < 1) {
        throw new TRPCError({
          message: "Not enough players to start a game",
          code: "BAD_REQUEST",
        });
      }
      const playerList = readyPlayers.map((element) => element.playerId);

      // checking if the owner is present in player list and adding him there if he is not
      if (!playerList.includes(ownerId[0]?.ownerId)) {
        playerList.push(ownerId[0]?.ownerId);
      }
      //creating newGame object: creating deck, shuffling deck, dealing hands, etc.
      const newGame = startGame(playerList);
      //inserting new game to db
      await ctx.db
        .insert(games)
        .values({ roomId: input.roomId, gameJson: newGame, isFinished: false });
      return newGame;
    }),

  attackMove: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        cardIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //get attacking card index from player hand
      //remove attacking card from player hand
      //push attacking card to battle-area first pair
      const gameObjectArray = await ctx.db
        .select({ gameObject: games.gameJson })
        .from(games)
        .where(
          and(eq(games.roomId, input.roomId), eq(games.isFinished, false)),
        );

      if (gameObjectArray.length === 0) {
        throw new TRPCError({
          message: "Missing game object. No active games in this room.",
          code: "BAD_REQUEST",
        });        
      }

      const gameObject = gameObjectArray[0]!.gameObject;

      const hand = gameObject.hands[0]

    }),
});
