const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./blogPostsRouter');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models')

app.use(morgan('common'));

app.use(express.static('public'))
app.use('/blog-posts', blogPostsRouter)

let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  //created: {type: String, required: true}
})

app.get('/blog-posts', (req, res) => {
  BlogPost
    .find()
    .then(blogposts => {
      res.json({
        blogposts: blogposts.map(
          (postItem) => postItem.serialize())
      })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'internal server error'});
      }
    )
})

app.get('/blog-posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(blogposts => res.json(blogposts.serialize()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

app.post('/blogposts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'/*: {'firstname', 'lastname'}*/ ];
  for (let i=0; i<requiredFields.length; i++) {
    
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
      author: req.body.author //how to specify required first and last name??
    })
    .then(
      blogposts => res.status(201).json(blogposts.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'internal server error'})
    })
})

app.put('/blogposts/:id', (req, res) => {
  /*if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({message: message});
    }*/

    const toUpdate = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    })

    BlogPost
      .findByIdAndUpdate(req.params.id, {$set: toUpdate})
      .then(blogposts => res.status(204).end())
      .catch(err => res.status(500).json({message: 'internal server error'}))
    
  }
})

app.delete('/blog-posts/:id', (req, res) => {
  BlogPost
  .findByIdAndRemove(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => res.status(500).json({message: 'internal server error'}))
})