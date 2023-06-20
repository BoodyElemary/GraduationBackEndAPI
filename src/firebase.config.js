// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { isSupported, getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsP2DB1vvb3aGNvUX7OvztUF07mhcDApU",
  authDomain: "bobazona-e6b31.firebaseapp.com",
  projectId: "bobazona-e6b31",
  storageBucket: "bobazona-e6b31.appspot.com",
  messagingSenderId: "902745000448",
  appId: "1:902745000448:web:2134a056aaf0aa90a0e6e5",
  measurementId: "G-7RFDSBV6G9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

module.exports = {firebaseConfig, app}
