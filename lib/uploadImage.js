import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Upload file to wirksi-box.vercel.app and return the raw.githubusercontent URL
 * @param {Buffer} buffer - The file buffer
 * @return {Promise<string>} - The public raw URL
 */
export default async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime });
  form.append('file', blob, `upload-${Date.now()}.${ext}`);

  const res = await fetch('https://wirksi-box.vercel.app/api/upload', {
    method: 'POST',
    body: form
  });

  const result = await res.json();

  if (result?.success && result.url) {
    return result.url; // raw.githubusercontent.com URL
  } else {
    throw new Error(`❌ Error uploading to WirksiBox: ${result?.error || 'No URL returned'}`);
  }
};