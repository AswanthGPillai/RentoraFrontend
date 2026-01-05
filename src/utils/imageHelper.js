import { BASE_URL } from "@/services/serverURL";

export const getImageUrl = (image) => {
  if (!image) return "/default-avatar.png"; // local fallback
  if (image.startsWith("http")) return image;
  return `${BASE_URL}/uploads/${image.replace(/^uploads\//, "")}`;
};
