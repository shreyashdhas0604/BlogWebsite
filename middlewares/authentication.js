const { verifyToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next) => {
        const cookieValue = req.cookies[cookieName];
        if(!cookieValue){
            return next()
        }

        try {
            const userPayload = verifyToken(cookieValue);
            req.user = userPayload;
        } catch (error) {
            
        }
        return next();
    }
}

module.exports = {checkForAuthenticationCookie}