import './SinglePost.scss';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

// 아이콘 (MUI 아이콘만 활용)
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';

const SinglePost = () => {
  const { id } = useParams();              // URL 파라미터로 게시글 ID 추출
  const navigate = useNavigate();         // 뒤로가기 등 네비게이션용

  const [post, setPost] = useState(null); // 게시글 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [openSnackbar, setOpenSnackbar] = useState(false); // 공유 메시지 표시

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${id}`);

        setPost(res.data);
      } catch (error) {
        console.error("게시글 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 첨부파일 다운로드
  const handleFileDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  // 현재 URL 클립보드 복사
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 2000);
  };

  // 로딩 중일 때 스켈레톤 화면
  if (loading) {
    return (
      <section className="single-post-container">
        <div className="inner">
          <div className="single-post-paper">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <hr className="single-post-divider" />
            <div className="skeleton skeleton-rect"></div>
          </div>
        </div>
      </section>
    );
  }

  // 게시글 상세 화면 렌더링
  return (
    <section className="single-post-container">
      <div className="inner">

        {/* 뒤로가기 / 공유 버튼 */}
        <div className="post-nav">
          <button onClick={() => navigate(-1)} className="icon-btn" aria-label="뒤로가기">
            <ArrowBackIcon />
          </button>
          <button onClick={handleShare} className="icon-btn" aria-label="공유하기">
            <ShareIcon />
          </button>
        </div>

        {/* 게시글 본문 */}
        <div className="single-post-paper">
          <div className="post-header">
            <div className="post-meta">
              <div className="post-info">
                <span className="post-number">No. {post.number}</span>
                <div className="post-views">
                  <VisibilityIcon className="icon" />
                  <span>{post.views}</span>
                </div>
              </div>
              <h1>{post.title}</h1>
              <div className="post-date">
                {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </div>
            </div>
          </div>

          <hr className="single-post-divider" />

          {/* 게시글 내용 */}
          <div className="post-content">
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: post.renderedContent }}
            />
          </div>

          {/* 첨부파일 목록 */}
          {post.fileUrl && post.fileUrl.length > 0 && (
            <div className="post-attachments">
              <p>첨부파일</p>
              <div className="attachment-list">
                {post.fileUrl.map((file, index) => (
                  <button
                    key={index}
                    className="attachment-chip"
                    onClick={() => handleFileDownload(file)}
                  >
                    <FileDownloadIcon className="icon" />
                    {file.split("/").pop()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 공유 알림 메시지 */}
        {openSnackbar && (
          <div className="snackbar">URL이 클립보드에 복사되었습니다</div>
        )}
      </div>
    </section>
  );
};

export default SinglePost;
