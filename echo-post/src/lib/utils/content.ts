export const formatContent = (content: string): string => {
  if (!content) return "";
  
  if (content.includes("<") && content.includes(">")) {
    if (!content.includes("<p>") && !content.includes("<h")) {
      return `<div class="post-content">${content}</div>`;
    }
    return `<div class="post-content">${content}</div>`;
  }
  
  return content
    .split("\n\n")
    .map((para) => {
      if (!para.trim()) return "";
      if (para.trim().startsWith("# ")) {
        return `<h1 class="text-3xl font-bold my-4">${para.trim().substring(2)}</h1>`;
      }
      if (para.trim().startsWith("## ")) {
        return `<h2 class="text-2xl font-bold my-3">${para.trim().substring(3)}</h2>`;
      }
      if (para.trim().startsWith("### ")) {
        return `<h3 class="text-xl font-bold my-2">${para.trim().substring(4)}</h3>`;
      }
      if (para.trim().startsWith("> ")) {
        return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">${para.trim().substring(2)}</blockquote>`;
      }
      return `<p class="mb-4 leading-relaxed">${para.trim().replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
};

export const getAuthorName = (author: { name: string | null; username: string | null }): string => {
  return author.name || author.username || "Anonymous";
};

export const getAuthorInitials = (authorName: string): string => {
  return authorName.charAt(0).toUpperCase();
};