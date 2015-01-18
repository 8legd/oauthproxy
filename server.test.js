var request = require('supertest'); // https://github.com/visionmedia/supertest

describe('oauthproxy server', function() {

    var server;

    before(function (done) {
        // Add any setup routines here before calling done

        // Create an instance of our server
        server = require('./server.js').create();
        done();
    });


    describe('/Connect', function() {
        it('Should return a new client connection token', function(done) {
            var post_data = "";
            request(server)
                .post('/Connect')
                .type('form')
                .send({a: 'aa', b: 'bb'})
                .expect(200)
                .end(function(err,res) {
                    if (err) throw err;
                    var token = res.text;
                    describe('/RequestToken', function() {
                        // TODO decide on delimeters - like query string?
                        it('Should return a new client connection token and a request token', function(done) {
                            var post_data = "";
                            request(server)
                                .post('/RequestToken')
                                .type('form')
                                .send({token: token, b: 'bb'})
                                .expect(501, done); // TODO write this!
                        });
                    });




                  done();
                });
        });
    });



    describe('/AccessToken', function() {
        // TODO decide on delimeters - like query string?
        it('Should return a new client connection token and an access token', function(done) {
            var post_data = "";
            request(server)
                .post('/AccessToken')
                .send(post_data)
                .expect(501, done); // TODO write this!
        });
    });

});
