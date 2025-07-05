import React, { useState } from 'react';
import './Contact.scss';
import axios from "axios"
import { contactInfoList, contactMapUrl } from '../../Util/contact'; // 경로는 위치에 따라 조정

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "in progress"
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData
      )

      if (response.status === 201) {
        alert("문의가 성공적 접수")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          status: "in progress"
        })
      }


    } catch (error) {
      console.log("에러발생:", error)
      alert("문의 접수중 오류 발생, 잠시후 다시 시도해라.")
    }
  }
  return (
    <section className="contact top-section">
      <div className="inner">
        <div className="contact-header">
          <h3>문의하기</h3>
          <p>
            태양광 설비 설치부터 유지보수까지, 전문가와 상담하세요.
            24시간 내에 답변드리겠습니다.
          </p>
        </div>

        <div className="contact-body">
          {/* 문의 폼 */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동" required />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com" required />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input
                  value={formData.phone}
                  name='phone'
                  onChange={handleChange}
                  type="tel"
                  placeholder="010-1234-5678" required />
              </div>
              <div className="form-group">
                <label>문의 내용</label>
                <textarea
                  value={formData.message}
                  onChange={handleChange}
                  name='message'
                  placeholder="문의하실 내용을 자세히 적어주세요." required />
              </div>
              <button type="submit">문의하기</button>
            </form>
          </div>

          {/* 연락처 및 지도 */}
          <div className="contact-info">
            <div className="contact-card">
              <h4>연락처 정보</h4>
              {contactInfoList.map((item, index) => (
                <div className="contact-item" key={index}>
                  <div className="icon">
                    <i className="material-icons">{item.icon}</i>
                  </div>
                  <div className="details">
                    <h5>{item.title}</h5>
                    <p>{item.info}</p>
                    <small>{item.desc}</small>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>
        <div className="inner">
          <div className="contact-map">
            <iframe
              title="Company Location"
              src={contactMapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
