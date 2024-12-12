import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

type UserWithPets = {
  user_id: string;
  full_name: string;
  phone: string;
  image: string | null;
  email: string;
  status: string;
  pet_count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Query to join `users` and `pets` tables without any filters
    const query = `
      select 
        u.user_id,
        u.full_name,
        u.phone,
        u.image,
        auth.users.email,
        u.status,
        count(p.pet_id) as pet_count
      from 
        users u
      left join 
        pets p on u.user_id = p.user_id
      left join 
        auth.users on u.user_id = auth.users.id
      group by 
        u.user_id, u.full_name, u.phone, u.image, auth.users.email, u.status
    `;

    // Execute the query
    const result = await connectionPool.query<UserWithPets>(query);

    // Prepare the response data to match the desired format
    const formattedData = result.rows.map((user) => ({
      image: user.image
        ? `<img src="${user.image}" alt="${user.full_name}" width="50" height="50" />`
        : null,
      full_name: user.full_name,
      phone: user.phone,
      email: user.email,
      Pet: user.pet_count,
      Status: user.status,
    }));

    // Send the formatted data in the response
    return res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error in search API:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
