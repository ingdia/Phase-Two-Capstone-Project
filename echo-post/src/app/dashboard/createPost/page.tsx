"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("slug", slug);
    form.append("content", content);
    form.append("status", status);
    form.append("tags", JSON.stringify(tags));
    if (coverImage) form.append("coverImage", coverImage);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: form,
    });

    if (res.ok) router.push("/dashboard/posts");
    else alert("Failed to create post");
  };

  return (
    <div className="max-w-4xl font-serif text-gray-700 mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Write a Story</h1>

        <div className="flex gap-4">
          {/* Save as Draft */}
          <button
            type="button"
            onClick={() => {
              setStatus("DRAFT");
              submitRef.current?.click();
            }}
            className="px-4 py-2 rounded-full border text-gray-700 hover:text-white hover:bg-pink-900 transition"
          >
            Save as Draft
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={() => {
              setStatus("PUBLISHED");
              submitRef.current?.click();
            }}
            className="px-5 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
          >
            Publish
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
            className="w-full text-4xl font-bold outline-none p-2 border-b focus:border-black transition"
          />
        </div>

        {/* COVER IMAGE */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Cover Image</label>
          <div className="border rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {preview && (
            <img
              src={preview}
              className="w-full h-72 rounded-xl object-cover shadow-sm border"
            />
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Tags</label>
          <select
            multiple
            className="border rounded-lg p-3 w-full"
            onChange={(e) =>
              setTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            <option value="technology">Technology</option>
            <option value="coding">Coding</option>
            <option value="design">Design</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
          <p className="text-sm text-gray-500">
            Hold CTRL/CMD to select multiple.
          </p>
        </div>

        {/* CONTENT */}
        <textarea
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full border rounded-xl p-4 text-lg leading-relaxed outline-none focus:border-black"
        />

        {/* Hidden submit */}
        <button ref={submitRef} type="submit" className="hidden" />
      </form>
    </div>
  );
}
