const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = (process.env.SECRET_KEY || 'default_secret_key').padEnd(32, '0');
const key = crypto.scryptSync(secretKey, 'salt', 32);


const encrypt = (text) => {
    if (!text) {
        throw new Error('No text provided for encryption');
    }

    const iv = crypto.randomBytes(16);  // Generate a random initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    // The 'update' and 'final' methods automatically handle padding
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
};


const decrypt = (encryptedData) => {
    try {
        if (!encryptedData || typeof encryptedData !== 'string') {
            throw new Error('Invalid input type for decryption');
        }

        const parts = encryptedData.split(':');
        if (parts.length !== 2 || parts[0].length !== 32) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = Buffer.from(parts[1], 'hex');
        if (encryptedText.length === 0 || encryptedText.length % 16 !== 0) {
            throw new Error('Encrypted data length is not a multiple of block size: ' + encryptedText.length);
        }

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        return null;
    }
};



module.exports = { encrypt, decrypt };
