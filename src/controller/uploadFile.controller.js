const path = require('path');
const { initializeApp } = require('firebase/app');
const {getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject} = require("firebase/storage");
const multer = require("multer");
const config  = require(path.join(__dirname, "..", "firebase.config"))

const storage = getStorage();

initializeApp(config.firebaseConfig);

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {

      // check if the file type is allowed
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
      }
      cb(null, true);
    },
});

async function uploadImageToFirebaseStorage(imageFile, distinationFolderName){
    try{

        const storageRef = ref(storage, distinationFolderName  +'/' +  Date.now() + '_' + imageFile.originalname)

        const metadata = {
            contentType : imageFile.mimetype,
        }
        const snapshot = await uploadBytesResumable(storageRef, imageFile.buffer, metadata)
        const downloadURL = await getDownloadURL(snapshot.ref)

        return {success: true, downloadURL }
    }
    catch(error){
        return {success:false, message: error}
    }
}

async function deleteImageFromFirebaseStorage(downloadURL) {
    try {
      // Get a reference to the file using the download URL
      const fileRef = ref(storage, downloadURL);

      // Delete the file from Firebase Storage
      await deleteObject(fileRef);

      console.log("Deleted done");
      return { success: true };
    } catch (error) {
        console.log(error);
      return { success: false, message: error.message };
    }
  }

module.exports = {uploadImageToFirebaseStorage, deleteImageFromFirebaseStorage, upload}
