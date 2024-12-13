import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { validate as isUUID } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // เพิ่ม pet_id เพื่อใช้ในการตรวจสอบ id ของ pet
  const { userid, pet_id } = req.query;

  // ตรวจสอบว่า userid ถูกต้อง
  if (!userid || typeof userid !== "string" || !isUUID(userid)) {
    return res.status(400).json({ error: "invalid or missing user id" });
  }
  if (req.method === "GET") {
    try {
      let query = `
        SELECT pet_id, pet_name, pet_type, breed, sex, age, color, weight, about, image, status
        FROM pets
        WHERE user_id = $1
      `;
      // สร้าง params เพื่อใช้ใน query
      const params: (string | number)[] = [userid];

      // ถ้ามี pet_id ให้เพิ่มเงื่อนไข
      if (pet_id) {
        query += ` AND pet_id = $2`;
        params.push(Number(pet_id)); // เปลี่ยน pet_id เป็น number ถ้ามี
      }
      const result = await connectionPool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "user doesn't have a pet" });
      }

      return res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ error: "internal server error" });
    }
  }
}
