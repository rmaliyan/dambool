import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  canAttack,
  canDefend,
  discardToBeaten,
  endTurn,
  getPlayerHand,
  startGame,
} from "~/game-logic";
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
      if (readyPlayers.length < 1) {
        throw new TRPCError({
          message: "Not enough players to start a game",
          code: "BAD_REQUEST",
        });
      }
      const playerList = readyPlayers.map((element) => element.playerId);

      // checking if the owner is present in player list and adding him there if he is not
      if (!playerList.includes(ownerId[0]?.ownerId)) {
        playerList.splice(0, 0, ownerId[0]?.ownerId);
      }
      //creating newGame object: creating deck, shuffling deck, dealing hands, etc.
      const newGame = startGame(playerList);
      //inserting new game to db
      await ctx.db
        .insert(games)
        .values({ roomId: input.roomId, gameJson: newGame, isFinished: false });
      return newGame;
    }),

  getCurrentGame: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db
          .select({ currentGame: games.gameJson })
          .from(games)
          .where(
            and(eq(games.roomId, input.roomId), eq(games.isFinished, false)),
          )
      )[0]!.currentGame;
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
        .select({ gameObject: games.gameJson, gameId: games.id })
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
      const gameId = gameObjectArray[0]!.gameId;

      if (ctx.playerId !== gameObject.currentState.attacker) {
        throw new TRPCError({
          message: "Player attempting to play at wrong turn",
          code: "BAD_REQUEST",
        });
      }

      const hand = getPlayerHand(gameObject, ctx.playerId);

      if (input.cardIndex >= hand.cards.length) {
        throw new TRPCError({
          message: "Attacking card index exceeds number of cards in hand",
          code: "BAD_REQUEST",
        });
      }

      const attackCard = hand.cards[input.cardIndex]!;

      if (!canAttack(gameObject.battleArea, attackCard)) {
        throw new TRPCError({
          message: "No cards in hand suitable for attack",
          code: "BAD_REQUEST",
        });
      }

      gameObject.battleArea.pairs.push({ attack: attackCard });

      hand.cards.splice(input.cardIndex, 1);

      gameObject.currentState.turnCount++;

      gameObject.currentState.idlePlayerCount = 0;

      await ctx.db
        .update(games)
        .set({ gameJson: gameObject })
        .where(eq(games.id, gameId));
    }),

  defenceMove: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        cardIndex: z.number(),
        pairIndex: z.number(), // Index of the pair in battleArea to defend against
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch game object
      const gameObjectArray = await ctx.db
        .select({ gameObject: games.gameJson, gameId: games.id })
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

      const gameId = gameObjectArray[0]!.gameId;

      // Check if it's the defender's turn
      if (ctx.playerId !== gameObject.currentState.defender) {
        throw new TRPCError({
          message: "Player attempting to play at wrong turn",
          code: "BAD_REQUEST",
        });
      }

      // Get defender's hand
      const hand = getPlayerHand(gameObject, ctx.playerId);

      // Check if the selected card exists in hand
      if (input.cardIndex >= hand.cards.length) {
        throw new TRPCError({
          message: "Defending card index exceeds number of cards in hand",
          code: "BAD_REQUEST",
        });
      }

      const defenceCard = hand.cards[input.cardIndex]!;
      const attackingPair = gameObject.battleArea.pairs[input.pairIndex];

      if (!attackingPair || attackingPair.defence) {
        throw new TRPCError({
          message: "Invalid pair to defend against",
          code: "BAD_REQUEST",
        });
      }

      // Check if the defence is valid (higher rank of same suit, or trump)
      const isValidDefence = canDefend(
        attackingPair.attack,
        defenceCard,
        gameObject.deck.trumpCard.suit,
      );

      if (!isValidDefence) {
        throw new TRPCError({
          message: "Invalid defence card",
          code: "BAD_REQUEST",
        });
      }

      // Add the defence card to the pair
      attackingPair.defence = defenceCard;
      hand.cards.splice(input.cardIndex, 1);

      if (hand.cards.length === 0) {
        discardToBeaten(gameObject);
      }

      await ctx.db
        .update(games)
        .set({ gameJson: gameObject })
        .where(eq(games.id, gameId));
    }),

  endTurn: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gameObjectArray = await ctx.db
        .select({ gameObject: games.gameJson, gameId: games.id })
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

      const gameId = gameObjectArray[0]!.gameId;

      if (ctx.playerId !== gameObject.currentState.attacker) {
        throw new TRPCError({
          message: "Player attempting to play at wrong turn",
          code: "BAD_REQUEST",
        });
      }

      if (gameObject.battleArea.pairs.filter((pair) => !pair.defence).length) {
        throw new TRPCError({
          message:
            "Turn can not be ended while there are unbeaten cards at the battle area.",
          code: "BAD_REQUEST",
        });
      }

      endTurn(gameObject);

      await ctx.db
        .update(games)
        .set({ gameJson: gameObject })
        .where(eq(games.id, gameId));
    }),
});
