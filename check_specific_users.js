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

async function checkUsers() {
    const names = ["sanjay s adagale", "hemanta kumar panda"];
    for (const name of names) {
        // Query users by name (case-insensitive search if needed, but doing exact first)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let foundUser = null;
        usersSnapshot.forEach(doc => {
            if (doc.data().name && doc.data().name.toLowerCase() === name.toLowerCase()) {
                foundUser = { id: doc.id, ...doc.data() };
            }
        });
        
        if (foundUser) {
            console.log(`Found user: ${foundUser.name} (ID: ${foundUser.id})`);
            const challengesSnap = await getDocs(collection(db, 'user_challenges'));
            let challengeFound = false;
            challengesSnap.forEach(doc => {
                if (doc.data().userId === foundUser.id) {
                    console.log(`Challenge data for ${foundUser.name}:`);
                    console.log(doc.data().completedDays);
                    challengeFound = true;
                }
            });
            if (!challengeFound) console.log("No challenge data found.");
        } else {
            console.log(`User not found: ${name}`);
        }
        console.log("-----------------------");
    }
    process.exit(0);
}

checkUsers().catch(console.error);
