const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
function createTokenForUser(user){

    const payload = {
        id : user._id,
        email : user.email,
        profileImage : user.profileImage,
        role : user.role,
        name : user.fullname.split(' ')[0]
    }
    const token = jwt.sign(payload,secret);
    return token;
}

function verifyToken(token){
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports = {createTokenForUser,verifyToken}