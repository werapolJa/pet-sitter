import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { petsitterid, status, rating } = req.query;
  console.log("Petsitter ID:", petsitterid);
  console.log("Status:", status);
  console.log("Rating:", rating);

  // Check if petsitterid is defined and is a string
  if (!petsitterid || typeof petsitterid !== "string") {
    return res.status(400).json({ error: "Invalid petsitter ID" });
  }

  // Handle GET method
  if (req.method === "GET") {
    try {
      let query = `
        select 
          jsonb_build_object(
            'reviews', jsonb_agg(
              jsonb_build_object(
                'rating_id', ratings.rating_id,
                'user_id', ratings.user_id,
                'image', users.image,
                'full_name', users.full_name,
                'rating', ratings.rating,
                'review', ratings.review_message,
                'created_at', ratings.create_at
              ) order by ratings.create_at DESC
            ),
            'average_rating', avg(ratings.rating)::numeric(10,2),
            'total_reviews', count(ratings.rating_id)
          ) as result
        from ratings
        left join users on ratings.user_id = users.user_id
        where ratings.petsitter_id = $1
      `;

      const queryParams: (string | number)[] = [petsitterid];

      // Log the query params for debugging
      console.log("Petsitter ID:", petsitterid);
      console.log("Status:", status);
      console.log("Rating:", rating);

      // Check if 'status' is provided, then add it to the query
      if (status) {
        query += ` and ratings.status = $2`;
        if (typeof status === "string") {
          queryParams.push(status);
        } else if (Array.isArray(status)) {
          queryParams.push(status[0]); // Use the first value if it's an array
        }
      }

      // Check if 'rating' is provided, then add it to the query
      if (rating) {
        query += ` and ratings.rating = $${queryParams.length + 1}`;
        queryParams.push(Number(rating)); // Ensure it's treated as a number
      }

      query += ` group by ratings.petsitter_id`;

      console.log("Final query:", query);
      console.log("Query params:", queryParams);

      const result = await connectionPool.query(query, queryParams);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Reviews not found" });
      }

      // Respond with the reviews data
      return res.status(200).json({
        data: result.rows[0].result, // Assuming 'result' is the key returned by your jsonb_build_object
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // If the method is not GET, return method not allowed
  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ error: "Method not allowed" });
}
