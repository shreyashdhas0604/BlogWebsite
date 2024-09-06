const {Router} = require('express');
const User = require('../models/user');

const router = Router();
router
.get('/signin',(req,res) => {
    res.render('signIn',{error : null});
})
.get('/signup',(req,res) => {
    res.render('signUp');
})
.post('/signup',async (req,res) => {
    const {fullname, email, password} = req.body;
    await User.create({fullname, email, password});
    return res.redirect('/');
})
.post('/signin',async (req,res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token).redirect('/');
    } catch (error1) {
        return res.render("signin", {
            error: error1.message,
          });
    }
})
.get('/logout',(req,res) => {
    res.clearCookie('token').redirect('/');
})

module.exports = router;