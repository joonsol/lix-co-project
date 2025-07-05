import React, { useEffect, useMemo, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Board.scss'
const Board = () => {

  const nav = useNavigate()
  const [posts, setPosts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")





  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`)
        // ✅ JSON 응답이 배열인지 철저히 체크
         console.log("✅ API 응답 데이터:", response.data); // 여기를 꼭 확인
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.warn("받은 데이터가 배열이 아님:", response.data);
          setPosts([]); // 비배열이면 강제로 빈 배열
        }
      } catch (error) {
        console.error("게시글 로딩 실패", error)
      }
    }
    fetchPosts()

  }, [])

  const filteredPosts = useMemo(() => {
     if (!Array.isArray(posts)) return [];

    return posts.filter((post) => {
     const value = post[searchType]?.toLowerCase() || "";
      const matchesSearch = value.includes(searchTerm.toLowerCase())

      const postDate = new Date(post.createdAt).getTime()
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;


      const matchsDate = (!start || postDate >= start) && (!end || postDate <= end)
      return matchesSearch && matchsDate
    })

  }, [posts, searchTerm, searchType, startDate, endDate])

  const totalPages = pageSize > 0 ? Math.ceil(filteredPosts.length / pageSize) : 1

  const pagenatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return filteredPosts.slice(start, start + pageSize)
  }, [filteredPosts, currentPage, pageSize])



  return (
    <section className='board-container top-section'>
      <div className="inner">
        <div className="t-wrap">
          <h3>공지사항</h3>
        </div>
        <div className="controls">
          <div className="filters">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">제목</option>

            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요" />
          </div>


        </div>
        <div className="date-filter-container">
          <div className="date-filter-group">
            <label className="date-label">작성일 시작</label>
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-filter-group">
            <label className="date-label">작성일 끝</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
        {/* 게시글 수 & 페이지당 게시글 수 */}
        <div className="count-wrap">
          <div className="total-count">총 게시글: {posts.length}건</div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            {[10, 25, 50, 100].map((size) => (

              <option key={size} value={size}>{`${size}개`}</option>
            ))}
          </select>
        </div>
        {/* 게시글 리스트 */}
        <ul className="post-list">
          <li className="post-header">
            <div className="col no">번호</div>
            <div className="col title">제목</div>
            <div className="col">작성일</div>
            <div className="col">조회수</div>
          </li>

          {pagenatedPosts.length === 0 ? (
            <div>
              게시글이 없습니다.
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <li
                onClick={() => nav(`/post/${post._id}`)}
                className="post-row"
                key={post._id} >
                <div className="col no">
                  {(currentPage - 1) * pageSize + index + 1}</div>
                <div className="col title">{post.title}</div>
                <div className="col">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  })}</div>
                <div className="col">{post.views}</div>
              </li>
            )))
          }
        </ul>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            value={startDate}
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1 || totalPages === 0}
          >이전</button>
          <span>{currentPage}/{totalPages}</span>
          <button
            value={endDate}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
          >다음
          </button>
        </div>
      </div>
    </section>
  )
}

export default Board