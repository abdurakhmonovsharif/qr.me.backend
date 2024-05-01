import * as admin from 'firebase-admin';
import * as serviceAccount from "../firebase_config.json";

export class FirebaseService {
    private firebaseAdmin: admin.app.App;

    constructor() {
        this.firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: 'your-bucket',
        });
    }

    getStorage() {
        return this.firebaseAdmin.storage();
    }
    async getFile(fileName: string): Promise<Buffer> {
        const storage = admin.storage();
        const bucket = storage.bucket();
        const file = bucket.file(fileName);

        try {
            const [fileBuffer] = await file.download();
            return fileBuffer;
        } catch (error) {
            throw new Error(`Error downloading file: ${error}`);
        }
    }
}
