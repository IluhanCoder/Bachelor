const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function cleanInvalidParticipants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get all participant records
        const allParticipants = await db.collection('projectparticipants').find({}).toArray();
        
        console.log(`📊 Total participant records: ${allParticipants.length}\n`);

        let deletedCount = 0;

        for (const p of allParticipants) {
            // Check if user exists
            const userExists = await db.collection('users').findOne({ _id: p.participant });
            
            if (!userExists) {
                console.log(`❌ Deleting invalid participant: ${p.participant}`);
                await db.collection('projectparticipants').deleteOne({ _id: p._id });
                deletedCount++;
            }
        }

        console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} invalid participant records.`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanInvalidParticipants();
