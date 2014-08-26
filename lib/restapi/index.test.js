var request = require('supertest'); // https://github.com/visionmedia/supertest

var restapi = require('./index.js');

describe('rest api', function() {

    var server;

    before(function(done) {
        // Add any setup routines here before calling done

        // Setup test routes
        var routes = function routes(req, res) {
            // Check we can handle this request
            if (req.method == "POST" && req.headers && req.connection.remoteAddress) {
                switch(req.url) {
                    case "/ValidRequest":
                        restapi.parseRequest(req,function(err,parsedRequest) {
                            if (err || !parsedRequest) {
                                restapi.unsupportedRequest(res);
                            } else {
                                restapi.sendTextResponse(":)", parsedRequest, res);
                            }
                        });
                        break;
                    case "/CreateFingerprint":
                        restapi.parseRequest(req,function(err,parsedRequest) {
                            if (err || !parsedRequest) {
                                restapi.unsupportedRequest(res);
                            } else {
                                restapi.sendJSONResponse(restapi.createFingerprint(parsedRequest), parsedRequest, res);
                            }
                        });
                        break;
                    case "/UpstreamError":
                        restapi.upstreamError(res);
                        break;
                    default:
                        restapi.unsupportedRequest(res);

                }
            } else {
                restapi.unsupportedRequest(res);
            }
        };

        // Setup test server
        server = restapi.createServer(routes);
        done();
    });

    describe('/ValidRequest', function() {
        it('should return a valid text response', function(done) {
            var post_data = "";
            request(server)
                .post('/ValidRequest')
                .send(post_data)
                .expect(200)
                .expect(":)", done);
        });
    });

    describe('/CreateFingerprint', function() {
        it('should return a valid JSON response containing the fingerprint', function(done) {
            var post_data = "";
            request(server)
                .post('/CreateFingerprint')
                .send(post_data)
                .expect(function(res) {
                    if (!res.body.user_agent) throw new Error("missing user_agent in response");
                    if (res.body.user_agent.substring(0,15) != 'node-superagent') throw new Error("invalid user_agent in response");
                })
                .end(function(err, res){
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('/UnsupportedRequest', function() {
        it('should return an unsupported request', function(done) {
            var post_data = "";
            request(server)
                .post('/UnsupportedRequest')
                .send(post_data)
                .expect(501, done);
        });
    });

    describe('/UpstreamError', function() {
        it('should return an upstream error', function(done) {
            var post_data = "";
            request(server)
                .post('/UpstreamError')
                .send(post_data)
                .expect(502, done);
        });
    });

});