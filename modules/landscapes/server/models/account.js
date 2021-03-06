'use strict';

const crypto = require('crypto');
const secureRandom = require('secure-random')

const winston = require('winston');
const chalk = require('chalk')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _algorithm = 'aes-128-cbc';
const _keyLengthInBytes = 16;
const _ivLengthInBytes = 16;

var _writeAccountKeyFile = function(filePath) {
    return new Promise(function(resolve, reject) {
        try {
            var key = secureRandom.randomBuffer(_keyLengthInBytes);
            var iv = secureRandom.randomBuffer(_ivLengthInBytes);
            var data = `{ "key": "${key.toString('hex')}", "iv": "${iv.toString('hex')}", "createdAt": "${new Date().toISOString()}" }`;
            fs.writeFileSync(filePath, data);
            console.log(chalk.blue('+ Crypto: Generated account key file at', filePath.toString(), '\n'))
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

var getAccountKeyFile = function() {
    return new Promise(function(resolve, reject) {
        let filePath = path.resolve('./config/accountKeyFile.json');

        if (!fs.existsSync(filePath)) {
            console.log(chalk.blue('+ Crypto: Account key file not found.\n'))
            _writeAccountKeyFile(filePath)
                .then(() => {
                    fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
                        if (err) reject(err);
                        else resolve(JSON.parse(data));
                    });
                })
                .catch((err) => winston.log('error', err));
        } else {
            fs.readFile(filePath, {
                encoding: 'utf-8'
            }, (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            });
        }
    })
}

let _iv;
let _key;
getAccountKeyFile()
    .then((json) => { _key = new Buffer(json.key, "hex"); _iv = new Buffer(json.iv, "hex"); })
    .catch((err) => winston.log('error', err));

var encrypt = function(text) {
    console.log('## ENCRYPT SECRET ACCESS KEY ##')

    if (text === null || typeof text === 'undefined') return text;

    try {
        var cipher = crypto.createCipheriv(_algorithm, _key, _iv);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    } catch (err) {
        winston.log('error', 'account.encrypt: ' + err);
    }
};

var decrypt = function(encryptedText) {
    console.log('## DECRYPT SECRET ACCESS KEY ##')

    if (encryptedText === null || typeof encryptedText === 'undefined') return encryptedText;

    try {
        var decipher = crypto.createDecipheriv(_algorithm, _key, _iv)
        var decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch (err) {
        winston.log('error', 'account.decrypt: ' + err);
    }
};

var AccountSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    endpoint: {
        type: String
    },
    caBundlePath: {
        type: String
    },
    rejectUnauthorizedSsl: {
        type: Boolean
    },
    signatureBlock: {
        type: String
    },
    region: {
        type: String,
        required: true
    },
    isOtherRegion: {
        type: Boolean
    },
    accessKeyId: {
        type: String,
        required: true
    },
    secretAccessKey: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    }
});

AccountSchema.set('toObject', {
    getters: true
});

AccountSchema.set('toJSON', {
    getters: true
});

mongoose.model('Account', AccountSchema);