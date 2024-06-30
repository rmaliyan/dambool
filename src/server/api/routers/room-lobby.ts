import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { startGame } from "~/game-logic";
import { games, roomPlayers, rooms } from "~/server/db/schema";
import { and, eq, isNotNull, ne } from "drizzle-orm";
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
      console.log(input.isReadyState, input.roomId, ctx.playerId);

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

  getPlayerList: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //add isOwner,

      const currentRoomPlayers = await ctx.db
        .select({
          playerId: roomPlayers.playerId,
          playerName: roomPlayers.playerName,
          isReady: roomPlayers.isReady,
        })
        .from(roomPlayers)
        .where(eq(roomPlayers.roomId, input.roomId))
        .orderBy(roomPlayers.id);

      return currentRoomPlayers;
    }),

  setPeerId: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        peerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(roomPlayers)
        .set({ peerId: input.peerId })
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            eq(roomPlayers.playerId, ctx.playerId),
          ),
        );
    }),

  getPeerId: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const peerId = await ctx.db
        .select({ peerId: roomPlayers.peerId })
        .from(roomPlayers)
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            eq(roomPlayers.playerId, ctx.playerId),
          ),
        );

      return peerId[0]?.peerId;
    }),

  getPeerIdList: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const peerIdList = await ctx.db
        .select({ peerid: roomPlayers.peerId })
        .from(roomPlayers)
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            isNotNull(roomPlayers.peerId),
            ne(roomPlayers.playerId, ctx.playerId),
          ),
        );

      return peerIdList.map((elem) => elem.peerid!);
    }),

  setPlayerName: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        playerName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(roomPlayers)
        .set({ playerName: input.playerName })
        .where(
          and(
            eq(roomPlayers.roomId, input.roomId),
            eq(roomPlayers.playerId, ctx.playerId),
          ),
        );
    }),
});
