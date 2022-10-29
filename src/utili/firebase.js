import { queryAllByAltText } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs,
    runTransaction,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQRp4pkwyzuA5Y8JrYdD3vErxzqYw64sA",
    authDomain: "face-recognition-eca96.firebaseapp.com",
    projectId: "face-recognition-eca96",
    storageBucket: "face-recognition-eca96.appspot.com",
    messagingSenderId: "257690048635",
    appId: "1:257690048635:web:fd5105fc78541ea2742ade"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDoc = async (collectionkey, objectsToAdd) => {
    const collectionRef = collection(db, collectionkey);
    const batch = writeBatch(db);

    objectsToAdd.forEach(object => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);
    });

    await batch.commit();
    console.log('done')
}

export const updateUser = async (userAuth) => {
    const sfDocRef = doc(db, "user", userAuth.uid);
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);
            if (!sfDoc.exists()) {
                throw "Document does not exist!";
            }

            const newentries = sfDoc.data().entries + 1;
            transaction.update(sfDocRef, { entries: newentries });
        });
        console.log("Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}

export const getUserAndDoc = async () => {
    const collectionRef = collection(db, 'user');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const userMap = querySnapshot.docs.map(docSnapshot => docSnapshot.data());
    return userMap;
}

export const createUserDocFromAuth = async (userAuth, additionalInfo = {}) => {
    if (!userAuth) return;

    const userDocRef = doc(db, 'user', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { email } = userAuth;
        const joined = new Date();
        const uid = userAuth.uid

        try {
            await setDoc(userDocRef, { email, joined, uid, ...additionalInfo })
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }
    return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);