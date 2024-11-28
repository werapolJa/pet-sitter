import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import supabase from "@/utils/supabase";

type RegistrationRequestBody = {
  email: string;
  password: string;
  phone: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const { email, password, phone }: RegistrationRequestBody = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({
        error: "Some required fields are missing. Please fill in all fields.",
      });
    }

    try {
      const emailCheckQuery = `select * from auth.users where email = $1`;
      const { rows: existingUser } = await connectionPool.query(
        emailCheckQuery,
        [email]
      );

      const phoneCheckQuery = `select * from users where phone = $1`;
      const { rows: existingPhone } = await connectionPool.query(
        phoneCheckQuery,
        [phone]
      );

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      if (existingPhone.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this phone number already exists" });
      }


      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        return res
          .status(400)
          .json({ error: "Failed to create user. Please try again." });
      }

      const supabaseUserId = data.user?.id;

      const query = `insert into users (user_id, phone) values ($1, $2) returning *`;
      const values = [supabaseUserId, phone];

      const { rows } = await connectionPool.query(query, values);

      res.status(201).json({
        message: "User created successfully",
        user: rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during registration" });
    }
  } else if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
