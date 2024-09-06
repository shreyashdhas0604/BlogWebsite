const {Router} = require('express');
const multer = require('multer')
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comments');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const Filename = `${Date.now()}-${file.originalname}`
      cb(null, Filename)
    }
  })
  
  const upload = multer({ storage: storage })


  
  
  router.get('/add-new',(req,res) => { 
      return res.render('AddBlog',{
          user : req.user
        })
    })
    
    router.get("/:id", async (req, res) => {
        try {

        const blog = await Blog.findById(req.params.id);
        await blog.populate("author"); 
        const comments = await Comment.find({ blogId: req.params.id }).populate(
            "author"
        );
      
        return res.render("blog", {
          user: req.user,
          blog,
          comments,
        });
        } catch (error) {
          console.log("Error in /blog/:id : ", error);
        }
      });
    
 
    router.post('/add-new',upload.single('coverImage'),async (req,res) => {
        const {title,body} = req.body;
        const blog = await Blog.create({
            title,
            body,
            coverImageUrl : `/uploads/${req.file.filename}`,
            author : req.user.id 
        })
        await blog.save();
        return res.redirect(`/blog/${blog._id}`);
    })
    
router.post('/comment/:blogid',async (req,res) => {
    const {blogID} = req.params.blogid;
    const comment = await Comment.create({
        body : req.body.content,
        author : req.user.id,
        blogId : req.params.blogid
    })
    return res.redirect(`/blog/${req.params.blogid}`);
})

router.get('/delete/:id',async (req,res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    return res.redirect('/');
})


    module.exports = router;