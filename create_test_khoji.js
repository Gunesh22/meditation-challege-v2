import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

async function checkTestUser() {
    // Check both possible user IDs
    const ids = ['testkhoji_tgf_com__', 'testkhoji_tgf_com__0000000000'];
    
    for (const userId of ids) {
        console.log(`\n--- Checking userId: "${userId}" ---`);
        
        const q = query(
            collection(db, 'user_challenges'),
            where('userId', '==', userId)
        );
        const snap = await getDocs(q);
        
        if (snap.empty) {
            console.log('  No challenges found.');
        } else {
            snap.forEach(docSnap => {
                const data = docSnap.data();
                const completedCount = Object.keys(data.completedDays || {}).length;
                console.log(`  Doc ID: ${docSnap.id}`);
                console.log(`  Challenge: ${data.challengeId}`);
                console.log(`  Start: ${data.startDate}`);
                console.log(`  Completed days: ${completedCount}`);
            });
        }
    }
    
    process.exit(0);
}

checkTestUser();
