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
  image_1: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pet_type, experience, rating, trade_name } = req.query;

    let query = `
      select pet_sitters.*, images.image_1
      from pet_sitters
      left join images on pet_sitters.petsitter_id = images.petsitter_id
      where 1=1
    `;
    const queryParams: string[] = [];

    if (pet_type) {
      const petTypes = Array.isArray(pet_type) ? pet_type : [pet_type];
      petTypes.forEach((type) => {
        query += ` and (pet_sitters.pet_type1::text ilike $${
          queryParams.length + 1
        } or pet_sitters.pet_type2::text ilike $${
          queryParams.length + 1
        } or pet_sitters.pet_type3::text ilike $${queryParams.length + 1}
          or pet_sitters.pet_type4::text ilike $${queryParams.length + 1}
          )`;
        queryParams.push(type);
      });
    }

    if (experience) {
      query += ` and pet_sitters.experience::text ilike $${
        queryParams.length + 1
      }`;
      queryParams.push(`%${experience}%`);
    }

    if (rating) { 
      query += ` and pet_sitters.rating::text = $${queryParams.length + 1}`;
      queryParams.push(rating as string);
    }

    if (trade_name) {
      query += ` and pet_sitters.trade_name::text ilike $${
        queryParams.length + 1
      }`;
      queryParams.push(`%${trade_name}%`);
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
