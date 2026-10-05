import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

export function createR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function listR2Content(prefix = "processes/") {
  const client = createR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!client || !bucket) return [];
  const keys: string[] = [];
  let continuationToken: string | undefined;
  do {
    const response = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken }));
    keys.push(...(response.Contents?.flatMap((object) => object.Key ? [object.Key] : []) ?? []));
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);
  return keys;
}

export async function getR2Text(key: string) {
  if (!key || key.includes("..") || key.startsWith("/")) throw new Error("Invalid R2 object key");
  const client = createR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!client || !bucket) return null;
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return response.Body?.transformToString() ?? null;
}
