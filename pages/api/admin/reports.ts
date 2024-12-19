import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";

type UserWithReports = {
  users_full_name: string;
  petsitters_full_name: string;
  issue: string;
  description: string;
  create_at: string;
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const searchQuery = req.query.search as string;

    // Base query with search conditions if search parameter exists
    const query = `
      select 
        users.full_name as users_full_name,
        pet_sitters.full_name as petsitters_full_name,
        reports.issue,
        reports.description,
        reports.create_at,
        reports.status
      from 
        reports
      inner join 
        users on users.user_id = reports.user_id
      inner join 
        pet_sitters on reports.petsitter_id = pet_sitters.petsitter_id
      ${searchQuery ? "where reports.status = $1" : ""}
    `;

    // Execute the query with or without search parameter
    const result = searchQuery
      ? await connectionPool.query<UserWithReports>(query, [searchQuery])
      : await connectionPool.query<UserWithReports>(query);

    // Directly return the rows from the query result
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in search API:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
