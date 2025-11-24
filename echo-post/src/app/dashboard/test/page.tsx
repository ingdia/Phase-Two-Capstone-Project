"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function TestPage() {
  const { user, token } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string, method = "GET", body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(endpoint, options);
      const data = await res.json();
      
      setResult({
        status: res.status,
        ok: res.ok,
        data,
        endpoint,
        method,
      });
    } catch (error) {
      setResult({
        error: error.message,
        endpoint,
        method,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to test APIs</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-4">
        <p><strong>User:</strong> {user.name || user.username} ({user.id})</p>
        <p><strong>Token:</strong> {token ? "Present" : "Missing"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => testAPI("/auth/me")}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          Test Auth Me
        </button>

        <button
          onClick={() => testAPI("/post?status=PUBLISHED&limit=5")}
          className="p-3 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          Test Get Posts
        </button>

        <button
          onClick={() => testAPI("/users/trending?limit=3")}
          className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={loading}
        >
          Test Trending Users
        </button>

        <button
          onClick={() => testAPI("/post/trending?limit=3")}
          className="p-3 bg-orange-500 text-white rounded hover:bg-orange-600"
          disabled={loading}
        >
          Test Trending Posts
        </button>

        <button
          onClick={() => testAPI("/debug")}
          className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          Test API Debug
        </button>

        <button
          onClick={() => testAPI("/posts-debug")}
          className="p-3 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={loading}
        >
          Debug Posts DB
        </button>

        <button
          onClick={() => testAPI("/test-slug/example-post")}
          className="p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={loading}
        >
          Test Slug Route
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}