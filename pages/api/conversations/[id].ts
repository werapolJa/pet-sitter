import type { NextApiRequest, NextApiResponse } from 'next';
import connectionPool from "@/utils/db";

type Message = {
  message_id: string;
  content: string;
  updated_at: string;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | ErrorResponse>
) {
  const { id } = req.query;
  const { method } = req;
  console.log(id)

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

 if (method === 'PUT') {
    // Update message
    try {
      const { content } = req.body;
      console.log(content)
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const result = await connectionPool.query(
        'UPDATE messages SET content = $1 WHERE message_id = $2 RETURNING message_id, content',
        [content, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const updatedMessage: Message = result.rows[0];
      return res.status(200).json(updatedMessage);
    } catch (error) {
      console.error('Error updating message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (method === 'DELETE') {
    // Delete message
    try {
      const result = await connectionPool.query(
        'DELETE FROM messages WHERE message_id = $1 RETURNING message_id',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      return res.status(200).json({ message_id: id, content: '', updated_at: new Date().toISOString() });
    } catch (error) {
      console.error('Error deleting message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
