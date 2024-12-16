import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const uid = req.query.uid as string;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const query = `
      SELECT 
        u.user_id, 
        u.full_name, 
        u.phone, 
        u.id_number, 
        u.image, 
        u.birthdate, 
        u.status,
        au.email,
        json_agg(json_build_object('pet_name', p.pet_name, 'pet_type', p.pet_type)) as pets
      FROM 
        users u
      LEFT JOIN 
        auth.users au ON u.user_id = au.id
      LEFT JOIN 
        pets p ON u.user_id = p.user_id
      WHERE 
        u.user_id = $1
      GROUP BY 
        u.user_id, au.email
    `;

    const result = await connectionPool.query(query, [uid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = result.rows[0];

    // If no pets are found, set pets to an empty array instead of null
    if (userData.pets[0] === null) {
      userData.pets = [];
    }

    return res.status(200).json({ data: userData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching data" });
  }
}
