// app/articles/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getPostsListTable, MyApiPost } from "@/lib/api/post";

export default function ArticlesPage() {
  const [posts, setPosts] = useState<MyApiPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostsListTable()
      .then((res) => setPosts(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando artículos...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Artículos</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-4 border rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold">{post.title}</h2>
            {post.shortDescription && (
              <p className="text-gray-600">{post.shortDescription}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
