import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  PenLine,
  Send,
  Clock,
  Plus,
  ArrowRight,
  Eye,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { AdminLayout } from "../components/AdminLayout";
import { db } from "../firebase";

type BlogPost = {
  id: string;
  title?: string;
  slug?: string;
  status?: "published" | "draft";
  category?: string;
  createdAt?: any;
};

export function DashboardPage() {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [publishedBlogs, setPublishedBlogs] = useState(0);
  const [draftBlogs, setDraftBlogs] = useState(0);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const blogsRef = collection(db, "blogs");
      const blogsSnapshot = await getDocs(blogsRef);

      const blogs = blogsSnapshot.docs.map((blogDoc) => ({
        id: blogDoc.id,
        ...blogDoc.data(),
      })) as BlogPost[];

      setTotalBlogs(blogs.length);

      setPublishedBlogs(
        blogs.filter((blog) => blog.status === "published").length
      );

      setDraftBlogs(blogs.filter((blog) => blog.status === "draft").length);

      const recentQuery = query(
        blogsRef,
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const recentSnapshot = await getDocs(recentQuery);

      const recentData = recentSnapshot.docs.map((blogDoc) => ({
        id: blogDoc.id,
        ...blogDoc.data(),
      })) as BlogPost[];

      setRecentBlogs(recentData);
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${blogTitle}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", blogId));

      setRecentBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== blogId)
      );

      await fetchDashboardData();

      alert("Blog deleted successfully.");
    } catch (error) {
      console.error("Delete blog error:", error);
      alert("Blog not deleted. Please check Firebase rules or console error.");
    }
  };

  return (
    <AdminLayout>
      <section className="dashboard-page">
        <div className="dashboard-hero">
          <div>
            <span className="dashboard-kicker">Blog Management</span>

            <h2>Dashboard</h2>

            <p>
              Manage blog posts, drafts, published content, and new submissions
              from one secure admin panel.
            </p>
          </div>

          <Link to="/blogs/new" className="dashboard-create-btn">
            <Plus size={18} />
            Add New Blog
          </Link>
        </div>

        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <FileText size={24} />
            </div>

            <div>
              <h3>Total Blogs</h3>
              <p>{loading ? "..." : totalBlogs}</p>
              <span>All created posts</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <Send size={24} />
            </div>

            <div>
              <h3>Published</h3>
              <p>{loading ? "..." : publishedBlogs}</p>
              <span>Live on website</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange">
              <PenLine size={24} />
            </div>

            <div>
              <h3>Drafts</h3>
              <p>{loading ? "..." : draftBlogs}</p>
              <span>Pending review</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Quick Actions</h3>
                <p>Common tasks for managing blog content.</p>
              </div>
            </div>

            <div className="quick-action-list">
              <Link to="/blogs/new" className="quick-action-card">
                <div className="quick-action-icon">
                  <Plus size={20} />
                </div>

                <div>
                  <h4>Create New Blog</h4>
                  <p>Write and publish a new blog post.</p>
                </div>

                <ArrowRight size={18} />
              </Link>

              <Link to="/blogs" className="quick-action-card">
                <div className="quick-action-icon">
                  <FileText size={20} />
                </div>

                <div>
                  <h4>View Blog List</h4>
                  <p>Edit, delete, or manage existing posts.</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Blogs</h3>
                <p>Latest blog posts created from the admin panel.</p>
              </div>
            </div>

            {loading ? (
              <div className="activity-empty">
                <Clock size={34} />
                <h4>Loading recent blogs...</h4>
                <p>Please wait while dashboard data is loading.</p>
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="activity-empty">
                <Clock size={34} />
                <h4>No recent activity</h4>
                <p>
                  Once blogs are created or updated, recent actions will be shown
                  in this section.
                </p>
              </div>
            ) : (
              <div className="recent-blog-list">
                {recentBlogs.map((blog) => (
                  <div key={blog.id} className="recent-blog-item">
                    <div>
                      <h4>{blog.title || "Untitled Blog"}</h4>

                      <p>
                        {blog.category || "Uncategorized"} ·{" "}
                        {blog.status || "draft"}
                      </p>
                    </div>

                    <div className="recent-blog-actions">
                      <Link
                        to={`/blog/${blog.slug || blog.id}`}
                        className="dashboard-view-btn"
                        target="_blank"
                      >
                        <Eye size={15} />
                        View
                      </Link>

                      <Link
                        to={`/blogs/edit/${blog.id}`}
                        className="dashboard-edit-btn"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="dashboard-delete-btn"
                        onClick={() =>
                          handleDeleteBlog(
                            blog.id,
                            blog.title || "Untitled Blog"
                          )
                        }
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}