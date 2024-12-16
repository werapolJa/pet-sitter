import { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "@/utils/db";
import { validate as isUUID } from "uuid";

type YourPetRequestBody = {
  pet_name: string;
  pet_type: string;
  breed: string;
  sex: string;
  age: number;
  color: string;
  weight: number;
  image: string;
};

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
        if (isNaN(Number(pet_id))) {
          return res.status(400).json({ error: "Invalid pet ID." });
        }
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

  if (req.method === "POST") {
    // console.log(req.body);

    // ดึงข้อมูลจาก body
    const {
      pet_name,
      pet_type,
      breed,
      sex,
      age,
      color,
      weight,
      image,
      user_id,
    } = req.body;

    // ตรวจสอบว่ามีข้อมูล
    if (
      !pet_name ||
      !pet_type ||
      !breed ||
      !sex ||
      !age ||
      !color ||
      !weight ||
      !image
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields for pet data" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const client = await connectionPool.connect();

    try {
      // สร้างตัวแปล เก็บ query เพื่อนำไปใช้
      const petInsertQuery = `
      INSERT INTO pets (pet_name, pet_type, breed, sex, age, color, weight, image, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;

      const petResult = await client.query(petInsertQuery, [
        pet_name,
        pet_type,
        breed,
        sex,
        age,
        color,
        weight,
        image,
        user_id,
      ]);

      // ถ้าไม่สามารถเพิ่มข้อมูลได้ (ไม่มีผลลัพธ์)
      if (petResult.rowCount === 0) {
        return res.status(400).json({ error: "Failed to add pet data" });
      }

      // ส่งข้อมูลกลับไปหลังจากเพิ่มสำเร็จ
      return res.status(201).json({
        message: "Pet added successfully!",
      });
    } catch (error) {
      console.error("Error inserting pet data:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      // ปล่อยการเชื่อมต่อกลับไปที่ pool
      client.release();
    }
  }

  if (req.method === "PUT") {
    console.log(req.body);

    // ดึงข้อมูลจาก body
    const {
      pet_name,
      pet_type,
      breed,
      sex,
      age,
      color,
      weight,
      image,
      user_id,
    } = req.body;

    // ดึง pet_id จาก query (URL)
    const { pet_id } = req.query;

    // ตรวจสอบว่า pet_id และ user_id ถูกส่งมาใน request หรือไม่
    if (!pet_id || !user_id) {
      return res.status(400).json({ error: "Missing pet_id or user_id" });
    }

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นทั้งหมดหรือไม่
    if (
      !pet_name ||
      !pet_type ||
      !breed ||
      !sex ||
      !age ||
      !color ||
      !weight ||
      !image
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields for pet data" });
    }

    const client = await connectionPool.connect();

    try {
      // ตรวจสอบว่า pet_id ที่ระบุมีอยู่ในฐานข้อมูลหรือไม่
      const checkPetExistsQuery = `
        SELECT * FROM pets WHERE pet_id = $1 AND user_id = $2
      `;
      const { rows: existingPet } = await client.query(checkPetExistsQuery, [
        pet_id,
        user_id,
      ]);

      // หากไม่พบ pet_id ที่ต้องการอัปเดต
      if (existingPet.length === 0) {
        return res
          .status(404)
          .json({ error: "Pet not found or doesn't belong to the user" });
      }

      // สร้าง query สำหรับการอัปเดตข้อมูลของสัตว์เลี้ยง
      const petUpdateQuery = `
        UPDATE pets
        SET pet_name = $1, pet_type = $2, breed = $3, sex = $4, age = $5, color = $6, weight = $7, image = $8
        WHERE pet_id = $9 AND user_id = $10
        RETURNING *;
      `;

      // ส่งคำสั่งอัปเดตข้อมูล
      const petResult = await client.query(petUpdateQuery, [
        pet_name,
        pet_type,
        breed,
        sex,
        age,
        color,
        weight,
        image,
        pet_id,
        user_id,
      ]);

      // ถ้าไม่พบแถวที่ถูกอัปเดต
      if (petResult.rowCount === 0) {
        return res.status(400).json({ error: "Failed to update pet data" });
      }

      // ส่งข้อมูลกลับไปหลังจากอัปเดตสำเร็จ
      return res.status(200).json({
        message: "Pet updated successfully!",
        data: petResult.rows[0], // ส่งข้อมูลสัตว์เลี้ยงที่ถูกอัปเดต
      });
    } catch (error) {
      console.error("Error updating pet data:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      // ปล่อยการเชื่อมต่อกลับไปที่ pool
      client.release();
    }
  }
}
