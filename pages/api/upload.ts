import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import supabase from "@/utils/supabase";
import { promises as fs } from "fs";

// Disable Next.js bodyParser for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Request received for file upload.");

  if (req.method !== "POST") {
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  try {
    // Parse files using formidable
    const files = await new Promise<Array<formidable.File>>((resolve, reject) => {
      const form = formidable({ multiples: true });

      const fileList: formidable.File[] = [];

      form.on("file", (_, file) => {
        console.log("File received:", { name: file.originalFilename, type: file.mimetype });
        fileList.push(file);
      });

      form.on("end", () => resolve(fileList));
      form.on("error", reject);

      form.parse(req);
    });

    if (!files.length) {
      return res.status(400).json({ status: "fail", message: "No files uploaded" });
    }

    const urls: string[] = [];
    console.log(`Uploading ${files.length} files to Supabase...`);

    // Upload each file to Supabase Storage
    for (const file of files) {
      const fileData = await fs.readFile(file.filepath);
      const fileName = `${Date.now()}_${file.originalFilename}`;
      console.log(`Uploading file: ${fileName}`);

      const { error: uploadError } = await supabase.storage
      .from("image")
      .upload(fileName, fileData, {
        cacheControl: "3600",
        contentType: file.mimetype || "application/octet-stream",
      });   
    

      if (uploadError) {
        console.error(`Error uploading file "${file.originalFilename}":`, uploadError.message);
        throw new Error(uploadError.message);
      }

      // Retrieve public URL for the uploaded file
      const { data } = supabase.storage.from("image").getPublicUrl(fileName);
      if (!data?.publicUrl) {
        console.error(`Failed to retrieve public URL for file: ${fileName}`);
        throw new Error("Failed to retrieve public URL");
      }

      console.log(`Public URL for file "${fileName}": ${data.publicUrl}`);
      urls.push(data.publicUrl);
    }

    // Return all file URLs
    return res.status(200).json({
      status: "ok",
      message: "Files uploaded successfully",
      urls,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export default handler;
