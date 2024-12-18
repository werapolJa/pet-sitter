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

  // Validate that user ID is provided
  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

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
          json_agg(json_build_object('pet_id', p.pet_id, 'pet_image', p.image, 'pet_name', p.pet_name, 'pet_type', p.pet_type)) as pets
        from
          users u
        left join 
          auth.users au on u.user_id = au.id
        left join
          pets p on u.user_id = p.user_id
        where
          u.user_id = $1
        group by 
          u.user_id, au.email
      `;

      // Query to fetch reviews written by the user
      const reviewsQuery = `
        select 
          ps.petsitter_id,
          ps.full_name as petsitter_name,
          ps.image as petsitter_image,
          r.rating,
          r.review_message,
          r.create_at as review_date
        from
          ratings r
        join 
          pet_sitters ps on r.petsitter_id = ps.petsitter_id
        where 
          r.user_id = $1 and r.status = 'Approved'
        order by 
          r.create_at desc
      `;

      // Execute queries
      const userResult = await connectionPool.query(userQuery, [uid]);
      const reviewsResult = await connectionPool.query(reviewsQuery, [uid]);

      // Check if user exists
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
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }
  } else if (req.method === "PUT") {
    try {
      const { status } = req.body;

      if (status !== "Normal" && status !== "Banned") {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Update query
      const updateQuery = `
        update users
        set status = $1
        where user_id = $2
        returning status
      `;

      const result = await connectionPool.query(updateQuery, [status, uid]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
      console.error("Error updating user status:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating user status" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { petId } = req.body;

      // Validate that petId is provided
      if (!petId) {
        return res.status(400).json({ error: "Pet ID is required" });
      }

      // Query to delete the pet by ID and user ID
      const deleteQuery = `
        delete from pets
        where pet_id = $1 and user_id = $2
        returning *
      `;

      const result = await connectionPool.query(deleteQuery, [petId, uid]);

      // Check if a pet was deleted
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Pet not found or not owned by user" });
      }

      return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
      console.error("Error deleting pet:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the pet" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
