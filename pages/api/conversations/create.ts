import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Conversation = {
  conversation_id: string;
};

type Data = {
  conversationId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await connectionPool.connect();

  try {
    const { participants } = req.body;

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: 'Invalid participants data' });
    }

    // Step 1: ตรวจสอบว่ามี conversation เดิมที่มี participants นี้หรือไม่
    const checkQuery = `
      SELECT cp.conversation_id
      FROM conversation_participants cp
      WHERE cp.user_id = ANY($1)
      GROUP BY cp.conversation_id
      HAVING COUNT(*) = $2 AND ARRAY_AGG(cp.user_id ORDER BY cp.user_id) @> $1
    `;
    const { rows } = await client.query(checkQuery, [participants, participants.length]);

    if (rows.length > 0) {
      // ถ้ามี conversation_id ที่ตรงกับ participants นี้แล้ว
      const existingConversationId = rows[0].conversation_id;
      return res.status(200).json({ conversationId: existingConversationId });
    }

    // Step 2: สร้าง conversation ใหม่
    const conversationResult = await client.query<Conversation>(
      'INSERT INTO conversations DEFAULT VALUES RETURNING conversation_id'
    );
    const conversationId = conversationResult.rows[0].conversation_id;

    // Step 3: เพิ่ม participants ลงในตาราง conversation_participants
    const participantValues = participants.map((userId: string) => 
      `('${conversationId}', '${userId}')`
    ).join(', ');

    await client.query(`
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES ${participantValues}
    `);

    await client.query('COMMIT');
    res.status(200).json({ conversationId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  } finally {
    client.release();
  }
}
