// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  user_id: number;
  full_name: string;
  phone: string;
  id_number?: string;
  image?: string;
  birthdate?: string;
  status: string;
  create_at: string;
  update_at: string;
};

type Data = {
  data?: User[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'GET') {
      const result = await connectionPool.query('select * from users');
      res.status(200).json({ data: result.rows });
  }
}
