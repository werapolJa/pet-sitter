import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.code === "invalid_credentials" ||
          error.message.includes("Invalid   login credentials")
        ) {
          return res.status(400).json({
            error: "Your password is incorrect or this email doesn’t exist",
          });
        }
        return res.status(400).json({ error: error.message });
      }

      console.log(data);

      return res.status(200).json({
        message: "Signed in successfully",
        access_token: data.session?.access_token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  }
}
