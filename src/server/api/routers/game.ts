import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { startGame } from "~/game-logic";
import { games, roomPlayers } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const gameRouter = createTRPCRouter({

  startGame: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const playerList = (
        await ctx.db
          .select({
            playerId: roomPlayers.playerId,
          })
          .from(roomPlayers)
          .where(eq(roomPlayers.roomId, input.roomId))
      ).map((element) => element.playerId);

      const newGame = startGame(playerList);     

      await ctx.db.insert(games).values({roomId:input.roomId,gameJson:newGame, isFinished:false});
    }),
});
