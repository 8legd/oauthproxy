module.exports = {
    createServer: createServer,
    parseRequest: parseRequest,
    createFingerprint: createFingerprint,
    sendTextResponse: sendTextResponse,
    sendJSONResponse: sendJSONResponse,
    unsupportedRequest: unsupportedRequest,
    upstreamError: upstreamError
};

createServer = function(commands) {
    var command = {
        returns: "text", // or 'json"
        name: "Connect",
        exec: function(parsedRequest,callback) { // callback(err,result)

        }

    }


    var result = new Server(commands);
    return result;
}

function Server(routes) {
    var self = this;
    self._http_server = require('http').createServer(routes);
    self._security_context = require('../security/index').createContext();
}

Context.prototype.toString = function () {
    var self = this;
    return self.key;
};

var http = require('http');
var formidable = require('formidable');

function createServer(routes) {
    return {
        security_context: require('../security/index').createContext(),
        http_server: http.createServer(routes)
    };
}

function parseRequest(req,callback) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (err) {
            callback(err,parsedRequest);
        } else {
            var parsedRequest = {
                remote_address: req.connection.remoteAddress,
                host: req.headers ? req.headers['host'] : '',
                origin: req.headers ? req.headers['origin'] : '',
                x_forwarded_for: req.headers ? req.headers["X-Forwarded-For"] : '',
                user_agent: req.headers ? req.headers["user-agent"] : '',
                form: {
                    fields: fields
                }
            };
            if (fields.token) {

            }
            callback(null,parsedRequest);
        }
    });
}

function createFingerprint(parsedRequest) {
    // return some client info / weak fingerprint
    return {
        remote_address: parsedRequest.remote_address,
        host: parsedRequest.host,
        origin: parsedRequest.origin,
        x_forwarded_for: parsedRequest.x_forwarded_for,
        user_agent: parsedRequest.user_agent
    };
}

function sendTextResponse(responseText,parsedRequest,res) {
    // if we have an origin add CORS headers
    if (parsedRequest && parsedRequest.origin) {
        res.setHeader("Access-Control-Allow-Origin", parsedRequest.origin);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end(responseText);
}

function sendJSONResponse(responseObject,parsedRequest,res) {
    // if we have an origin add CORS headers
    // NOTE: Non `text/plain` can cause problems with CORS in some browser e.g. in ie8
    if (parsedRequest && parsedRequest.origin) {
        res.setHeader("Access-Control-Allow-Origin", parsedRequest.origin);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    }
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(responseObject));
}

function unsupportedRequest(res) {
    res.statusCode = 501; // Unsupported request
    res.end();
}

function upstreamError(res) {
    res.statusCode = 502; // Upstream error
    res.end();
}