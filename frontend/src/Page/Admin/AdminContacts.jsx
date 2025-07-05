import React, { useEffect, useMemo, useState } from 'react'
import "./AdminContacts.scss"
import axios from "axios"
import Swal from "sweetalert2"
const AdminContacts = () => {

  const [contacts, setContacts] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("name")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact`, {
          withCredentials: true
        })
        setContacts(response.data)
      } catch (error) {
        console.log("문의글 가져오기 실패", error)
      }
    }
    fetchContacts()

  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case "대기중":
        return "status pending";
      case "진행중":
        return "status in-progress";
      case "완료":
        return "status completed";
      default:
        return "status";
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const value = contact[searchType].toLowerCase() || "";
      const matchesSearch = value.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus
    })


  }, [contacts, searchTerm, searchType, statusFilter])
  // const contacts = [
  //   {
  //     id: 1,
  //     name: "홍길동",
  //     email: "hong@example.com",
  //     phone: "010-1234-5678",
  //     message: "상품에 대한 문의입니다.",
  //     status: "대기중",
  //   },
  //   {
  //     id: 2,
  //     name: "이영희",
  //     email: "lee@example.com",
  //     phone: "010-8765-4321",
  //     message: "환불 요청합니다.",
  //     status: "진행중",
  //   },
  //   {
  //     id: 3,
  //     name: "박철수",
  //     email: "park@example.com",
  //     phone: "010-0000-1111",
  //     message: "연락이 지연되고 있습니다.",
  //     status: "완료",
  //   },
  // ];





  const totalPages = Math.ceil(filteredContacts.length / pageSize)
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize)
  }, [filteredContacts, currentPage, pageSize])

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contact/${contactId}`,
        { status: newStatus },
        { withCredentials: true }
      )

      setContacts(
        contacts.map((contact) =>
          contact._id === contactId ?
            { ...contact, status: newStatus } : contact
        )
      )
      setIsModalOpen(false)
      Swal.fire("수정완료", "상태가 성공적으로 수정되었습니다.", "success")

    } catch (error) {
      console.log("수정 실패:", error)
      Swal.fire("오류발생", "수정 중 문제가 발생했습니다.", "error")
    }
  }
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    })
    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/contact/${id}`, {
          withCredentials: true
        })
        setContacts(contacts.filter(contact => contact._id !== id))

        Swal.fire("삭제완료!", "문의가 성공적으로 삭제되었습니다.", "success")
      } catch (error) {
        console.log("수정 실패:", error)
        Swal.fire("오류발생", "수정 중 문제가 발생했습니다.", "error")

      }
    }
  }

  const showStatusChangeModal = async (contact) => {
    setSelectedContact(contact)

    const { value: newStatus, isConfirmed } = await Swal.fire({
      title: "문의 상태 수정",
      input: "radio",
      inputOptions: {
        pending: "대기중",
        "in progress": "진행중",
        completed: "완료",
      },
      inputValue: contact.status,
      confirmButtonText: "적용하기",
      cancelButtonText: "취소",
      showCancelButton: true,
    })
    if (isConfirmed && newStatus) {
      handleStatusUpdate(contact._id, newStatus)
    }
  }


  return (
    <div className="admin-contacts">
      <div className="inner">
        <h1>문의 관리</h1>
        <div className="controls">
          <div className="filters">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="name">이름</option>
              <option value="email">이메일</option>
              <option value="phone">전화번호</option>
              <option value="message">문의내용</option>
            </select>
            <input
              value={searchTerm}
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="pending">대기중</option>
              <option value="in progress">진행중</option>
              <option value="completed">완료</option>
            </select>

            {/* 총 개수 */}
          </div>
          <div className="pagenation-size">
            <label >페이지당 표시:</label>
            <select
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              value={pageSize}
            >
              {[10, 25, 50, 100].map((num, i) => (
                <option
                  key={i}
                >{`${num}개`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="total-count">총 {contacts.length}개의 문의</div>

        <ul className="contact-list">
          <li className="contact-header">
            <span className="col no">번호</span>
            <span className="col name">이름</span>
            <span className="col email">이메일</span>
            <span className="col phone">휴대폰</span>
            <span className="col message">문의 내용</span>
            <span className="col status">상태</span>
            <span className="col actions">관리</span>
          </li>
          {paginatedContacts.map((contact, index) => (
            <li key={index} className="contact-row">
              <span className="col no">{((currentPage - 1) * pageSize + index + 1)}</span>
              <span className="col name">{contact.name}</span>
              <span className="col email">{contact.email}</span>
              <span className="col phone">{contact.phone}</span>
              <span className="col message">{contact.message}</span>
              <span className={`col status ${contact.status.replace(" ", "-")}`}>
                {contact.status === "in progress" ? "진행중" :
                  contact.status === "pending" ? "대기중" : "완료"
                }
              </span>
              <span className="col actions">
                <button className="edit"
                  onClick={() => showStatusChangeModal(contact)}
                >수정</button>
                <button className="delete"
                  onClick={() => handleDelete(contact._id)}
                >삭제</button>
              </span>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >이전</button>
          <span>{currentPage} / {totalPages}</span>
          <button

            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            다음</button>
        </div>
      </div>
    </div>
  )
}

export default AdminContacts