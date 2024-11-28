import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { jwtDecode } from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    // Decode token to extract user_id
    const { sub: user_id } = jwtDecode(token) as { sub: string };

    if (!user_id) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Fetch user data from the database with an INNER JOIN on auth.users
    const query = `
      SELECT users.full_name, users.phone, users.image, auth.users.email
      FROM users
      INNER JOIN auth.users ON users.user_id = auth.users.id
      WHERE users.user_id = $1
    `;
    const result = await connectionPool.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
