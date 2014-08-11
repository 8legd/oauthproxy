module.exports = {
	createKey: createKey,
	encryptObject: encryptObject,
	decryptObject: decryptObject,
    hashObject: hashObject
};

var crypto = require('crypto');

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


