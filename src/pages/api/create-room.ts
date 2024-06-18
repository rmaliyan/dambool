import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { rooms } from "~/server/db/schema";
import { createPlayerId, getPlayerId } from "~/utils/api";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  let ownerId = getPlayerId(req);

  if (!ownerId) {
    ownerId = createPlayerId(res)
  }

  const addRoom = await db
    .insert(rooms)
    .values({ ownerId: ownerId })
    .returning();  

  return res.redirect(302,`/rooms/${addRoom[0]!.id}` )
}