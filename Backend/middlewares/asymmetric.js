const crypto = require('crypto');

// Generate RSA key pair
function generateKeyPair() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048, // Standard for strong security
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc', // Cipher for private key encryption
                passphrase: 'your-secure-passphrase' // Choose a strong passphrase
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                reject(err);
            } else {
                resolve({ publicKey, privateKey });
            }
        });
    });
}

// Encrypt data using a public key
function encryptData(data, publicKey) {
    try {
        const buffer = Buffer.from(data, 'utf-8');
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            buffer
        );
        return encrypted.toString('base64');
    } catch (error) {
        throw new Error('Error encrypting data: ' + error.message);
    }
}

// Decrypt data using a private key
function decryptData(encryptedData, privateKey) {
    if (!encryptedData || !privateKey) {
        throw new Error('Encrypted data and private key are required for decryption');
    }

    try {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            buffer
        );
        return decrypted.toString('utf-8');
    } catch (error) {
        // Handle decryption failures gracefully
        console.error('Error decrypting data:', error);
        return null; // or throw an error based on your application's requirements
    }
}



module.exports = {
    generateKeyPair,
    encryptData,
    decryptData
};
