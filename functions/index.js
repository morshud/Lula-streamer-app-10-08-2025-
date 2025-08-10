const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.syncOnlineStatus = functions.database.ref('/users/{userId}/onlineStatus')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const onlineStatus = change.after.val();

    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(userId);

    try {
      await userRef.update({
        onlineStatus: onlineStatus
      });
      console.log(`Synced online status for user ${userId}: ${onlineStatus}`);
      return null;
    } catch (error) {
      console.error(`Error syncing online status for user ${userId}:`, error);
      return null; // Indicate that the function completed (even if with an error)
    }
  });