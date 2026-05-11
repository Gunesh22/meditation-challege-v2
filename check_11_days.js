import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBtLTZInxyKjbQCoSvqKOGDdOjhrOFfgaM",
    authDomain: "tgf-meditation.firebaseapp.com",
    projectId: "tgf-meditation",
    storageBucket: "tgf-meditation.firebasestorage.app",
    messagingSenderId: "795468174785",
    appId: "1:795468174785:web:3df58c8aa84827e5d58b40"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function find11Days() {
    const usersSnap = await getDocs(collection(db, 'users'));
    const userMap = {};
    usersSnap.forEach(doc => {
        userMap[doc.id] = doc.data().name;
    });

    const challengesSnap = await getDocs(collection(db, 'user_challenges'));
    challengesSnap.forEach(doc => {
        const data = doc.data();
        if (data.completedDays) {
            const keys = Object.keys(data.completedDays);
            if (keys.length >= 11) {
                console.log(`User with ${keys.length} days: ${userMap[data.userId]} (${data.userId})`);
                console.log(keys);
            }
        }
    });

    process.exit(0);
}

find11Days().catch(console.error);
