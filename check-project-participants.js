const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function checkParticipants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get all projects
        const projects = await db.collection('projects').find({}).toArray();
        console.log(`📊 Total projects: ${projects.length}\n`);

        // Show participants for each project
        for (const project of projects) {
            console.log(`\n📁 Project: ${project.name}`);
            console.log(`   Owner: ${project.owner}`);
            console.log(`   Created: ${project.createdAt}`);
            
            // Get participants
            const participants = await db.collection('projectparticipants').find({ 
                project: project._id 
            }).toArray();
            
            console.log(`   Participants: ${participants.length}`);
            for (const p of participants) {
                const user = await db.collection('users').findOne({ _id: p.participant });
                console.log(`     - ${user?.nickname || 'Unknown'} (${user?.email || 'N/A'})`);
            }

            // Get pending invites
            const invites = await db.collection('invites').find({ 
                project: project._id,
                status: 'pending'
            }).toArray();
            
            console.log(`   Pending invites: ${invites.length}`);
            for (const inv of invites) {
                const user = await db.collection('users').findOne({ _id: inv.user });
                console.log(`     - ${user?.nickname || 'Unknown'} (${user?.email || 'N/A'})`);
            }
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkParticipants();
