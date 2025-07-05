const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")
const axios = require("axios")
const jwt = require("jsonwebtoken")


router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 사용자입니다." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "회원가입 완료!" })
  } catch (error) {
    res.status(500).json({ message: "서버 오류!" })
    console.log(error)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password")

    if (!user) {
      return res.status(401).json({ message: "사용자 없음" })

    }
    if (!user.isActive) {
      return res.status(401).json({ message: "비활성 계정임" })
    }
    if (user.isLoggedIn) {
      return res.status(401).json({ message: "이미 다른 기기에서 접속" })

    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      user.lastLoginAttempt = new Date()

      if (user.failedLoginAttempts >= 5) {
        user.isActive = false;
        await user.save()
        return res.status(401).json({ message: `비밀번호 ${user.failedLoginAttempts} 회 틀림 / 비밀번호 5회이상 틀리면 로그인 제한` })
      }
    }

    user.failedLoginAttempts = 0;
    user.lastLoginAttempt = new Date()
    user.isLoggedIn = true

    try {
      const response = await axios.get("https://api.ipify.org?format=json")
      const ipAddress = response.data.ip
      user.ipAddress = ipAddress;

    } catch (ipError) {
      console.error("IP주소 가져오는 중 오류 발생: ", ipError.message)
    }
    await user.save()


    const token = jwt.sign({ userId: user._id, username: username },

      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
    console.log(token)

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,             // ✅ 배포 환경이면 true
      sameSite: 'none',         // ✅ 반드시 'None'
      maxAge: 24 * 60 * 60 * 1000
    })


    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    res.json({ user: userWithoutPassword })


  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." })

    console.log(error)
  }
})

router.post("/logout", async (req, res) => {
  try {

    const token = req.cookies.token;
    if (!token) {
      res.status(400).json({ message: "이미 로그아웃" })
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)

      if (user) {
        user.isLoggedIn = false;
        await user.save()
      }
    } catch (error) {
      console.log("토큰 검증 오류", error)
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    })

    res.json({ message: "로그아웃되었습니다." })



  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." })

    console.log(error)
  }
})

router.delete("/delete/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." })
    }
    res.json({ message: "사용자가 성공적으로 삭제되었습니다." })
  } catch (error) {
    res.status(500).json({ message: "서버 오류발생", error })

  }
})


router.post("/verify-token", (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(400).json({
      isValid: false,
      message: "토큰이 없습니다."
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({
      isValid: true,
      user: decoded
    })
  } catch (error) {
    return res.status(401).
      json({

        isValid: false,
        message: "유효하지 않은 토큰입니다."
      })
  }
})


module.exports = router