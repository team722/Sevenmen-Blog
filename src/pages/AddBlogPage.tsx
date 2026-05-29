import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

export function AddBlogPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("Sevenmen Team");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

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
      setLoading(true);

      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        slug: finalSlug,
        category: category.trim(),
        author: author.trim(),
        excerpt: excerpt.trim(),
        image: imageUrl.trim(),
        readTime: readTime.trim(),
        content: content.trim(),
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage("Blog saved successfully.");
      setMessageType("success");

      setTitle("");
      setSlug("");
      setCategory("");
      setAuthor("Sevenmen Team");
      setExcerpt("");
      setImageUrl("");
      setReadTime("");
      setContent("");

      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      console.error("Firebase save error:", error);
      setMessage("Blog not saved. Check Firebase rules or console error.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const editorHeader = (
    <span className="ql-formats blog-editor-toolbar">
      <select className="ql-header" defaultValue="">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="">Normal</option>
      </select>

      <select className="ql-font" defaultValue="">
        <option value="">Default</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      <select className="ql-size" defaultValue="">
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>

      <button className="ql-bold" type="button" />
      <button className="ql-italic" type="button" />
      <button className="ql-underline" type="button" />
      <button className="ql-strike" type="button" />

      <select className="ql-color" />
      <select className="ql-background" />

      <button className="ql-list" value="ordered" type="button" />
      <button className="ql-list" value="bullet" type="button" />

      <button className="ql-indent" value="-1" type="button" />
      <button className="ql-indent" value="+1" type="button" />

      <select className="ql-align" defaultValue="">
        <option value="">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>

      <button className="ql-blockquote" type="button" />
      <button className="ql-code-block" type="button" />

      <button className="ql-link" type="button" />
      <button className="ql-image" type="button" />
      <button className="ql-video" type="button" />

      <button className="ql-clean" type="button" />
    </span>
  );

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

            <h2>Add New Blog</h2>

            <p>
              Create a new blog post, add SEO-friendly details, write content,
              and publish directly to Firebase.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="blog-create-form">
          <section className="blog-form-card">
            <div className="blog-form-header">
              <div>
                <h3>Basic Details</h3>
                <p>Add the main blog information used on the website.</p>
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
                <p>Use the editor to write and format the full blog content.</p>
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
                style={{ height: "420px" }}
                placeholder="Write full blog content here..."
              />
            </div>
          </section>

          {message && <p className={`blog-message ${messageType}`}>{message}</p>}

          <button type="submit" disabled={loading} className="blog-save-btn">
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Saving Blog...
              </>
            ) : (
              <>
                Save Blog
                <Save size={18} />
              </>
            )}
          </button>
        </form>
      </main>
    </AdminLayout>
  );
}


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { Editor } from "primereact/editor";
// import {
//   ArrowLeft,
//   Save,
//   Loader2,
//   Heading,
//   Link as LinkIcon,
//   Tag,
//   User,
//   Clock,
//   Image,
//   FileText,
//   Upload,
// } from "lucide-react";

// import { AdminLayout } from "../components/AdminLayout";
// import { db, storage } from "../firebase";

// function createSlug(value: string) {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// function stripHtml(value: string) {
//   return value.replace(/<[^>]*>/g, "").trim();
// }

// export function AddBlogPage() {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [category, setCategory] = useState("");
//   const [author, setAuthor] = useState("Sevenmen Team");
//   const [excerpt, setExcerpt] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [readTime, setReadTime] = useState("");
//   const [content, setContent] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState<"success" | "error" | "">("");

//   const handleFeaturedImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setMessage("Please upload a valid image file.");
//       setMessageType("error");
//       return;
//     }

//     try {
//       setImageUploading(true);
//       setMessage("");
//       setMessageType("");

//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);

//       const cleanFileName = file.name.replace(/\s+/g, "-").toLowerCase();
//       const fileName = `${Date.now()}-${cleanFileName}`;
//       const imageRef = ref(storage, `blog-featured-images/${fileName}`);

//       await uploadBytes(imageRef, file);

//       const downloadUrl = await getDownloadURL(imageRef);

//       setImageUrl(downloadUrl);
//       setMessage("Featured image uploaded successfully.");
//       setMessageType("success");
//     } catch (error) {
//       console.error("Image upload error:", error);
//       setMessage("Image upload failed. Check Firebase Storage rules.");
//       setMessageType("error");
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setMessage("");
//     setMessageType("");

//     const finalSlug = createSlug(slug || title);
//     const plainContent = stripHtml(content);

//     if (
//       !title.trim() ||
//       !finalSlug ||
//       !category.trim() ||
//       !author.trim() ||
//       !excerpt.trim() ||
//       !imageUrl.trim() ||
//       !readTime.trim() ||
//       !plainContent
//     ) {
//       setMessage("Please fill all fields.");
//       setMessageType("error");
//       return;
//     }

//     try {
//       setLoading(true);

//       await addDoc(collection(db, "blogs"), {
//         title: title.trim(),
//         slug: finalSlug,
//         category: category.trim(),
//         author: author.trim(),
//         excerpt: excerpt.trim(),
//         image: imageUrl.trim(),
//         readTime: readTime.trim(),
//         content: content.trim(),
//         status: "published",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       setMessage("Blog saved successfully.");
//       setMessageType("success");

//       setTitle("");
//       setSlug("");
//       setCategory("");
//       setAuthor("Sevenmen Team");
//       setExcerpt("");
//       setImageUrl("");
//       setImagePreview("");
//       setReadTime("");
//       setContent("");

//       setTimeout(() => {
//         navigate("/blogs");
//       }, 1000);
//     } catch (error) {
//       console.error("Firebase save error:", error);
//       setMessage("Blog not saved. Check Firebase rules or console error.");
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editorHeader = (
//     <span className="ql-formats blog-editor-toolbar">
//       <select className="ql-header" defaultValue="">
//         <option value="1">Heading 1</option>
//         <option value="2">Heading 2</option>
//         <option value="3">Heading 3</option>
//         <option value="4">Heading 4</option>
//         <option value="">Normal</option>
//       </select>

//       <select className="ql-font" defaultValue="">
//         <option value="">Default</option>
//         <option value="serif">Serif</option>
//         <option value="monospace">Monospace</option>
//       </select>

//       <select className="ql-size" defaultValue="">
//         <option value="small">Small</option>
//         <option value="">Normal</option>
//         <option value="large">Large</option>
//         <option value="huge">Huge</option>
//       </select>

//       <button className="ql-bold" type="button" />
//       <button className="ql-italic" type="button" />
//       <button className="ql-underline" type="button" />
//       <button className="ql-strike" type="button" />

//       <select className="ql-color" />
//       <select className="ql-background" />

//       <button className="ql-list" value="ordered" type="button" />
//       <button className="ql-list" value="bullet" type="button" />

//       <button className="ql-indent" value="-1" type="button" />
//       <button className="ql-indent" value="+1" type="button" />

//       <select className="ql-align" defaultValue="">
//         <option value="">Left</option>
//         <option value="center">Center</option>
//         <option value="right">Right</option>
//         <option value="justify">Justify</option>
//       </select>

//       <button className="ql-blockquote" type="button" />
//       <button className="ql-code-block" type="button" />

//       <button className="ql-link" type="button" />
//       <button className="ql-image" type="button" />
//       <button className="ql-video" type="button" />

//       <button className="ql-clean" type="button" />
//     </span>
//   );

//   return (
//     <AdminLayout>
//       <main className="blog-create-page">
//         <section className="blog-create-hero">
//           <div>
//             <button
//               type="button"
//               className="blog-back-btn"
//               onClick={() => navigate("/blogs")}
//             >
//               <ArrowLeft size={18} />
//               Back to Blogs
//             </button>

//             <span className="blog-create-kicker">Blog Management</span>

//             <h2>Add New Blog</h2>

//             <p>
//               Create a new blog post, add SEO-friendly details, write content,
//               and publish directly to Firebase.
//             </p>
//           </div>
//         </section>

//         <form onSubmit={handleSubmit} className="blog-create-form">
//           <section className="blog-form-card">
//             <div className="blog-form-header">
//               <div>
//                 <h3>Basic Details</h3>
//                 <p>Add the main blog information used on the website.</p>
//               </div>
//             </div>

//             <div className="blog-form-grid two">
//               <div className="blog-field">
//                 <label>Blog Title</label>

//                 <div className="blog-input-wrap">
//                   <Heading size={18} />
//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(event) => {
//                       const value = event.target.value;
//                       setTitle(value);
//                       setSlug(createSlug(value));
//                     }}
//                     placeholder="Enter blog title"
//                   />
//                 </div>
//               </div>

//               <div className="blog-field">
//                 <label>Blog Slug</label>

//                 <div className="blog-input-wrap">
//                   <LinkIcon size={18} />
//                   <input
//                     type="text"
//                     value={slug}
//                     onChange={(event) => setSlug(createSlug(event.target.value))}
//                     placeholder="blog-url-slug"
//                   />
//                 </div>

//                 <small>/blog/{slug || "blog-url-slug"}</small>
//               </div>
//             </div>

//             <div className="blog-form-grid three">
//               <div className="blog-field">
//                 <label>Category</label>

//                 <div className="blog-input-wrap">
//                   <Tag size={18} />
//                   <input
//                     type="text"
//                     value={category}
//                     onChange={(event) => setCategory(event.target.value)}
//                     placeholder="SEO"
//                   />
//                 </div>
//               </div>

//               <div className="blog-field">
//                 <label>Author</label>

//                 <div className="blog-input-wrap">
//                   <User size={18} />
//                   <input
//                     type="text"
//                     value={author}
//                     onChange={(event) => setAuthor(event.target.value)}
//                     placeholder="Sevenmen Team"
//                   />
//                 </div>
//               </div>

//               <div className="blog-field">
//                 <label>Read Time</label>

//                 <div className="blog-input-wrap">
//                   <Clock size={18} />
//                   <input
//                     type="text"
//                     value={readTime}
//                     onChange={(event) => setReadTime(event.target.value)}
//                     placeholder="5 min read"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="blog-field">
//               <label>Featured Image</label>

//               <div className="blog-upload-box">
//                 <input
//                   id="featuredImage"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFeaturedImageUpload}
//                   disabled={imageUploading}
//                 />

//                 <label htmlFor="featuredImage" className="blog-upload-label">
//                   {imageUploading ? (
//                     <>
//                       <Loader2 size={18} className="spin" />
//                       Uploading Image...
//                     </>
//                   ) : (
//                     <>
//                       <Upload size={18} />
//                       Choose Featured Image
//                     </>
//                   )}
//                 </label>

//                 {imageUrl && (
//                   <small className="blog-upload-success">
//                     Image uploaded successfully
//                   </small>
//                 )}
//               </div>

//               {(imagePreview || imageUrl) && (
//                 <div className="blog-image-preview">
//                   <img src={imagePreview || imageUrl} alt="Featured preview" />
//                 </div>
//               )}
//             </div>

//             <div className="blog-field">
//               <label>Short Description</label>

//               <textarea
//                 value={excerpt}
//                 onChange={(event) => setExcerpt(event.target.value)}
//                 placeholder="Write short blog description"
//                 rows={4}
//               />
//             </div>
//           </section>

//           <section className="blog-form-card">
//             <div className="blog-form-header">
//               <div>
//                 <h3>Blog Content</h3>
//                 <p>Use the editor to write and format the full blog content.</p>
//               </div>
//             </div>

//             <div className="blog-editor-box">
//               <div className="blog-editor-top">
//                 <div>
//                   <FileText size={18} />
//                   <span>Content Editor</span>
//                 </div>

//                 <small>Saved as HTML</small>
//               </div>

//               <Editor
//                 value={content}
//                 onTextChange={(event) => setContent(event.htmlValue || "")}
//                 headerTemplate={editorHeader}
//                 style={{ height: "420px" }}
//                 placeholder="Write full blog content here..."
//               />
//             </div>
//           </section>

//           {message && <p className={`blog-message ${messageType}`}>{message}</p>}

//           <button
//             type="submit"
//             disabled={loading || imageUploading}
//             className="blog-save-btn"
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={18} className="spin" />
//                 Saving Blog...
//               </>
//             ) : (
//               <>
//                 Save Blog
//                 <Save size={18} />
//               </>
//             )}
//           </button>
//         </form>
//       </main>
//     </AdminLayout>
//   );
// }