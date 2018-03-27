const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPost} = require('./models');

//BlogPost.create('this is a title', 'this is some blog content', 'bob jones', 'Mar. 6')

router.get('/', (req, res) => {
  console.log('step 1')  
  BlogPost
      .find().exec()
      .then(post => {
        console.log('step 2')
        res.json(post)
      })
      .catch(err => {
        console.error(err)
        res.status(500).json({message: "server error"})
      })
})

router.post('/', jsonParser, (req,res) => {
    console.log(req.body)
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    BlogPost
      .create({
        title: req.body.title, 
        content: req.body.content, 
        author: req.body.author,
        publishDate: req.body.publishDate || Date.now()
      })
      .then(post => res.status(201).json(post.serialize()))
      .catch(err => {
        console.error(err)
        res.status(500).json({message: 'server error'})
      })
    
})

router.delete('/:id', (req,res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({message: "success"})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "delete error"})
    })    
  
})

router.put('/:id', jsonParser, (req,res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    })
  }
  
  const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  })
  
  BlogPost
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true})
    .then(updatedPost => res.status(200).json(updatedPost))
    .catch(err => res.status(500).json({message: "update error"}))
  
})

module.exports = router;