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

async function countCompleters() {
    const challengesSnap = await getDocs(collection(db, 'user_challenges'));
    let elevenDays = 0;
    let tenDays = 0;
    let moreThanEleven = 0;
    
    challengesSnap.forEach(doc => {
        const data = doc.data();
        if (data.completedDays) {
            const count = Object.keys(data.completedDays).length;
            if (count === 10) tenDays++;
            else if (count === 11) elevenDays++;
            else if (count > 11) moreThanEleven++;
        }
    });

    console.log(`Users with 10 days: ${tenDays}`);
    console.log(`Users with 11 days: ${elevenDays}`);
    console.log(`Users with >11 days: ${moreThanEleven}`);
    process.exit(0);
}

countCompleters().catch(console.error);
