'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding blog post data');
    const seedData = [];

    seedData.push(generateBlogPostData());
    return BlogPost.insertMany(seedData);
}

function generateTitle() {
    const title = ['title 1', 'title 2', 'title 3'];
    return title[Math.floor(Math.random() * title.length)];
}

function generateAuthor() {
    const author = ['Bob Smith', 'Jane Doe', 'Tom Jones'];
    return author[Math.floor(Math.random() * authors.length)];
}

function generateContent() {
    const contentTypes = ['this is some content', 'this is interesting content', 'here is a unique blog entry'];
    return contentTypes[Math.floor(Math.random() * contentTypes.length)]
}

function generateBlogPostData() {
    return {
        title: generateTitle(),
        content: generateContent(),
        author: generateAuthor(),
    }
}

function tearDownDb() {
    console.warn('deleting database');
    return mongoose.connection.dropDatabase();
}

describe ('Blog Posts API resource', function() {
    
})

describe('Blog post module', function() {
    before(function() {
        console.log(TEST_DATABASE_URL)
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedBlogPostData();
    })

    afterEach(function() {
        return tearDownDb();
    })

    after(function() {
        return closeServer();
    })
    it('should return all blog posts', function() {
        let res;
        return chai.request(app)
            .get('/blog-posts')
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return BlogPost.count();
            })
            .then(function(count) {
                expect(res.body).to.have.lengthOf(count);
            })
            
    })

    it('should return blog posts with right fields', function() {

        let resBlogPost;
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                res.body.forEach(function(post) {
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'title', 'content', 'author');
                })
                resBlogPost = res.body[0];
                return BlogPost.findById(resBlogPost._id);
            })
            .then(function(post) {
                console.log(resBlogPost._id, post.id)
                expect(resBlogPost._id).to.equal(post.id);
                expect(resBlogPost.title).to.equal(post.title);
                expect(resBlogPost.content).to.equal(post.content);
                expect(resBlogPost.author).to.equal(post.author);
            })
    })
    
    it('should add a new blog post', function() {
        const newBlogPost = generateBlogPostData();
        
        return chai.request(app)
            .post('/blog-posts')
            .send(newBlogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'title', 'content', 'author');
                expect(res.body.title).to.equal(newBlogPost.title);
                expect(res.body.content).to.equal(newBlogPost.content)
                expect(res.body.author).to.equal(newBlogPost.author)
                return BlogPost.findById(res.body.id)
            })
            .then(function(post) {
                expect(post.title).to.equal(newBlogPost.title);
                expect(post.content).to.equal(newBlogPost.content);
                expect(post.author).to.equal(newBlogPost.author)
            })
    })
    it('should update fields you send over', function() {
        const updateData = {
            title: 'new updated title',
            content: 'newly updated content'
        }

        return BlogPost
            .findOne()
            .then(function(post) {
                updateData.id = post.id;
                return chai.request(app)
                    .put(`/blog-posts/${post.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                return BlogPost.findById(updateData.id)
            })
            .then(function(post) {
                expect(post.title).to.equal(updateData.title);
                expect(post.content).to.equal(updateData.content);
                expect(post.author).to.equal(post.author)
            })
    })
    it('should delete a post by id', function() {
        let post;
        return BlogPost
    })
})

describe('POST endpoint', function () {
    
})

describe('PUT endpoint', function() {
    
})

describe('DELETE endpoint', function() {
    
})