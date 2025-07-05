import './App.scss'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import { useState } from 'react'
import { useEffect } from 'react'
import { Navigate, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import axios from 'axios'

import MainPage from './Page/MainPage/MainPage'
import Board from './Page/Board/Board'
import Leadership from './Page/Leadership/Leadership'
import Service from './Page/Service/Service'
import Contact from './Page/Contact/Contact'
import About from './Page/About/About'

import AdminLogin from './Page/Admin/AdminLogin'
import AdminNavbar from './Components/AdminNavbar/AdminNavbar'
import AdminContacts from './Page/Admin/AdminContacts'
import AdminCreatePost from './Page/Admin/AdminCreatePost'
import AdminEditPost from './Page/Admin/AdminEditPost'
import AdminPosts from './Page/Admin/AdminPosts'

import SinglePost from './Page/SinglePost/SinglePost'


function AuthRedirectRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
         `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
          {},
          { withCredentials: true }
        )
        setIsAuthenticated(true);
      } catch (error) {
        console.log("토큰 인증 실패: ", error)
        setIsAuthenticated(false)
      }
    }
    verifyToken()
  }, [])

  if (isAuthenticated == null) {
    return null;
  }
  return isAuthenticated ? <Navigate to="/admin/posts" replace /> : <Outlet />

}

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
          {},
          { withCredentials: true }
        )
        setIsAuthenticated(response.data.isValid);
        setUser(response.data.uer)
      } catch (error) {
        console.log("토큰 인증 실패: ", error)
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    verifyToken()
  }, [])

  if (isAuthenticated == null) {
    return null;
  }
  return isAuthenticated ?
    <Outlet context={{ user }} /> :
    <Navigate to="/admin" replace />

}


function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />

    </>
  )
}
function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/leadership',
        element: <Leadership />
      },
      {
        path: '/board',
        element: <Board />
      },
            {
        path: "/post/:id",
        element: <SinglePost />
      },
      {
        path: '/service',
        element: <Service />
      },
      {
        path: '/contact',
        element: <Contact />
      },
    ]
  },
  {
    path: "/admin",
    element: <AuthRedirectRoute />,
    children: [{
      index: true,
      element: <AdminLogin />
    }]
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: 'posts',
            element: <AdminPosts />
          },
          {
            path: 'create-posts',
            element: <AdminCreatePost />
          },
          {
            path: 'edit-post/:id',
            element: <AdminEditPost />
          },
          {
            path: 'contacts',
            element: <AdminContacts />
          },
        ]
      }
    ]
  }
])


function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
