const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function finalCheck() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Count all users
        const totalUsers = await db.collection('users').countDocuments();
        console.log(`📊 Total users: ${totalUsers}`);

        // Count participants and invites per project
        const projects = await db.collection('projects').find({}).toArray();
        
        for (const project of projects) {
            const participantsCount = await db.collection('projectparticipants').countDocuments({ project: project._id });
            const invitesCount = await db.collection('invites').countDocuments({ project: project._id, status: 'pending' });
            
            // Users involved in this project
            const involvedUsers = participantsCount + invitesCount;
            const availableUsers = totalUsers - involvedUsers - 1; // -1 for owner
            
            console.log(`\n📁 ${project.name}:`);
            console.log(`   Participants: ${participantsCount}`);
            console.log(`   Pending invites: ${invitesCount}`);
            console.log(`   Available to invite: ${availableUsers}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

finalCheck();
