import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is S3-compatible
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME!;

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload audio file to Cloudflare R2
 */
export async function uploadAudioToR2(
  file: Buffer,
  fileName: string,
  contentType: string = "audio/mp3"
): Promise<UploadResult> {
  const sanitizedFileName = sanitizeFileName(fileName);
  const key = `audio/${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Generate public URL (you can configure custom domain in Cloudflare)
  const url = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${BUCKET_NAME}/${key}`;

  return { url, key };
}

/**
 * Delete audio file from Cloudflare R2
 */
export async function deleteAudioFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}
function sanitizeFileName(fileName: string): string {
  return transliterate(fileName)
      .replace(/\s+/g, "-")          // пробіли → дефіси
      .replace(/[^a-z0-9.-]/g, "")   // прибрати все зайве
      .replace(/-+/g, "-")           // кілька дефісів → один
      .replace(/^-|-$/g, "");        // обрізати дефіси з країв
}

function transliterate(fileName: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
    ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
    р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh",
    ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
    ю: "yu", я: "ya",

    ё: "yo", ы: "y", э: "e", ъ: ""
  };
  return fileName
      .toLowerCase()
      .split("")
      .map(char => map[char] ?? char)
      .join("");
}

