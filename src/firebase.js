import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyDxyPKxO-qIlPOMe_JD5IIq4PLaSUfC51E",
    authDomain: "battle-clicker.firebaseapp.com",
    databaseURL: "https://battle-clicker.firebaseio.com",
    projectId: "battle-clicker",
    storageBucket: "battle-clicker.appspot.com",
    messagingSenderId: "570314408876"
};
firebase.initializeApp(config);
export default firebase;