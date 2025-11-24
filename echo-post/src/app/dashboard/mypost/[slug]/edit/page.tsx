"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuth();
  const slug = params?.slug as string;
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slugGenerated, setSlugGenerated] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && token) {
      fetchPost();
    }
  }, [slug, token]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/post/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("Failed to load post");
        return;
      }

      const data = await res.json();

      // Check if user is the author
      if (user && data.author.id !== user.id) {
        setError("You don't have permission to edit this post");
        return;
      }

      // Pre-fill form with post data
      setTitle(data.title);
      setSlugGenerated(data.slug);
      setContent(data.content || "");
      setStatus(data.status || "DRAFT");
      setCoverImageUrl(data.coverImage || "");
      setTags(data.tags?.map((tag: any) => tag.slug) || []);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlugGenerated(
      value
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!token) {
      throw new Error("Not authenticated");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();
    return data.url;
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setCoverImageUrl(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    handleImageUpload(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      alert("Please drop an image file");
    }
  }, [token]);

  const removeCoverImage = () => {
    setCoverImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus?: "DRAFT" | "PUBLISHED") => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    if (!token) {
      alert("Please login to edit post");
      router.push("/login");
      return;
    }

    const finalStatus = submitStatus || status;
    setSubmitting(true);

    try {
      const body = {
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImageUrl || null,
        tags: tags,
        status: finalStatus,
      };

      const res = await fetch(`/post/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert(finalStatus === "PUBLISHED" ? "Post published successfully!" : "Post updated successfully!");
        router.push(`/dashboard/mypost/${slugGenerated || slug}`);
      } else {
        alert(data.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-pink-900 hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl font-serif text-gray-700 mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Edit Story</h1>

        <div className="flex gap-3">
          {/* Save as Draft */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={submitting}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-pink-900 hover:text-pink-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Draft"}
          </button>

          {/* Update / Publish */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            disabled={submitting}
            className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* TITLE */}
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-5xl font-bold outline-none p-2 border-b-2 border-transparent focus:border-gray-300 transition"
          />
        </div>

        {/* COVER IMAGE */}
        <div className="space-y-3">
          {!coverImageUrl ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                uploadingImage ? "opacity-50 cursor-wait" : "border-gray-300 hover:border-pink-500 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploadingImage}
              />
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-pink-900 animate-spin" />
                  <p className="text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-gray-700 font-medium mb-1">Add a cover image</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative group">
              <img
                src={coverImageUrl}
                alt="Cover"
                className="w-full h-96 rounded-xl object-cover shadow-lg border"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-3">
          <label className="text-gray-700 font-medium block">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-900 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-pink-900 focus:ring-1 focus:ring-pink-900"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium block">Story</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Tell your story..."
          />
        </div>


      </form>
    </div>
  );
}

