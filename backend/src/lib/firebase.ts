import firebaseAdmin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId) {
  throw new Error(
    "Missing environment variables for Firebase Admin, projectId"
  );
}
if (!clientEmail) {
  throw new Error(
    "Missing environment variables for Firebase Admin, clientEmail"
  );
}
if (!privateKey) {
  throw new Error(
    "Missing environment variables for Firebase Admin, privateKey"
  );
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    clientEmail,
    privateKey,
    projectId,
  }),
  databaseURL: `https://${projectId}.firebaseio.com$`,
  projectId: projectId,
});

export const firebaseAuth = firebaseAdmin.auth();
