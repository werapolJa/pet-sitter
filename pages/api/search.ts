import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

type PetSitter = {
  petsitter_id: number;
  full_name: string;
  experience: string;
  phone: string;
  image: string | null;
  intro: string | null;
  trade_name: string;
  service: string | null;
  place: string | null;
  rating: string | null;
  status: string;
  create_at: string;
  update_at: string;
  pet_type1: string | null;
  pet_type2: string | null;
  pet_type3: string | null;
  pet_type4: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pet_type, experience, rating } = req.query;

    let query = `select * from pet_sitters where 1=1`;
    const queryParams: string[] = [];

    if (pet_type) {
      query += ` and (pet_type1::text ilike $${queryParams.length + 1} 
                    or pet_type2::text ilike $${queryParams.length + 1}
                    or pet_type3::text ilike $${queryParams.length + 1}
                    or pet_type4::text ilike $${queryParams.length + 1})`;
      queryParams.push(pet_type as string);
    }

    if (experience) {
      query += ` and experience::text ilike $${queryParams.length + 1}`;
      queryParams.push(experience as string);
    }

    if (rating) {
      query += ` and rating::text = $${queryParams.length + 1}`;
      queryParams.push(rating as string);
    }

    if (queryParams.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one valid search parameter is required." });
    }

    const result = await connectionPool.query<PetSitter>(query, queryParams);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in search API:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
