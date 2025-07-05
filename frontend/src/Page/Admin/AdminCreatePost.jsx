import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "./AdminCreatePost.scss"
const AdminCreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
    fileList: [],
  });

  const editorRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentUpload, setCurrentUpload] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const UploadModal = ({ progress, fileName }) => (
    showUploadModal && (
      <div className="upload-modal">
        <div className="modal-box">
          <h3>파일 업로드 중...</h3>
          <p>{fileName}</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div className="progress-text">{progress.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    )
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorContent = editorRef.current.getContent();
    setShowUploadModal(true);



    try {
      const uploadedFiles = await Promise.all(
        formData.files.map(async (file) => {
          setCurrentUpload(file.name);
          const fileFormData = new FormData();
          fileFormData.append("file", file);
          fileFormData.append("originalName", encodeURIComponent(file.name));

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/upload/file`,
            fileFormData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: percentCompleted,
                }));
              },
            }
          );
          return response.data.fileUrl;
        })
      );
      const postData = {
        title: formData.title,
        content: editorContent,
        fileUrl: uploadedFiles,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, {
        title: formData.title,
        content: editorContent,
        fileUrl: uploadedFiles,

      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setShowUploadModal(false);
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      setShowUploadModal(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newFileList = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      fileList: [...prev.fileList, ...newFileList],
    }));
  };
  const handleFileDelete = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => prev.fileList[i].id !== fileId),
      fileList: prev.fileList.filter((file) => file.id !== fileId),
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="admin-create-post">
      <div className="form-wrapper">
        <h2>새 게시물 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                  "insertdatetime", "media", "table", "code", "help", "wordcount"
                ],
                toolbar: "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | image | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                images_upload_handler: async (blobInfo) => {
                  try {
                    const imageData = new FormData();
                    imageData.append("image", blobInfo.blob());
                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/image`, imageData, {
                      withCredentials: true,
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    return res.data.imageUrl;
                  } catch (err) {
                    console.error("Image upload failed:", err);
                    throw err;
                  }
                },
                automatic_uploads: true,
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="files">첨부파일</label>
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
            />

            {formData.fileList.length > 0 && (
              <ul className="file-list">
                {formData.fileList.map((file) => (
                  <li key={file.id}>
                    <div className="file-info">
                      <svg viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="file-meta">
                        <p className="file-name">{file.name}</p>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleFileDelete(file.id)}
                    >
                      <svg viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="submit">저장</button>
            <button type="button" className="cancel" onClick={() => navigate("/admin/posts")}>취소</button>
          </div>
        </form>
      </div>
      <UploadModal
        progress={uploadProgress[currentUpload] || 0}
        fileName={currentUpload || ""}
      />
    </div>
  );
}

export default AdminCreatePost