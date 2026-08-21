import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
  Firestore
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { EvaluationRequest } from '../types';

// Initialize Firebase App instance
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID and robust connection settings for iframe/web sandbox
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, firestoreDbId);
  } catch {
    return getFirestore(app, firestoreDbId);
  }
}

export const db: Firestore = createFirestoreInstance();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Error handler as strictly required by Firestore integration skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection to Firestore as mandated by skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Connection check timeout')), 4000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeout
    ]);
    console.log('[Firebase] Connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or Firestore config needs attention.');
    }
    // We log and return false without crashing the UI
    return false;
  }
}

// Run connectivity test on import with debounce
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testFirestoreConnection().catch(() => {});
  }, 1000);
}

// Firestore Database Service for ScrapyGo
export const FirestoreService = {
  // Save or update an evaluation/inquiry
  async saveEvaluation(item: EvaluationRequest): Promise<void> {
    const cleanId = item.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `evaluations/${cleanId}`;
    try {
      const docRef = doc(db, 'evaluations', cleanId);
      const payload = {
        ...item,
        id: item.id,
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      throw err;
    }
  },

  // Update status and details
  async updateEvaluation(id: string, updates: Partial<EvaluationRequest>): Promise<void> {
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `evaluations/${cleanId}`;
    try {
      const docRef = doc(db, 'evaluations', cleanId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
      throw err;
    }
  },

  // Delete an evaluation
  async deleteEvaluation(id: string): Promise<void> {
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `evaluations/${cleanId}`;
    try {
      const docRef = doc(db, 'evaluations', cleanId);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
      throw err;
    }
  },

  // Real-time listener for all evaluations
  subscribeEvaluations(
    onUpdate: (evaluations: EvaluationRequest[]) => void,
    onError?: (error: any) => void
  ): Unsubscribe {
    const path = 'evaluations';
    try {
      const q = query(collection(db, 'evaluations'));
      return onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const list: EvaluationRequest[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as EvaluationRequest);
          });
          onUpdate(list);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
      return () => {};
    }
  },

  // Save or sync user profile
  async saveUserProfile(user: { phone: string; name: string; email?: string }): Promise<void> {
    const cleanPhone = user.phone.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `users/${cleanPhone}`;
    try {
      const docRef = doc(db, 'users', cleanPhone);
      await setDoc(docRef, {
        ...user,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
};
