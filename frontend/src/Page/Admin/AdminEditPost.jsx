import React, { useEffect, useState, useRef } from 'react'
import "./AdminEditPost.scss"
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Editor } from "@tinymce/tinymce-react";
const AdminEditPost = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
    fileList: []
  })
  const editorRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentUpload, setCurrentUpload] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${id}`)

        setFormData({
          title: response.data.title,
          content: response.data.content,
          files: [],
          fileList: [],
          existingFiles: response.data.fileUrl || []
        })
      } catch (error) {
        console.log("게시물 가져오는 중 에러 발생", error)
        navigate("/admin" / posts)
      }
    }
    fetchPost()

  }, [id, navigate])

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
      const imgRegex = /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
      const currentImages = editorContent.match(imgRegex)

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
        fileUrl: [...formData.existingFiles, ...uploadedFiles], 
        currentImages: currentImages
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/post/${id}`,
        postData,
        {
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

    <div className="create-post-wrapper">
      <div className="create-post-container">
        <h2 className="create-post-title">게시물 수정</h2>

        <form onSubmit={handleSubmit} className="form-layout">
          <div>
            <label htmlFor="title" className="input-label">제목</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-input"
              required
            />
          </div>

          <div>
            <label className="input-label">내용</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                toolbar_mode: "scrolling",
                toolbar_sticky: true,
                toolbar_location: "top",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | image | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } @media (max-width: 768px) { body { font-size: 16px; } }",
                images_upload_handler: async (blobInfo, progress) => {
                  try {
                    const formData = new FormData();
                    formData.append("image", blobInfo.blob());
                    const response = await axios.post(
                      `${import.meta.env.VITE_API_URL}/api/upload/image`,
                      formData,
                      {
                        withCredentials: true,
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    return response.data.imageUrl;
                  } catch (error) {
                    console.error("Image upload failed:", error);
                    throw error;
                  }
                },
                file_picker_types: "image",
                automatic_uploads: true,
                file_picker_callback: function (cb, value, meta) {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = function () {
                    const file = this.files[0];
                    const reader = new FileReader();
                    reader.onload = function () {
                      const id = "blobid" + new Date().getTime();
                      const blobCache =
                        editorRef.current.editorUpload.blobCache;
                      const base64 = reader.result.split(",")[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                },
              }}
            />
          </div>


          <div>
            <label htmlFor="files" className="input-label">첨부파일</label>
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />

            {formData.fileList.length > 0 && (
              <div className="file-list">
                <p className="file-list-title">첨부된 파일 목록:</p>
                <ul>
                  {formData.fileList.map((file) => (
                    <li key={file.id} className="file-item">
                      <div className="file-info">
                        <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(file.id)}
                        className="delete-button"
                      >
                        <svg className="file-delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">저장</button>
            <button type="button" onClick={() => navigate("/admin/posts")} className="cancel-button">취소</button>
          </div>
        </form>
      </div>

      <UploadModal
        progress={uploadProgress[currentUpload] || 0}
        fileName={currentUpload || ""}
      />
    </div>

  )
}


export default AdminEditPost