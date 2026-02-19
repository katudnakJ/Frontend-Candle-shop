export const getImageUrl = (path: string | null) => {
  if (!path) return "/placeholder-image.svg"; 
 if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  const PROJECT_ID = "goerhyygukxfkphuyrnw";
  
  
  return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${path}`;
};