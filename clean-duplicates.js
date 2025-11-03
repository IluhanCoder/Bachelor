const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function cleanDuplicates() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Clean duplicate participants
        const participants = await db.collection('projectparticipants').find({}).toArray();
        const seen = new Set();
        let deletedCount = 0;

        for (const p of participants) {
            const key = `${p.project}-${p.participant}`;
            if (seen.has(key)) {
                await db.collection('projectparticipants').deleteOne({ _id: p._id });
                deletedCount++;
            } else {
                seen.add(key);
            }
        }

        console.log(`🗑️  Deleted ${deletedCount} duplicate participants\n`);

        // Clean duplicate invites
        const invites = await db.collection('invites').find({}).toArray();
        const seenInvites = new Set();
        let deletedInvites = 0;

        for (const inv of invites) {
            const key = `${inv.project}-${inv.user}`;
            if (seenInvites.has(key)) {
                await db.collection('invites').deleteOne({ _id: inv._id });
                deletedInvites++;
            } else {
                seenInvites.add(key);
            }
        }

        console.log(`🗑️  Deleted ${deletedInvites} duplicate invites\n`);

        console.log('✅ Cleanup complete!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanDuplicates();
