const mongoose = require('mongoose');
const {createHmac, randomBytes, randomInt} = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    salt : {
        type : String,
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    profileImage : {
        type : String,
        default : '/images/defaultImage.png'
    }


}, {timestamps : true});

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = randomBytes(16).toString();

    const hashPassword = createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashPassword;

    next();

})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('Email is incorrect');
    const salt = user.salt;
    const hashPassword = createHmac('sha256',salt).update(password).digest('hex');
    
    if(hashPassword !== user.password) throw new Error('Password is incorrect');
    const token = createTokenForUser(user);
    return token;
});



const User = mongoose.model('User', userSchema);

module.exports = User;