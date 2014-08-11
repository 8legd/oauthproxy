var http = require('http');
var formidable = require('formidable');

// Setup our server and routes
http.createServer(function (req, res) {

    // Check we can handle this request
    if (req.method == "POST" && req.headers && req.connection.remoteAddress) {
        switch(req.url) {	
        	case "/Echo":
            	handleEcho(req, res);
            	break;
        	default:
            	unsupportedRequest(res);
		}				
    } else {
        unsupportedRequest(res);
    }
	
}).listen(process.env.PORT || 3000);

function handleEcho(req,res) {
	var parsedRequest = parseRequest(req,function(parsedRequest) {
        sendJSONResponse(parsedRequest,parsedRequest,res);
    });
}

function parseRequest(req,callback) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields) {
	    if (err) {
	        unsupportedRequest(res);
	    } else {
            var parsedRequest = {
                remote_address: req.connection.remoteAddress,
                host: req.headers['host'],
                origin: req.headers['origin'],
                x_forwarded_for: req.headers["X-Forwarded-For"],
                user_agent: req.headers["user-agent"],
                form: {
                    fields: fields
                }
            }
			callback(parsedRequest);
		}
	});
}

function createFingerprint(parsedRequest) {
    return "HASH parsedRequest fields except form";

}

function sendJSONResponse(responseObject,parsedRequest,res) {
    // if we have an origin add CORS headers
    if (parsedRequest.origin) {
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


		