import { NextApiRequest, NextApiResponse } from "next"; // Imports types for API request and response
import formidable from "formidable"; // Imports the formidable library for parsing form data (including file uploads)
import supabase from "@/utils/supabase"; // Imports the Supabase client to interact with Supabase Storage
import { promises as fs } from "fs"; // Imports the file system module's promises API for reading files asynchronously

// Disable Next.js bodyParser for this API route to handle file uploads manually with formidable
export const config = {
  api: {
    bodyParser: false, // Disables default body parsing, allowing us to use a custom parser (formidable)
  },
};

// API route handler function
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Request received for file upload."); // Logs a message when a request is received for file upload

  // Check if the HTTP request method is POST
  if (req.method !== "POST") {
    // If the method is not POST, return a 405 (Method Not Allowed) status with an error message
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  try {
    // Parse the files in the request using formidable
    const files = await new Promise<Array<formidable.File>>((resolve, reject) => {
      const form = formidable({ multiples: true }); // Create a new formidable form instance with support for multiple files

      const fileList: formidable.File[] = []; // Initialize an empty array to store the uploaded files

      // When a file is uploaded, this event will trigger
      form.on("file", (_, file) => {
        console.log("File received:", { name: file.originalFilename, type: file.mimetype }); // Logs details of each uploaded file
        fileList.push(file); // Adds the uploaded file to the list
      });

      // When file parsing is complete, resolve the promise with the file list
      form.on("end", () => resolve(fileList));
      
      // If an error occurs during file parsing, reject the promise with the error
      form.on("error", reject);

      // Parse the incoming request and handle the form
      form.parse(req);
    });

    // If no files were uploaded, return a 400 (Bad Request) status with an error message
    if (!files.length) {
      return res.status(400).json({ status: "fail", message: "No files uploaded" });
    }

    const urls: string[] = []; // Initialize an empty array to store URLs of uploaded files
    console.log(`Uploading ${files.length} files to Supabase...`); // Log the number of files to be uploaded

    // Loop through each uploaded file and upload it to Supabase Storage
    for (const file of files) {
      const fileData = await fs.readFile(file.filepath); // Read the file's data from the local server storage
      const fileName = `${Date.now()}_${file.originalFilename}`; // Generate a unique file name using the current timestamp
      console.log(`Uploading file: ${fileName}`); // Log the file being uploaded

      // Upload the file to Supabase Storage, specifying cache control and content type
      const { error: uploadError } = await supabase.storage
        .from("petimage") // Specify the Supabase storage bucket (in this case, "image")
        .upload(fileName, fileData, {
          cacheControl: "3600", // Set cache control header for the file
          contentType: file.mimetype || "application/octet-stream", // Set content type based on file's MIME type or default to octet-stream
        });   

      // If there is an error during upload, log the error and throw it
      if (uploadError) {
        console.error(`Error uploading file "${file.originalFilename}":`, uploadError.message);
        throw new Error(uploadError.message);
      }

      // Retrieve the public URL of the uploaded file from Supabase Storage
      const { data } = supabase.storage.from("image").getPublicUrl(fileName);
      
      // If the public URL is not available, log an error and throw an exception
      if (!data?.publicUrl) {
        console.error(`Failed to retrieve public URL for file: ${fileName}`);
        throw new Error("Failed to retrieve public URL");
      }

      // Log the public URL of the uploaded file
      console.log(`Public URL for file "${fileName}": ${data.publicUrl}`);
      urls.push(data.publicUrl); // Add the public URL to the array of URLs
    }

    // Return a success response with the URLs of the uploaded files
    return res.status(200).json({
      status: "ok", // Indicate success
      message: "Files uploaded successfully", // Success message
      urls, // Array of URLs for the uploaded files
    });
  } catch (error) {
    // If an error occurs during the process, log the error and return a 500 (Internal Server Error) response
    console.error("Error during file upload:", error);
    return res.status(500).json({
      status: "fail", // Indicate failure
      message: "Internal server error", // Error message
    });
  }
};

// Export the handler function as the default export of the module
export default handler;
