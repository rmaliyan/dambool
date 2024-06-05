import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { rooms } from "~/server/db/schema";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  let ownerId = parseInt(req.cookies["playerId"]!);

  console.log(req.cookies);

  if (isNaN(ownerId)) {
    ownerId = Math.floor(Math.random() * Math.pow(2, 31));
    res.setHeader(
      "set-cookie",
      `playerId=${ownerId}; Max-Age=31536000; HttpOnly; Path=/`,
    );
  }

  const addRoom = await db
    .insert(rooms)
    .values({ ownerId: ownerId })
    .returning();  

  return res.redirect(307,`/rooms/${addRoom[0]!.id}` )
}