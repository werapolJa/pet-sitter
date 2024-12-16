// Import types for API handling and database connection
import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

// API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get user ID from query parameters
  const uid = req.query.uid as string;

  // Return error if user ID is missing
  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Handle GET requests (fetch user and review data)
  if (req.method === "GET") {
    try {
      // Query to fetch user details and their pets
      const userQuery = `
        select 
          u.user_id, 
          u.full_name, 
          u.phone, 
          u.id_number, 
          u.image, 
          u.birthdate, 
          u.status,
          au.email,
          json_agg(json_build_object('pet_name', p.pet_name, 'pet_type', p.pet_type)) as pets
        from
          users u
        left join 
          auth.users au ON u.user_id = au.id
        left join
          pets p ON u.user_id = p.user_id
        where
          u.user_id = $1
        group by 
          u.user_id, au.email
      `;

      // Query to fetch reviews written by the user
      const reviewsQuery = `
        select 
          ps.petsitter_id,
          ps.full_name AS petsitter_name,
          ps.image AS petsitter_image,
          r.rating,
          r.review_message,
          r.create_at AS review_date
        from
          ratings r
        join 
          pet_sitters ps ON r.petsitter_id = ps.petsitter_id
        where 
          r.user_id = $1 AND r.status = 'Approved'
        order by 
          r.create_at DESC
      `;

      // Run both queries with the user ID
      const userResult = await connectionPool.query(userQuery, [uid]);
      const reviewsResult = await connectionPool.query(reviewsQuery, [uid]);

      // Return error if no user is found
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userResult.rows[0];

      // Ensure the pets field is an empty array if no pets are found
      if (userData.pets[0] === null) {
        userData.pets = [];
      }

      // Combine user and review data into one response
      const responseData = {
        ...userData,
        reviews: reviewsResult.rows,
      };

      // Return data with success status
      return res.status(200).json({ data: responseData });
    } catch (error) {
      // Handle server errors
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }
  }
  // Handle PUT requests (update user status)
  else if (req.method === "PUT") {
    try {
      // Get new status from the request body
      const { status } = req.body;

      // Allow only "Normal" or "Banned" status values
      if (status !== "Normal" && status !== "Banned") {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Query to update user status
      const updateQuery = `
        update users
        set status = $1
        where user_id = $2
        returning status
      `;

      // Run update query
      const result = await connectionPool.query(updateQuery, [status, uid]);

      // Return error if no user is updated
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return updated status with success status
      return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
      // Handle server errors
      console.error("Error updating user status:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating user status" });
    }
  }
  // Handle unsupported HTTP methods
  else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
