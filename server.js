var restapi = require('./lib/restapi/index');

module.exports = {
    create: create
};

function create() {


    // Setup global security context for our server
    var context = {
        security: require('./lib/security/index').createContext()
    }

    // Setup routes
    var routes = function routes(req, res) {
        // Check we can handle this request
        if (req.method == "POST" && req.headers && req.connection.remoteAddress) {
            switch(req.url) {
                case "/Connect":
                    restapi.parseRequest(req,function(err,parsedRequest) {
                        if (err || !parsedRequest) {
                            restapi.unsupportedRequest(res);
                        } else {
                            try {
                                // Create token
                                var t = {
                                    connection: {
                                        initial_request: parsedRequest,
                                        initial_fingerprint: restapi.createFingerprint(parsedRequest)
                                    }
                                };
                                // Encrypt it
                                var e = context.security.encryptObject(t);
                                // Return as a JWT
                                restapi.sendTextResponse(context.security.encodeJWT({ t: e}), parsedRequest, res);
                            } catch(e) {
                                // TODO debug exception
                                restapi.upstreamError(res);
                            }
                        }
                    });
                    break;
                case "/RequestToken":
                    restapi.parseRequest(req,function(err,parsedRequest) {
                        if (err || !parsedRequest) {
                            restapi.unsupportedRequest(res);
                        } else {
                            try {
                                // Check token
                                var e = parsedRequest.form.fields.token;
                                context.security.decodeJWT(e, function(err, result ) {
                                    if (err) throw err;
                                    console.log(result);
                                });
                                console.log(t);
                                // Encrypt it
                                var e = context.security.encryptObject(t);
                                // Return as a JWT
                                restapi.sendTextResponse(context.security.encodeJWT({ t: e}), parsedRequest, res);
                            } catch(e) {
                                // TODO debug exception
                                restapi.upstreamError(res);
                            }
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

    // return our rest api server for these routes
    return restapi.createServer(routes);

}
