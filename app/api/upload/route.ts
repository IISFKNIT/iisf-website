import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();
    const { image, folder } = body;

    if (!image) {
      return badRequestResponse("Image data is required");
    }

    const result = await uploadImage(image, folder || "iisf");

    if (!result.success) {
      return badRequestResponse(result.error || "Upload failed");
    }

    return successResponse({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    return handleApiError(error, "uploading image");
  }
}
