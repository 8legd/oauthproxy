var debug = require('debug')('oauthproxy:server');

var server = require('./server.js').create();
var port = process.env.PORT || 3000;

var service = server.listen(port, function() {
    debug('listening on port ' + port);
});