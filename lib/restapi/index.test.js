var request = require('supertest'); // https://github.com/visionmedia/supertest

var restapi = require('./index.js');

describe('rest api', function() {

    var server;

    // TODO look at why this was hanging on error - always close server?

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
        it(' should return a valid response', function(done) {
            var post_data = "";
            request(server)
                .post('/ValidRequest')
                .send(post_data)
                .expect(200, done);
        });
    });

    describe('/InvalidRequest', function() {
        it(' should return an unsupported request', function(done) {
            var post_data = "";
            request(server)
                .post('/InvalidRequest')
                .send(post_data)
                .expect(501, done);
        });
    });

});