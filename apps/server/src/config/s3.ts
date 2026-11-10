import { S3Client, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "node:stream";

type S3Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

const REGION = readEnv("AWS_REGION", "REGION", "AWS_DEFAULT_REGION") ?? "us-east-1";
const BUCKET = readEnv("S3_BUCKET_NAME", "BUCKET_NAME", "BUCKET");
const CREDENTIALS = resolveCredentials();

const s3 = new S3Client({
  region: REGION,
  ...(CREDENTIALS ? { credentials: CREDENTIALS } : {}),
});

function isPlaceholderCredential(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized.startsWith("dev-") ||
    normalized.includes("changeme") ||
    normalized.includes("your-") ||
    normalized.includes("example") ||
    normalized === "placeholder"
  );
}

function resolveCredentials(): S3Credentials | undefined {
  // Placeholder .env.dev keys must not override the default AWS provider chain.
  return (
    readTemporaryCredentials(
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_SESSION_TOKEN"
    ) ??
    readTemporaryCredentials(
      "ACCESS_KEY_ID",
      "SECRET_ACCESS_KEY",
      "SESSION_TOKEN"
    ) ??
    readCredentialPair("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY") ??
    readCredentialPair("ACCESS_KEY_ID", "SECRET_ACCESS_KEY") ??
    readCredentialPair("ACCESS_KEY", "SECRET_ACCESS_KEY")
  );
}

function readTemporaryCredentials(
  accessKey: string,
  secretKey: string,
  sessionToken: string
): S3Credentials | undefined {
  const accessKeyId = readEnv(accessKey);
  const secretAccessKey = readEnv(secretKey);
  const token = readEnv(sessionToken);

  if (
    isPlaceholderCredential(accessKeyId) ||
    isPlaceholderCredential(secretAccessKey) ||
    !token
  ) {
    return undefined;
  }

  return {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    sessionToken: token,
  };
}

function readCredentialPair(
  accessKey: string,
  secretKey: string
): S3Credentials | undefined {
  const accessKeyId = readEnv(accessKey);
  const secretAccessKey = readEnv(secretKey);

  if (isPlaceholderCredential(accessKeyId) || isPlaceholderCredential(secretAccessKey)) {
    return undefined;
  }

  return {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  };
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function getBucket(): string {
  if (!BUCKET) {
    throw new Error("S3 bucket is not configured. Set S3_BUCKET_NAME or BUCKET_NAME.");
  }
  return BUCKET;
}

/**
 * Generate a presigned download URL for an existing S3 object.
 * Default expiry: 1 hour (3600s).
 */
export const generateDownloadUrl = async (
  key: string,
  expiresIn = 3600,
  fileName?: string,
  disposition: "attachment" | "inline" = "attachment",
  contentType?: string,
): Promise<string> => {
  const contentDisposition = fileName
    ? `${disposition}; filename="${fileName}"`
    : disposition === "inline"
      ? "inline"
      : undefined;
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ...(contentDisposition ? { ResponseContentDisposition: contentDisposition } : {}),
    ...(contentType ? { ResponseContentType: contentType } : {}),
  });
  return getSignedUrl(s3, command, { expiresIn });
};

/**
 * Generate a presigned upload URL so the client can PUT directly to S3.
 * Default expiry: 15 minutes (900s).
 */
export const generateUploadUrl = async (
  key: string,
  contentType: string,
  contentLength?: number,
  expiresIn = 900
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
    ...(contentLength === undefined ? {} : { ContentLength: contentLength }),
  });
  return getSignedUrl(s3, command, { expiresIn });
};

export const deleteObject = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({ Bucket: getBucket(), Key: key });
  await s3.send(command);
};

export const readObjectBuffer = async (key: string): Promise<Buffer> => {
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
  const response = await s3.send(command);
  if (!response.Body) return Buffer.alloc(0);

  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
};

export const readObjectStream = async (key: string, signal: AbortSignal) => {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { abortSignal: signal },
  );
  if (!(response.Body instanceof Readable)) {
    throw new Error("Storage did not return a readable file");
  }
  return { body: response.Body, contentLength: response.ContentLength };
};
