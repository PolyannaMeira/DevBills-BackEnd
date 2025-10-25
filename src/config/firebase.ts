import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
    if(admin.apps.length>0) return;

    const {FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL} = env;

    if(!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL){
        throw new Error("Firebase environment variables are not set properly.");
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                privateKey: FIREBASE_PRIVATE_KEY,
                clientEmail: FIREBASE_CLIENT_EMAIL
                })
            });
        } catch (error) {
            console.error("Error initializing Firebase Admin:", error);
            process.exit(1);
        }
    }

export default initializeFirebaseAdmin;