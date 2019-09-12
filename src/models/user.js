const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    mobileNum: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 9) {
                throw new Error('invalid mobileNumber ')
            }
        }
    },
    token :[{
        token : {
            type : String,
            require : true
        }
        
    }]
})

userSchema.methods.generateAuthToken = async()=>{
    const user = this
    const token = jwt.sign({_id : user._id.toString()},"theFirst",{expiresIn : '7days'})
    
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const isEmailMatch = await bcrypt.compare(email, user.email)
    console.log(isEmailMatch)
    if (!isEmailMatch) {
        throw new Error('Uable to login')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('unable to login')
    }
    return user
}
//hash the plain text
userSchema.pre('save',async function (next) {
    const user = this
    if (user.isModified('email')) {
        user.email = await bcrypt.hash(user.email, 8)
    }
    if (user.isModified('password')) {
        user.password =await bcrypt.hash(user.password, 8)
    } else {
        console.log(new Error)
    }
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User