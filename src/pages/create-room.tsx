import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { db } from '~/server/db';
import { rooms } from '~/server/db/schema';
 
export const getServerSideProps = (async (context) => {  

  let ownerId = parseInt(context.req.cookies["playerId"]!);
  
  if (isNaN(ownerId)) {
    ownerId = Math.floor(Math.random() * Math.pow(2, 31));
    context.res.setHeader("set-cookie", `playerId=${ownerId}; Max-Age=31536000`);
  }

  const addRoom = await db.insert(rooms).values({ ownerId : ownerId }).returning();

  return { props : {}, redirect: {permanent:false, destination:`/rooms/${addRoom[0]!.id}`}}

}) satisfies GetServerSideProps<{}>
 
export default function CreateRoom({
  
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>   
    </main>
  )
}

