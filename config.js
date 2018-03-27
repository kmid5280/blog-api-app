exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-api-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://myuser1:myuser1@ds123259.mlab.com:23259/blogging-app-test';
exports.PORT = process.env.PORT || 8080;