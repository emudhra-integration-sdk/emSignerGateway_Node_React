# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




5. ESGS integration
Here enterprises need to be send data to the ESGS though HTTPS POST request. The steps for integrating with ESGS can technically be described as below:
To start off the integration process, follow below steps:
There are five steps of process:
Step 1: Generate unique Session Key for each request
Step 2: Create JSON data and encrypt using unique Session key (Step 1)
Step 3: Generate Hash of data
Step 4: Encrypt generated Hash (Step3) with the unique Session Key (Step1)
Step 5: Encrypt the unique Session Key (Step 1) using public key of the emSigner
Step 6: HTTPS Post request with step2+step4+step5 output
Step 7: Decrypt encrypted signed data (Step6) with session key (Step1)



{ "Name": "", "FileType": "PDF", "SelectPage": "", "SignaturePosition": "", "AuthToken": "", "File": "", "PageNumber": "", "PreviewRequired": true, "PagelevelCoordinates": "", "CustomizeCoordinates": "", "SUrl": "/Success", "FUrl": "/Error", "CUrl": "/Cancel", "ReferenceNumber": "", "Enableuploadsignature": true, "Enablefontsignature": true, "EnableDrawSignature": true, "EnableeSignaturePad": false, "IsCompressed": false, "IsCosign": false, "Storetodb": false, "IsGSTN": false, "IsGSTN3B": false, "IsCustomized": false, "eSign_SignerId":, "TransactionNumber":, "SignatureMode": "1,2,3,8,12,14", "AuthenticationMode": 1, "EnableInitials": false, "IsInitialsCustomized": false, "SelectInitialsPage": null, "InitialsPosition": null, "InitialsCustomizeCoordinates": "", "InitialsPagelevelCordinates": "", "InitialsPageNumbers": "", "ValidateAllPlaceholders": false, "Searchtext":, "Anchor": "Middle", "InitialSearchtext": null, "InitialsAnchor": null, "Reason": null "EnableFetchSignerInfo": null,}

5.3.2 Specifications
Sl
No
Parameter
Data
Type
Presence
Description
1
Name
String
Mandatory
Pass the name of the signatory which will be displayed along with the signature.
2
FileType
String
Mandatory
Specify
Filetype=PDF, If file is PDF format.
Filetype=XML, if file is XML format.
Filetype=HASH, if file is HASH format. Refer
Table 3
Parameters vary with file type.
•
PDF Parameters
•
XML & DATA Parameters
Filetype=DATA, if file is text format.
3
SignatureMode
Int
Mandatory
This parameter describes the signature mode to be enabled for completing the request. Currently, we support four signature options i.e. dSign, eSign, eSignature and eIDAS.
•
dSign: Requires Crypto Token and valid digital signature issued by licensed Certifying Authorities to digitally sign the request.
•
eSign v3: eMudhra KYC based signing
•
eSignature: eSignature is not valid in India, but it is widely accepted in other countries.
•
eSign v2.1: eSign (Aadhar based signing) is valid ONLY in India.
4
SelectPage
String
Mandatory
Refer Table 1
5
SignaturePosition
String
Mandatory
Signature placeholder specification where the signature must be placed on a page.
Refer Table 2


6
AuthToken
String
Mandatory
Usually, an Authtoken is a unique identifier of an application requesting access to our service. emSigner would generate a unique Authtoken for each customer to access emSigner signer gateway service. Pass valid unique Authtoken generated for your account. To generate Authtoken, click here.
7
File
String
Mandatory
Compress the file using 7zip (Optional) and pass compressed base 64 string of file that needs to be signed. If you are compressing the document, make sure you send extra parameter i.e. IsCompressed as TRUE, otherwise FALSE.
Compression ratio is high for XML and DATA, whereas for PDF it is only 10% (Varies with size of the document). To know how to compress the file, refer to this section.
8
PageNumber
Int
Mandatory
Pass page numbers separated with a comma, where you wanted to see the signature in the document.
Example: 1,2
Note: This is mandatory if SelectPage is SPECIFY.
9
PreviewRequired
Boolean
Mandatory
By default, this will be FALSE.
If you want to show preview to the user when redirected to emSigner signer gateway page.
Pass TRUE if the preview is required before signing the document.
Note: Not applicable to dsign


10
PagelevelCoordinates
String
Mandatory
Specify coordinates of page level as
PagelevelCoordinates=
Pagenumber1,left,top,width,height;
Pagenumber2,left,top,width,height
Example: In 10 pages document you wanted the document to be signed on 1st and 6th page with some co-ordinates then specify
PagelevelCoordinates=1,7,10,60,120;6,45,20,
60,120
Note: This is mandatory if SelectPage is
PagelevelCoordinates.
11
CustomizeCoordinates
String
Mandatory
CustomizeCoordinates=left,top,width,Height
Example: In 10 pages document you wanted the document to be signed on particular positions then specify
CustomizeCoordinates=7,10,60,120
Note: This is mandatory if SignaturePosition is Customize.
12
SUrl
String
Mandatory
Pass success URL, so that after successful signing signer gateway will send a response to that particular URL. The response handling can then be done by you after redirection to this URL.
13
FUrl
String
Mandatory
Pass failure URL, so that when there is a failure, signer gateway will send a response to that particular URL. The response handling can then be done by you after redirection to this URL.
14
CUrl
String
Mandatory
Pass cancel URL, so that when customer cancels the signer gateway process in the middle, signer gateway will send a response to that particular URL. The response handling can then be done by you after redirection to this URL.
15
ReferenceNumber
String
Mandatory
Pass unique random number as a reference number for each transaction request.
Maximum of 20 characters.
Example: 1213
Note:
•
You can pass timestamp as a reference number to create uniqueness.
•
You are not allowed to pass reference number which has been used for any of the previous transactions.
16
Enableuploadsignature
Boolean
Mandatory
By default this will be FALSE, if enabled then the user will have the option to upload handwritten signature in emSigner Signer Gateway page and the same will be affixed on the signed PDF document And using this option will invalidate any signed document sent for signing again by another signatory.
Pass TRUE if you want to enable upload signature option in the gateway.
Note: If the user selects signature type as eSignature or combination of that, then at that time any of the parameter i.e. enable eSignature pad/enable draw signature/enable font signature/enable upload signature is mandatory.
For dSign, it is not mandatory.By default this will be FALSE, if enabled then the user will have the option to choose or generate some font based signature in emSigner Signer Gateway page and the same will be affixed on the signed PDF document And using this option will invalidate any signed document sent for signing again by another signatory.