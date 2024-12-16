import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Conversation = {
  conversation_id: number;
  created_at: string;
  updated_at: string;
  messages: {
    message_id: number;
    content: string;
    created_at: string;
    sender_id: number;
  }[];
  participants: {
    user_id: number;
    full_name: string;
    image?: string;
  }[];
};

type Data = {
  data?: Conversation[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Fetch conversations and messages for the user
      const conversationsQuery = `
        SELECT 
          c.conversation_id,
          c.created_at,
          c.updated_at,
          m.message_id,
          m.content,
          m.created_at AS message_created_at,
          m.sender_id
        FROM conversations c
        JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
        JOIN messages m ON c.conversation_id = m.conversation_id
        WHERE cp.user_id = $1
        ORDER BY c.updated_at DESC;
      `;
      const conversationsResult = await connectionPool.query(conversationsQuery, [user_id]);

      // If no conversations, return an empty array
      if (conversationsResult.rows.length === 0) {
        return res.status(200).json({ data: [] });
      }

      // Group messages by conversation_id
      const conversations = conversationsResult.rows.reduce((acc: Conversation[], row) => {
        let conversation = acc.find(c => c.conversation_id === row.conversation_id);
        if (!conversation) {
          conversation = {
            conversation_id: row.conversation_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            messages: [],
            participants: [],
          };
          acc.push(conversation);
        }

        conversation.messages.push({
          message_id: row.message_id,
          content: row.content,
          created_at: row.message_created_at,
          sender_id: row.sender_id,
        });

        return acc;
      }, [] as Conversation[]);

      // Fetch participants excluding the requesting user
      const participantsQuery = `
        SELECT 
          u.user_id,
          u.full_name,
          u.image,
          cp.conversation_id
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.user_id
        WHERE cp.user_id != $1;
      `;
      const participantsResult = await connectionPool.query(participantsQuery, [user_id]);

      // Group participants by conversation_id
      conversations.forEach(conversation => {
        conversation.participants = participantsResult.rows.filter(
          participant => participant.conversation_id === conversation.conversation_id
        );
      });

      // Return the structured conversations data
      res.status(200).json({ data: conversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "An error occurred while fetching conversations" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
