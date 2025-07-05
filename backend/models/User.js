const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        failedLoginAttempts: {
            type: Number,
            default: 0
        },
        lastLoginAttempt: {
            type: Date,
        },
        ipAddress: {
            type: String,
            trim: true
        },
    },
    {
        timestamps:true
    }
)

const User =mongoose.model("User",userSchema)

module.exports=User