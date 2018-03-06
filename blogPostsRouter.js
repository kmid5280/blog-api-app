const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

BlogPosts.create('this is a title', 'this is some blog content', 'bob jones', 'Mar. 6')

router.get('/', (req, res) => {
    res.send(BlogPosts.get())
})

router.post('/', jsonParser, (req,res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    let storeBlogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
    res.status(201).json(storeBlogPost)
})

router.delete('/:id', (req,res) => {
    BlogPosts.delete(req.params.id);
    res.status(204).end();
})

router.put('/:id', jsonParser, (req,res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate    
})
})

module.exports = router;