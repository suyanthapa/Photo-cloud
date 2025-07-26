

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const fileName = urlParts.pop(); // abc123xyz.png
    const folder = urlParts.pop();   // uploads
    const publicId = `${folder}/${fileName?.split('.')[0]}`; // uploads/abc123xyz
    return publicId;
  } catch (error) {
    console.error("Failed to extract publicId from URL:", error);
    return null;
  }
}
