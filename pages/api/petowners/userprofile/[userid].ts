import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const { userid } = req.query;

    if (!userid || typeof userid !== "string") {
      return res.status(400).json({ error: "invalid or missing user id" });
    }

    const query = `
      select u.full_name, u.phone, u.image, au.email
      from users u
      inner join auth.users au on u.user_id = au.id
      where u.user_id = $1
    `;
    const result = await connectionPool.query(query, [userid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("error fetching user data:", error);
    return res.status(500).json({ error: "internal server error" });
  }
}
