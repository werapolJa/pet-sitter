import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { validate as isUUID } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.query;
  if (!userid || typeof userid !== "string" || !isUUID(userid)) {
    return res.status(400).json({ error: "invalid or missing user id" });
  }
  if (req.method === "GET") {
    try {
        const query = `
          select pet_name, pet_type, breed, sex, age, color, weight, about, image, status
          from pets
          where user_id = $1
        `;
        const result = await connectionPool.query(query, [userid]);
  
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "user doesn't have a pet" });
        }
  
        return res.status(200).json({ data: result.rows });
      } catch (error) {
        console.error("error fetching user data:", error);
        return res.status(500).json({ error: "internal server error" });
      }
  }
}
