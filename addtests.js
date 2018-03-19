'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require ('../server');
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
    const authors = ['Bob Smith', 'Jane Doe', 'Tom Jones'];
    return authors[Math.floor(Math.random() * authors.length)];
}

function generateContent() {
    const contentTypes = ['this is some content', 'this is interesting content', 'here is a unique blog entry'];
    return contentTypes = [Math.floor(Math.random() * contentTypes.length)]
}

function generateBlogData() {
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
    before(function() {
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
})

describe('GET endpoint', function() {
    it('should return all blog posts', function() {
        let res;
        return chai.request(app)
            .get('/blog-posts')
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.blogposts).to.have.length.of.at.least(1);
                return BlogPost.count();
            })
            .then(function(count) {
                expect(res.body.blogposts).to.have.length.of(count);
            })
    })

    //add code here
})