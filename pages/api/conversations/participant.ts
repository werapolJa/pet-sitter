import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Participants = {
  user_id: number;
  full_name: string;
  image?: string;
};

type Data = {
  data?: Participants[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { conversation_id, user_id } = req.query;

    if (!conversation_id) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const participantsQuery = `
        SELECT 
          u.user_id,
          u.full_name,
          u.image
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.user_id
        WHERE cp.conversation_id = $1
          AND cp.user_id != $2;
      `;

      const participantsResult = await connectionPool.query(participantsQuery, [
        conversation_id,
        user_id,
      ]);

      // Extract rows from the result

      res.status(200).json({ data: participantsResult.rows[0] });
    } catch (error) {
      console.error("Error fetching participants:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching participants" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
