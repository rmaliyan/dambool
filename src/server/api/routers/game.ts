import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
    
export const gameRouter = createTRPCRouter({
    startGame: publicProcedure.input( z.object({
        roomId: z.number(),
        players: z.array(z.number())
    })  
    )
    .mutation(async ({ctx, input}) => {
        // ctx.session. 
    })
})