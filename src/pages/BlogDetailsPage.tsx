import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

import { db } from "../firebase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  image: string;
  readTime: string;
  content: string;
  status: string;
};

export function BlogDetailsPage() {
  const { slug } = useParams();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setErrorMessage("Blog slug is missing.");
        setLoading(false);
        return;
      }

      try {
        const blogsRef = collection(db, "blogs");
        const blogQuery = query(blogsRef, where("slug", "==", slug));
        const blogSnapshot = await getDocs(blogQuery);

        if (blogSnapshot.empty) {
          setErrorMessage("Blog not found.");
          setLoading(false);
          return;
        }

        const blogDoc = blogSnapshot.docs[0];

        setBlog({
          id: blogDoc.id,
          ...blogDoc.data(),
        } as BlogPost);
      } catch (error) {
        console.error("Blog details fetch error:", error);
        setErrorMessage("Unable to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <main className="public-blog-page">
        <section className="public-blog-container">
          <p>Loading blog...</p>
        </section>
      </main>
    );
  }

  if (errorMessage || !blog) {
    return (
      <main className="public-blog-page">
        <section className="public-blog-container">
          <Link to="/dashboard" className="public-blog-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1>{errorMessage || "Blog not found."}</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="public-blog-page">
      <section className="public-blog-container">
        <Link to="/dashboard" className="public-blog-back">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="public-blog-header">
          <span className="public-blog-category">{blog.category}</span>

          <h1>{blog.title}</h1>

          <p>{blog.excerpt}</p>

          <div className="public-blog-meta">
            <span>
              <User size={16} />
              {blog.author}
            </span>

            <span>
              <Clock size={16} />
              {blog.readTime}
            </span>

            <span>
              <Calendar size={16} />
              Published
            </span>
          </div>
        </div>

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="public-blog-image"
          />
        )}

        <article
          className="public-blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </section>
    </main>
  );
}