import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { petsitterid, status } = req.query;

  // Check if petsitterid is defined and is a string
  if (!petsitterid || typeof petsitterid !== "string") {
    return res.status(400).json({ error: "Invalid petsitter ID" });
  }

  // Handle GET method
  if (req.method === "GET") {
    try {
      let query = `
        SELECT pet_sitters.*, images.*
        FROM pet_sitters
        LEFT JOIN images ON pet_sitters.petsitter_id = images.petsitter_id
        WHERE pet_sitters.petsitter_id = $1
      `;

      const queryParams: string[] = [petsitterid];

      if (status) {
        query += ` AND pet_sitters.status = $2`;
        if (typeof status === "string") {
          queryParams.push(status);
        } else {
          queryParams.push(status[0]); // Use the first value if it's an array
        }
      }

      const result = await connectionPool.query(query, queryParams);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Pet sitter not found" });
      }

      // Filter out null or undefined image values from the images fields
      const images = [
        result.rows[0].image_1,
        result.rows[0].image_2,
        result.rows[0].image_3,
        result.rows[0].image_4,
        result.rows[0].image_5,
        result.rows[0].image_6,
        result.rows[0].image_7,
        result.rows[0].image_8,
        result.rows[0].image_9,
        result.rows[0].image_10,
      ].filter((image): image is string => image != null); // Filters out null or undefined values

      // Respond with the pet sitter data, including only the filtered images array
      return res.status(200).json({
        data: {
          ...result.rows[0], // Spread the other pet sitter details
          images, // Include the filtered images array
        },
      });
    } catch (error) {
      console.error("Error fetching pet sitter data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // If the method is not GET, return method not allowed
  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ error: "Method not allowed" });
}
