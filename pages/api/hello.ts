// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { getToken } from "next-auth/jwt";
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient()

type Data = {
  name: string;
  posts: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const token = await getToken({ raw: true, req });
  const posts = await prisma.posts.findMany({ take: 2 });
  res.status(200).json({ name: "John Doe", posts: JSON.stringify(posts, null, 2) });
}
