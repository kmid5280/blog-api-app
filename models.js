const uuid = require('uuid');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}



const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  //created: {type: String, required: true}
})

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.author,
    content: this.content,
    title: this.title,
    //created: this.created
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema)

module.exports = {BlogPost}