import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabase"

interface SendMessageRequest {
  conversation_id: string;
  sender_id: string;
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { conversation_id, sender_id, content }: SendMessageRequest = req.body;

    if (!conversation_id || !sender_id || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {

      const { data, error } = await supabase
        .from("messages")
        .insert([{ conversation_id, sender_id, content }])
        .select();  

      if (error) {
        return res.status(500).json({ message: "Error sending message", error });
      }


      return res.status(200).json({
        message: "Message sent successfully",
        data: data[0], 
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
