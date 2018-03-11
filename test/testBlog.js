const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);
describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    })
    it('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blogposts') //this might be incorrect
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
    it('should add an item on POST', function() {
        const newItem = {title: 'New Blog Post 1', content: 'This is content for Blog Post 1', author: 'Tom Jones', publishDate: 'March 10th'}
        return chai.request(app)
            .post('/blogPosts')
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
    it('should update blog entries on PUT', function() {
        const updateData = {
            title: 'Updated blog post 1',
            content: 'Some updated content for blog post 1'
        }
        return chai.request(app)
        .get('/blogPosts')
        .then(function(res) {
            updateData.id = res.body[0].id;
            return chai.request(app)
                .put(`/blogPosts/${updateData.id}`)
                .send(updateData)
        })
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updateData)
        })
    })
    it('should delete items on DELETE', function() {
        return chai.request(app)
            .get('/blogPosts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blogPosts/${res.body[0].id}`)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
    })
})
