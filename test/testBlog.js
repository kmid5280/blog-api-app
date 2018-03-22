const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);
describe('Blog Posts', function() {
    /*before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    })*/
    xit('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
                })
            })
    })
    xit('should add an item on POST', function() {
        const newItem = {title: 'New Blog Post 1', content: 'This is content for Blog Post 1', author: 'Tom Jones', publishDate: 'March 10th'}
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function(res) {
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
                expect(res.body.id).to.not.equal(null)
                //is this needed?
                //expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
            })
    })
    xit('should update blog entries on PUT', function() {
        const updateData = {
            title: 'Updated blog post 1',
            content: 'Some updated content for blog post 1'
        }
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            updateData.id = res.body[0].id;
            updateData.author = res.body[0].author;
            updateData.publishDate = res.body[0].publishDate;
            return chai.request(app)
                .put(`/blog-posts/${updateData.id}`)
                .send(updateData)
        })
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updateData)
        })
    })
    xit('should delete items on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
    })
})
