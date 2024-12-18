import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { validate as isUUID } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.query;

  if (!userid || typeof userid !== "string" || !isUUID(userid)) {
    return res.status(400).json({ error: "invalid or missing user id" });
  }

  // Handle GET method
  if (req.method === "GET") {
    try {
      const query = `
        select u.full_name, u.phone, u.image, au.email, u.id_number, u.birthdate
        from users u
        inner join auth.users au on u.user_id = au.id
        where u.user_id = $1
      `;
      const result = await connectionPool.query(query, [userid]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "user not found" });
      }

      return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
      console.error("error fetching user data:", error);
      return res.status(500).json({ error: "internal server error" });
    }
  }

  if (req.method === "PUT") {
    const { full_name, phone, image, email, id_number, birthdate } = req.body;

    // Validate the required fields
    if (!full_name || !phone || !email) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const client = await connectionPool.connect();

    try {
      // Begin transaction
      await client.query("BEGIN");

      // Check if the full_name is already used by another user (excluding current user)
      const nameCheckQuery = `
      select full_name 
      from users 
      where full_name = $1 AND user_id != $2
    `;

      const { rows: existingName } = await client.query(nameCheckQuery, [
        full_name,
        userid,
      ]);

      if (Array.isArray(existingName) && existingName.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this name already exists" });
      }

      // Check if the email is already used by another user (excluding current user)
      const emailCheckQuery = `
      select au.email  
      from auth.users au 
      inner join users u ON u.user_id = au.id 
      where au.email = $1 AND u.user_id != $2
    `;

      const { rows: existingEmail } = await client.query(emailCheckQuery, [
        email,
        userid,
      ]);

      if (Array.isArray(existingEmail) && existingEmail.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Check if the phone is already used by another user (excluding current user)
      const phoneCheckQuery = `
      select phone 
      from users 
      where phone = $1 AND user_id != $2
    `;

      const { rows: existingPhone } = await client.query(phoneCheckQuery, [
        phone,
        userid,
      ]);

      if (Array.isArray(existingPhone) && existingPhone.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this phone already exists" });
      }

      // Check if the ID number is already used by another user (excluding current user)
      const idNumberCheckQuery = `
       select id_number 
       from users 
       where id_number = $1 AND user_id != $2
     `;

      const { rows: existingIdNumber } = await client.query(
        idNumberCheckQuery,
        [id_number, userid]
      );

      if (Array.isArray(existingIdNumber) && existingIdNumber.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this ID number already exists" });
      }

      // First update the 'users' table
      const userUpdateQuery = `
        update users u
        set full_name = $1, phone = $2, image = $3, id_number = $4, birthdate = $5
        where u.user_id = $6
        returning u.full_name, u.phone, u.image, u.id_number, u.birthdate;
      `;

      const userResult = await client.query(userUpdateQuery, [
        full_name,
        phone,
        image || null,
        id_number || null,
        birthdate || null,
        userid,
      ]);

      if (userResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "user not found or no update" });
      }

      // Then update the 'auth.users' table
      const authUserUpdateQuery = `
        update auth.users
        set email = $1
        where id = $2;
      `;

      const authUserResult = await client.query(authUserUpdateQuery, [
        email,
        userid,
      ]);

      if (authUserResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "email update failed" });
      }

      // Commit transaction if both updates are successful
      await client.query("COMMIT");

      return res.status(200).json({ data: userResult.rows[0] });
    } catch (error) {
      // Rollback transaction in case of an error
      await client.query("ROLLBACK");
      console.error("Error updating user data:", error);
      return res.status(500).json({ error: "internal server error" });
    } finally {
      // Release the client connection back to the pool
      client.release();
    }
  }

  // If the method is not GET or PUT, return method not allowed
  return res.status(405).json({ error: "method not allowed" });
}
