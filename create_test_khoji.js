import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

async function createTestUser() {
    const email = 'testkhoji@tgf.com';
    const phone = ''; // empty phone
    const name = 'Test Khoji';
    
    const emailSlug = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const phoneSlug = phone.replace(/\D/g, '');
    const userId = `${emailSlug}__${phoneSlug}`; // should be testkhoji_tgf_com__

    const challengeId = '11_day_intro';
    const startDate = '2026-05-02';

    console.log(`Creating user: ${userId}`);

    try {
        await setDoc(doc(db, 'users', userId), {
            name,
            email,
            phone,
            createdAt: new Date()
        });

        const docId = `${userId}_${challengeId}`;
        
        const completedDays = {};
        const reflections = {};
        
        let currentDate = new Date(startDate);
        for(let i=0; i<11; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            completedDays[dateStr] = true;
            reflections[dateStr] = { feeling: 'peaceful', thought: 'test' };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        await setDoc(doc(db, 'user_challenges', docId), {
            userId,
            challengeId,
            startDate,
            completedDays,
            reflections,
            createdAt: new Date()
        });

        console.log(`✅ Test user created successfully without a phone number!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to create test user:', err);
        process.exit(1);
    }
}

createTestUser();
