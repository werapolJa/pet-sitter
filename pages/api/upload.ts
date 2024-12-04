import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import { Readable } from 'stream';
import supabase from "@/utils/supabase";
import { promises as fs } from "fs";

export const config = {
    api: {
        bodyParser: false,
    }
};

// Helper to convert a Buffer to a Stream
function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /* Get files using formidable */
    const files = await new Promise<Array<[string, File]> | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: Array<[string, File]> = [];
        form.on('file', (field, file) => {
            files.push([field, file]);
        });
        form.on('end', () => resolve(files));
        form.on('error', (err) => reject(err));
        form.parse(req, () => {
            //
        });
    }).catch(() => {
        res.status(500).json({ status: 'fail', message: 'Upload error' });
        return undefined;
    });

    if (!files?.length) return; // Stop execution if there are no files

    try {
        const urls: string[] = [];

        /* Upload files to Supabase Storage */
        for (const file of files) {
            const fileData = await fs.readFile(file[1].filepath); // Read file as Buffer
            const filePath = `${Date.now()}_${file[1].originalFilename}`; // Generate unique file name

            const { error: uploadError } = await supabase.storage
                .from('image') // Replace with your bucket name
                .upload(filePath, bufferToStream(fileData), {
                    contentType: file[1].mimetype || 'application/octet-stream',
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            // Get the public URL of the uploaded file
            const { data } = supabase.storage
                .from('image') 
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                urls.push(data.publicUrl);
            }
        }

        res.status(200).json({
            status: 'ok',
            message: 'Files were uploaded successfully',
            urls,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: 'fail',
            message: 'Error uploading to Supabase',
        });
    }
};

export default handler;
