export const getImageUrl = (path?: string | null) => {
  if (!path) return "/images/user/owner.jpg";
  if (path.startsWith("http")) return path;
  
  // Extract API base URL properly to exactly match axios.ts configuration.
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
  const baseUrl = apiUrl.replace(/\/api(\/v\d+)?$/, "");
  
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};
