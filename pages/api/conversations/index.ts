import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Conversation = {
  conversation_id: number;
  created_at: string;
  updated_at: string;
  unread_count: number;
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
      // Fetch conversations and messages for the user with unread count
      const conversationsQuery = `
        SELECT 
          c.conversation_id,
          c.created_at,
          c.updated_at,
          m.message_id,
          m.content,
          m.created_at AS message_created_at, 
          m.sender_id,
          m.read_status
        FROM conversations c
        LEFT JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
        LEFT JOIN messages m ON c.conversation_id = m.conversation_id
        WHERE cp.user_id = $1
        ORDER BY c.updated_at DESC, m.created_at DESC;
      `;
      const conversationsResult = await connectionPool.query(conversationsQuery, [user_id]);

      // If no conversations, return an empty array
      if (conversationsResult.rows.length === 0) {
        return res.status(200).json({ data: [] });
      }

      // Group messages by conversation_id and calculate unread_count
      const conversations = conversationsResult.rows.reduce((acc: Conversation[], row) => {
        let conversation = acc.find(c => c.conversation_id === row.conversation_id);
        if (!conversation) {
          conversation = {
            conversation_id: row.conversation_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            unread_count: 0, // Initialize unread count
            messages: [],
            participants: [],
          };
          acc.push(conversation);
        }

        // Push message
        conversation.messages.push({
          message_id: row.message_id,
          content: row.content,
          created_at: row.message_created_at,
          sender_id: row.sender_id,
        });

        // Count unread messages if sender_id != user_id
        if (row.read_status === false && row.sender_id != user_id) {
          conversation.unread_count += 1;
        }

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
