var should = require('should'); // https://github.com/shouldjs/should.js

var security = require('./index.js');

describe('security', function() {

    // Test encryption routines
    it('should be able to encrypt > decrypt and get back original object', function() {
	    // Generate a key
	    var key = security.createKey();
		// Create an object
		o = {hello: 'world'};
		// encrypt > decrypt
		e = security.encryptObject(key,o);
		d = security.decryptObject(key,e);
		// Test it! (eql compares object contents)
		d.should.eql(o);
    });
	
});


