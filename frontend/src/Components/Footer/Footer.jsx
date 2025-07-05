import React, { useEffect, useState } from 'react'
import "./Footer.scss"
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";


const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const [language, setLanguage] = useState(localStorage.getItem("language") || "ko")



  return (
    <footer className='footer'>
      <div className="inner">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">회사소개</h3>
            <p>
              저희 회사는 최고의 서비스를 제공하기 위해 노력하고 있습니다.
            </p>
          </div>
          <div>
            <h3 className="footer-title">빠른 링크</h3>
            <ul className="footer-list">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                >
                  회사 정보
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/leadership"
                  onClick={scrollToTop}
                >
                  임원 소개
                </Link>
              </li> */}
              <li>
                <Link
                  to="/board"
                  onClick={scrollToTop}
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  to="/our-services"
                  onClick={scrollToTop}

                >
                  제공 기술
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={scrollToTop}
                >
                  문의
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">연락처</h3>
            <ul className="footer-list">
              <li>서울특별시 강남구</li>
              <li>삼성동 123번지</li>
              <li>전화: 02-1234-5678</li>
              <li>이메일: info@example.com</li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title">소셜 미디어</h3>
            <div className='footer-socials'>
              <a href="#"  >
                <FaFacebook />
              </a>
              <a href="#" >
                <FaTwitter />
              </a>
              <a href="#" >
                <FaInstagram />
              </a>
              <a href="#">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        </div>
          <div className="inner">

          <p>&copy; 2024 ABC Company. All rights reserved.</p>
          </div>
    </footer>
  )
}

export default Footer