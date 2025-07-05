import React,{useEffect, useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Forum.scss";     // SCSS 연결
import axios from "axios"
const Forum = () => {

  const nav =useNavigate()
  const [posts, setPosts]=useState([])
  const [loading, setLoading]=useState(true)

  useEffect(()=>{

    const fetchPost = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`)
        setPosts(response.data.slice(0,5))
      } catch (error) {
        console.error("게시글 로딩 실패",error)
      }finally{
        setLoading(false)
      }
    }
    fetchPost()

  },[])

  return (
    <section className="forum">
      <div className="inner">
        <header className="forum-header">
          <h4 >공지사항</h4>

          <Link
            to="/board"
            className="forum-more"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
            전체보기

            <span className="icon icon--arrow" />
          </Link>
        </header>

        <div className="forum-list">
          {posts.length === 0 ? (
            <p className="forum-empty">최근 게시물이 없습니다.</p>
          ) : (
            posts.map((post) => (
              <article key={post._id} 
               onClick={() => nav(`/post/${post._id}`)}
              className="forum-item">
                <div className="forum-meta">
                  <span>No. {post.number}</span>
                  <span>조회수: {post.views}</span>
                  {post.fileUrl.length > 0 && <span>파일: {post.fileUrl.length}</span>}
                </div>

                <h3 className="forum-item-title">{post.title}</h3>
                <time className="forum-date">{post.createdAt}</time>

                <span className="icon icon--arrow" />
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Forum;
