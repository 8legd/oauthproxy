var should = require('should'); // https://github.com/shouldjs/should.js

var security = require('./index.js');

describe('security', function() {

    var security_context;

    // Test setup routines
    it('should be able to create a security context (create some keys)', function() {
        security_context = security.createContext();
        security_context.should.be.ok;
    });

    // Test encryption routines
    it('should be able to encrypt > decrypt and get back original object', function() {
		// Create an object
		o = {hello: 'world'};
		// encrypt > decrypt
		e = security_context.encryptObject(o);
		d = security_context.decryptObject(e);
		// Test it! (eql compares object contents)
		d.should.eql(o);
    });

    // Test hashing routine
    it('should be able to hash two objects with the same contents and get the same results', function() {
        // Create objects
        o1 = {hello: 'world'};
        o2 = {hello: 'world'};
        // Test it! (eql compares object contents)
        security_context.hashObject(o1).should.eql(security_context.hashObject(o2));
    });

    // Test JWT routines
    it('should be able to encode > decode (JWT) and get back original object', function() {
        // Create an object
        o = {hello: 'world'};
        // encode > decode
        e = security_context.encodeJWT(o);
        d = security_context.decodeJWT(e);
        // Test it! (eql compares object contents)
        d.should.eql(o);
    });
	
});


