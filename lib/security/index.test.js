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

    // Test hashing routine
    it('should be able to hash two objects with the same contents and get the same results', function() {
        // Generate a key
        var key = security.createKey();
        // Create objects
        o1 = {hello: 'world'};
        o2 = {hello: 'world'};
        // Test it! (eql compares object contents)
        security.hashObject(key,o1).should.eql(security.hashObject(key,o2));
    });
	
});


