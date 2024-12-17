import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PUT") {
    const { user_id, conversation_id } = req.body;

    if (!user_id || !conversation_id) {
      return res.status(400).json({ error: "User ID and Conversation ID are required" });
    }

    try {
      const updateUnreadQuery = `
        UPDATE messages
        SET read_status = TRUE
        WHERE conversation_id = $1
          AND sender_id != $2
          AND read_status = FALSE;
      `;
      await connectionPool.query(updateUnreadQuery, [conversation_id, user_id]);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "An error occurred while marking messages as read" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
