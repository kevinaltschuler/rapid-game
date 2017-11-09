const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.attackPlayer = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const id = req.query.id;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const playerRef = admin.database().ref('/player' + id);

  playerRef.once('value', (snapshot) => {
        if(!snapshot.val().defending) {
        	const healthRef = admin.database().ref('/player' + id + '/health');
        	const health = snapshot.val().health || 100;
        	healthRef.set(health - 10)
        }
    });
  .push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});