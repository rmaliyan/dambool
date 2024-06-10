import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { startGame } from "~/game-logic";
import { games, roomPlayers, rooms } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";




export const roomLobbyRouter = createTRPCRouter({

  setReady: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        isReadyState: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ownerId = await ctx.db
        .update(roomPlayers)
        .set({ isReady: input.isReadyState })
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            eq(roomPlayers.playerId, ctx.playerId),
          ),
        );
    }),

    

   getPlayerList:publicProcedure
   .input(
    z.object({
      roomId: z.number(),
    }),
  )
  .query (async ({ctx, input}) => {

   //add isOwner, 

    const currentRoomPlayers = await ctx.db
    .select({
      playerId: roomPlayers.playerId,
      playerName: roomPlayers.playerName,
      isReady: roomPlayers.isReady,
    })
    .from(roomPlayers)
    .where(     
        eq(roomPlayers.roomId, input.roomId)
    );

    return currentRoomPlayers;
  })

});
