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
  pet_type_dog: string | null;
  pet_type_cat: string | null;
  pet_type_bird: string | null;
  pet_type_rabbit: string | null;
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
      select 
      pet_sitters.petsitter_id, 
      pet_sitters.full_name, 
      pet_sitters.experience,
      pet_sitters.phone,
      pet_sitters.image,
      pet_sitters.intro,
      pet_sitters.trade_name,
      pet_sitters.service,
      pet_sitters.place,
      pet_sitters.status,
      pet_sitters.pet_type_dog,
      pet_sitters.pet_type_cat,
      pet_sitters.pet_type_bird,
      pet_sitters.pet_type_rabbit,
      pet_sitters.create_at,
      pet_sitters.update_at,
      images.image_1,
      ROUND(AVG(ratings.rating)) AS average_rating
      from pet_sitters
      left join images on pet_sitters.petsitter_id = images.petsitter_id
      LEFT JOIN ratings ON pet_sitters.petsitter_id = ratings.petsitter_id
      where 1=1
      
    `;
    const queryParams: string[] = [];

    if (pet_type) {
      const petTypes = Array.isArray(pet_type) ? pet_type : [pet_type];
      petTypes.forEach((type) => {
        query += ` and (pet_sitters.pet_type_dog::text ilike $${
          queryParams.length + 1
        } or pet_sitters.pet_type_cat::text ilike $${
          queryParams.length + 1
        } or pet_sitters.pet_type_bird::text ilike $${queryParams.length + 1}
          or pet_sitters.pet_type_rabbit::text ilike $${queryParams.length + 1}
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

    if (trade_name) {
      query += ` and pet_sitters.trade_name::text ilike $${
        queryParams.length + 1
      }`;
      queryParams.push(`%${trade_name}%`);
    }

    if (queryParams.length === 0) {
      query = query.replace("where 1=1", "");
    }

    //จะต่อ string ที่เป็น GROUP BY ไว่หลังจากที่ where และ and เรียบร้อยแล้ว
    query += ` GROUP BY pet_sitters.petsitter_id, pet_sitters.full_name, pet_sitters.experience, pet_sitters.phone, pet_sitters.image, pet_sitters.intro, pet_sitters.trade_name, pet_sitters.service, pet_sitters.place, pet_sitters.status, pet_sitters.create_at, pet_sitters.update_at, images.image_1`;

    if (rating) {
      //ถ้ามี reating จะต่อ string ที่เป็น HAVING ROUND ไว่หลังจากที่ GROUP BY อันนี้เป็นลำดีบการเขียนของ sql อยู่แล้ว
      query += ` HAVING ROUND(AVG(ratings.rating)) = $${
        queryParams.length + 1
      }`;
      queryParams.push(rating as string);
    }

    const result = await connectionPool.query<PetSitter>(query, queryParams);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in search API:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
