module.exports = {
	createContext: createContext
};

var crypto = require('crypto');
var jwt = require('jwt-simple');

function createContext() {
    // Generate some keys
    var context = {
        _enc_key: createKey(),
        _hash_key: createKey()
    };
    // Expose `public` methods using these keys
    context.encryptObject = function(object) {
        self = this;
        return encryptObject(self._enc_key,object);
    };
    context.decryptObject = function(encrypted) {
        self = this;
        return decryptObject(self._enc_key,encrypted);
    };
    context.hashObject = function(object) {
        self = this;
        return hashObject(self._hash_key,object);
    };
    context.encodeJWT = function(object) {
        self = this;
        return jwt.encode(object, self._hash_key, 'HS256');
    };
    context.decodeJWT = function(token) {
        self = this;
        return jwt.decode(token, self._hash_key, 'HS256');
    };
    return context;
}

function createKey() {
	return crypto.randomBytes(2048).toString('base64');
}

function encryptObject(key,object) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var encrypted = [];
    encrypted.push(cipher.update(JSON.stringify(object), 'utf8', 'base64'));
    encrypted.push(cipher.final('base64'));
    return encrypted.join('$');
}

function decryptObject(key,encrypted) {
    var input = encrypted.split('$');
    var decrypted = [];
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    for (var i = 0;i < input.length;i++) {
        decrypted.push(decipher.update(input[i],'base64','utf8'));
    }
    decrypted.push(decipher.final('utf8'));
    return JSON.parse(decrypted.join(''));
}

function hashObject(key,object) {
    var hmac = crypto.createHmac('sha256', key);
    var hash = hmac.update(JSON.stringify(object));
    return hash.digest('base64');
}