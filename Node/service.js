const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const cors = require('cors');
const os = require('os');
const express = require('express');

 
const documentStore = new Map();

// Function to generate a session key
function generateSessionKey() {
  const key = crypto.randomBytes(32);
  return key;
}

// Encrypt data with RSA public key
function encryptWithCertificate(data, publicKeyPath) {
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");
  const bufferData = Buffer.from(data, "utf8");
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    bufferData,
  );
  return encrypted.toString("base64");
}

// Encrypt data with Session key
function encryptJsonDataAES(toEncrypt, key) {
  const cipher = crypto.createCipheriv("aes-256-ecb", key, Buffer.alloc(0));
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(toEncrypt, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Function to generate SHA256 hash of data
function generateSHA256Hash(message) {
  const hash = crypto.createHash("sha256");
  hash.update(message);
  return hash.digest();
}

// AES decryption
function decryptDataAES(text, key) {
  let bytePlainText = null;
    try {
        const dec_Key_original = Buffer.from(key);
        const aesCipher = crypto.createDecipheriv('aes-256-ecb', dec_Key_original, '');
        bytePlainText = Buffer.concat([aesCipher.update(text), aesCipher.final()]);
    } catch (e) {
        console.error(e);
    }
    return Buffer.from(bytePlainText);
}

const sessionKey = generateSessionKey();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is online');
});

const publicKeyPath = "D:\OneDrive - eMudhra Limited\Documents\Documents\EmSigner Gateway Documents\React-Node SDK 2\ReactDemo\Node\certificate 5 (1).cer";

// GET /emSignerParameters endpoint
app.get('/emSignerParameters', (req, res) => {
  const { v4: uuidv4 } = require("uuid");
    const uuid = uuidv4();
    const incomingData = {
      Name: "sathish",
      FileType: "Hash", 
      SignatureType: 0,
      SelectPage: "ALL",
      SignaturePosition: "Top-Left",
      AuthToken: " ",
      Documentdetails:"[{'DocumentName':'Name1','DocumentURL':'http://localhost:52322/eMsecure/SignerGateway/eSignResponse','DocumentHash':'0294893be9062fa82b8db82d4b551eb2c308111b5fe3b5454aa3a9bc324ecfcf'}]",

       Noofpages: 0,
      PreviewRequired: true,
      SUrl: "http://localhost:3000/emSignerResponse",
      FUrl: "http://localhost:3000/emSignerResponse",
      CUrl: "http://localhost:3000/emSignerResponse",
      ReferenceNumber: "" + uuid + "",
      Enableuploadsignature: true,
      Enablefontsignature: true,
      EnableDrawSignature: true,
      EnableeSignaturePad: false,
      IsCompressed: false,
      IsCosign: true,
      eSignAuthmode: 0,
      EnableViewDocumentLink: false,
      Storetodb: true,
      IsGSTN: false,
      IsGSTN3B: false,
      IsCustomized: true,
      SignatureMode: "1,12,3,2",
      AuthenticationMode: 1,
      EnableInitials: false,
      IsInitialsCustomized: false,
      ValidateAllPlaceholders: false,
      Anchor: "Middle",
    };

    const encryptedParameter1 = encryptWithCertificate(
      sessionKey,
      publicKeyPath,
    );
    
    const encryptedParameter2 = encryptJsonDataAES(
      JSON.stringify(incomingData),
      sessionKey,
    );

    const hashedParameter3 = generateSHA256Hash(JSON.stringify(incomingData));
    const encryptedParameter3 = encryptJsonDataAES(
      hashedParameter3,
      sessionKey,
    );

    const payload = {
      sessionKey: sessionKey.toString("base64"),
      Parameter1: encryptedParameter1,
      Parameter2: encryptedParameter2,
      Parameter3: encryptedParameter3,
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
});

// POST /emSignerParameters endpoint
app.post('/emSignerParameters', (req, res) => {
  try {
    const incomingData = req.body;
    const encryptedParameter1 = encryptWithCertificate(sessionKey, publicKeyPath);
    const encryptedParameter2 = encryptJsonDataAES(JSON.stringify(incomingData), sessionKey);
    const hashedParameter3 = generateSHA256Hash(JSON.stringify(incomingData));
    const encryptedParameter3 = encryptJsonDataAES(hashedParameter3, sessionKey);

    const payload = {
      sessionKey: sessionKey.toString("base64"),
      Parameter1: encryptedParameter1,
      Parameter2: encryptedParameter2,
      Parameter3: encryptedParameter3,
    };

    res.json(payload);
  } catch (error) {
    res.status(400).send('Error in processing data');
  }
});

 
app.post('/emSignerResponse', (req, res) => {
  try {
    const encryptionKey = Buffer.from(sessionKey, 'base64');
    console.log("Encryption Key generated successfully.");
    
    const encrypted = Buffer.from(req.body.Returnvalue, 'base64');
    const decrypted = decryptDataAES(encrypted, encryptionKey);
    const base64Decoded = Buffer.from(decrypted).toString('base64');

     
    const downloadRef = "REF-" + Date.now();

     
    documentStore.set(downloadRef, base64Decoded);

     
    res.redirect(`http://localhost:5173/download?ref=${downloadRef}`);

  } catch (error) {
    console.error("Decryption error:", error);
    res.status(400).send('Error in processing data');
  }
});

 
app.get('/api/downloadpdf', (req, res) => {
  const { ref } = req.query;

   
  if (!ref || !documentStore.has(ref)) {
    return res.status(404).json({ error: "Document not found or link expired" });
  }

  try {
    
    const base64Data = documentStore.get(ref);
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${ref}_signed.pdf"`);
    res.send(pdfBuffer);

    

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send('Error generating PDF');
  }
});

 
app.use((req, res) => {
  res.status(404).send('Invalid endpoint');
});

 
const networkInterfaces = os.networkInterfaces();
const ipAddress = Object.values(networkInterfaces).flat().filter((iface) => iface.family === 'IPv4' && !iface.internal).map((iface) => iface.address);
app.listen(PORT, () => {
  console.log(`Server is running on port http://${ipAddress}:${PORT}`);
});