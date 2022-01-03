const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Define application
const app = express()

// connecting databse schema
const db = mongoose.connect('mongodb://localhost:27017/blog-api')

// importing the model
const Blog = require('./src/models/blogModels')

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// CRUD operations on Blogs

// list of blogs
app.get("/", async(req, res) =>{
    try{
        const blogs = await Blog.find()
        if(blogs == null){
        res.send("No blogs found... Write your first blog")
        }
        else {
            res.status(200).json(blogs)
        }
    } catch (err){
        res.send("Error" + err);
    }
});

// to get 1 particular blog
app.get("/:id", async(req, res) =>{
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog == null){
            res.send("No blog found... pls try agian")
        }
        else {
            res.status(200).json(blog)
        }
    } catch (err){
        res.send("Error" + err);
    }
});

//Add blogs
app.post("/", async(req, res) => {
    const blog = new Blog()
    blog.title = req.body.title,
    blog.author = req.body.author,
    blog.content = req.body.content

    try{
        const addBlog = await blog.save()
        res.json(addBlog)
    } catch(err) {
        res.send("Error " + err)
    }
})

// update blog
app.patch('/:id', async(req, res) => {
    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id)
        if(req.body.title != null) {
            blog.title = req.body.title
        }
        if(req.body.content != null) {
            blog.content = req.body.content
        }
        else{
            res.send("Invalid update field")
        }
        const updatedBlog = await blog.save();
        res.json(updatedBlog)
    } catch (err){

    }
})

// delete blog
app.delete('/:id', function(req, res) {
    Blog.findByIdAndDelete(req.params.id, req.body, function(error, blog) {
        if(error) {
            return res.status(500).send({ error: "Problem with updating."})
        }
        res.send(blog);
    });
});


// adding a listener to start api server
app.listen(3600, function(){
    console.log("Api Server Started at port 3600...")
});