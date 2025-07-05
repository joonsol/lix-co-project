import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./AdminLogin.scss"
import axios from "axios"
const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData, {
        withCredentials: true
      })
      if (response.data.user) {
        navigate("/admin/posts")
      }

    } catch (error) {

      const errorMessage=
      error.response.data.message || "로그인에 실패했습니다."
      const remaingAttempts=error.response.data.remaingAttempts

      setError({
        message:errorMessage,
        remaingAttempts:remaingAttempts
      })

    }
  }
  return (
    <section className="admin-login">
      <div className="login-box">

        <div className="login-header">
          <h3>관리자 로그인</h3>
          <p>관리자 전용 페이지입니다.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-field">
              <label htmlFor="username">관리자 아이디</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="관리자 아이디"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">관리자 비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="관리자 비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          {error && (
            <div className='error-box'>
              {typeof error === "string" ? error : error.message}
              {error.remaingAttempts != undefined && (
                <div className='retry-count'>
                  남은 시도 횟수:{error.remaingAttempts}회
                </div>
              )}
            </div>
          )}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </section>
  )
}

export default AdminLogin