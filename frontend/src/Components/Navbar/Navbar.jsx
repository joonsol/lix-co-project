import React, { useState } from 'react'
import './Navbar.scss'
import { Link } from "react-router-dom"
import { HiMenu, HiX } from "react-icons/hi";
import { BrowserRouter } from 'react-router-dom';

const menuItems = [
  { path: "/", label: "홈" },
  { path: "/about", label: "회사 정보" },
  // { path: "/leadership", label: "임원 소개" },
  { path: "/board", label: "공지사항" },
  { path: "/service", label: "제공 기술" },
  { path: "/contact", label: "문의하기" }
];


const MenuItem = ({ path, label, onClick }) => (
  <li>
    <Link to={path} onClick={onClick}>
      {label}
    </Link>
  </li>
)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('ko')

  const toggleMenu = () => setIsOpen(!isOpen)
  return (
    <div className='navbar'>
      <div className="inner">
        <h1 className='navbar-logo'>
          <Link>Lix Co.</Link>
        </h1>
        <div className="navbar-menu">

          <ul className='navbar-menu-list'>
            {menuItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </ul>
          {/* <select
            onChange={(e) => setLanguage(e.target.value)}

            className='language-select' value={language}>
            <option value="ko">한국어</option>
            <option value="en">Englist</option>
          </select> */}
        </div>
        <button className='menu-toggle-button' onClick={toggleMenu}>
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          <button onClick={toggleMenu} className="close-button">
            <HiX />
          </button>
          <ul className="mobile-menu-list">
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                {...item}
                onClick={() => {
                  setIsOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))}
          </ul>
          {/* <select className='language-select'
            onChange={(e) => setLanguage(e.target.value)}
            value={language}>
            <option value="ko">한국어</option>
            <option value="en">Englist</option>
          </select> */}
        </div>
      </div>
    </div>
  )
}

export default Navbar