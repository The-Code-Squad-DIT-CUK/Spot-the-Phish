const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBEorWFDDebnnI-izIZdqVZN-tAJU0gsYA",
  authDomain: "phishing-56bc6.firebaseapp.com",
  projectId: "phishing-56bc6",
  storageBucket: "phishing-56bc6.appspot.com",
  messagingSenderId: "1059210443573",
  appId: "1:1059210443573:web:14aa30725fadaffb96aa7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage, ref, uploadBytes, getDownloadURL};