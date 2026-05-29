import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Editor } from "primereact/editor";
import {
  ArrowLeft,
  Save,
  Loader2,
  Heading,
  Link as LinkIcon,
  Tag,
  User,
  Clock,
  Image,
  FileText,
} from "lucide-react";

import { AdminLayout } from "../components/AdminLayout";
import { db } from "../firebase";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

export function BlogEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setMessage("Blog ID is missing.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setMessage("Blog not found.");
          setMessageType("error");
          setLoading(false);
          return;
        }

        const blogData = blogSnap.data();

        setTitle(blogData.title || "");
        setSlug(blogData.slug || "");
        setCategory(blogData.category || "");
        setAuthor(blogData.author || "Sevenmen Team");
        setExcerpt(blogData.excerpt || "");
        setImageUrl(blogData.image || "");
        setReadTime(blogData.readTime || "");
        setContent(blogData.content || "");
        setStatus(blogData.status || "published");
      } catch (error) {
        console.error("Fetch blog error:", error);
        setMessage("Unable to load blog. Please try again.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!id) {
      setMessage("Blog ID is missing.");
      setMessageType("error");
      return;
    }

    const finalSlug = createSlug(slug || title);
    const plainContent = stripHtml(content);

    if (
      !title.trim() ||
      !finalSlug ||
      !category.trim() ||
      !author.trim() ||
      !excerpt.trim() ||
      !imageUrl.trim() ||
      !readTime.trim() ||
      !plainContent
    ) {
      setMessage("Please fill all fields.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const blogRef = doc(db, "blogs", id);

      await updateDoc(blogRef, {
        title: title.trim(),
        slug: finalSlug,
        category: category.trim(),
        author: author.trim(),
        excerpt: excerpt.trim(),
        image: imageUrl.trim(),
        readTime: readTime.trim(),
        content: content.trim(),
        status,
        updatedAt: serverTimestamp(),
      });

      setMessage("Blog updated successfully.");
      setMessageType("success");

      setTimeout(() => {
        navigate("/blogs");
      }, 900);
    } catch (error) {
      console.error("Update blog error:", error);
      setMessage("Blog not updated. Check Firebase rules or console error.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const editorHeader = (
    <span className="ql-formats">
      <select className="ql-header" defaultValue="">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="">Normal</option>
      </select>

      <button className="ql-bold" type="button" />
      <button className="ql-italic" type="button" />
      <button className="ql-underline" type="button" />
      <button className="ql-list" value="ordered" type="button" />
      <button className="ql-list" value="bullet" type="button" />
      <button className="ql-blockquote" type="button" />
      <button className="ql-link" type="button" />
      <button className="ql-clean" type="button" />
    </span>
  );

  if (loading) {
    return (
      <AdminLayout>
        <main className="blog-create-page">
          <section className="blog-form-card">
            <p>Loading blog details...</p>
          </section>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="blog-create-page">
        <section className="blog-create-hero">
          <div>
            <button
              type="button"
              className="blog-back-btn"
              onClick={() => navigate("/blogs")}
            >
              <ArrowLeft size={18} />
              Back to Blogs
            </button>

            <span className="blog-create-kicker">Blog Management</span>

            <h2>Edit Blog</h2>

            <p>
              Update blog details, edit content, and save changes directly to
              Firebase.
            </p>
          </div>
        </section>

        <form onSubmit={handleUpdate} className="blog-create-form">
          <section className="blog-form-card">
            <div className="blog-form-header">
              <div>
                <h3>Basic Details</h3>
                <p>Edit the main blog information used on the website.</p>
              </div>
            </div>

            <div className="blog-form-grid two">
              <div className="blog-field">
                <label>Blog Title</label>

                <div className="blog-input-wrap">
                  <Heading size={18} />

                  <input
                    type="text"
                    value={title}
                    onChange={(event) => {
                      const value = event.target.value;
                      setTitle(value);
                      setSlug(createSlug(value));
                    }}
                    placeholder="Enter blog title"
                  />
                </div>
              </div>

              <div className="blog-field">
                <label>Blog Slug</label>

                <div className="blog-input-wrap">
                  <LinkIcon size={18} />

                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(createSlug(event.target.value))}
                    placeholder="blog-url-slug"
                  />
                </div>

                <small>/blog/{slug || "blog-url-slug"}</small>
              </div>
            </div>

            <div className="blog-form-grid three">
              <div className="blog-field">
                <label>Category</label>

                <div className="blog-input-wrap">
                  <Tag size={18} />

                  <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="SEO"
                  />
                </div>
              </div>

              <div className="blog-field">
                <label>Author</label>

                <div className="blog-input-wrap">
                  <User size={18} />

                  <input
                    type="text"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    placeholder="Sevenmen Team"
                  />
                </div>
              </div>

              <div className="blog-field">
                <label>Read Time</label>

                <div className="blog-input-wrap">
                  <Clock size={18} />

                  <input
                    type="text"
                    value={readTime}
                    onChange={(event) => setReadTime(event.target.value)}
                    placeholder="5 min read"
                  />
                </div>
              </div>
            </div>

            <div className="blog-form-grid two">
              <div className="blog-field">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="blog-field">
                <label>Featured Image URL</label>

                <div className="blog-input-wrap">
                  <Image size={18} />

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="blog-field">
              <label>Short Description</label>

              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Write short blog description"
                rows={4}
              />
            </div>
          </section>

          <section className="blog-form-card">
            <div className="blog-form-header">
              <div>
                <h3>Blog Content</h3>
                <p>Update the full blog content using the editor.</p>
              </div>
            </div>

            <div className="blog-editor-box">
              <div className="blog-editor-top">
                <div>
                  <FileText size={18} />
                  <span>Content Editor</span>
                </div>

                <small>Saved as HTML</small>
              </div>

              <Editor
                value={content}
                onTextChange={(event) => setContent(event.htmlValue || "")}
                headerTemplate={editorHeader}
                style={{ height: "360px" }}
                placeholder="Write full blog content here..."
              />
            </div>
          </section>

          {message && <p className={`blog-message ${messageType}`}>{message}</p>}

          <button type="submit" disabled={saving} className="blog-save-btn">
            {saving ? (
              <>
                <Loader2 size={18} className="spin" />
                Updating Blog...
              </>
            ) : (
              <>
                Update Blog
                <Save size={18} />
              </>
            )}
          </button>
        </form>
      </main>
    </AdminLayout>
  );
}