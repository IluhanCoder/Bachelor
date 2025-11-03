const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function restoreParticipants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get Elijah and projects
        const elijah = await db.collection('users').findOne({ email: 'elijah.peichev@gmail.com' });
        const ecommerce = await db.collection('projects').findOne({ name: 'E-commerce Platform Redesign' });
        const fitness = await db.collection('projects').findOne({ name: 'Mobile Fitness Tracking App' });

        if (!elijah || !ecommerce || !fitness) {
            console.log('❌ Required data not found');
            return;
        }

        console.log('Found:');
        console.log(`  - Elijah: ${elijah._id}`);
        console.log(`  - E-commerce: ${ecommerce._id}`);
        console.log(`  - Fitness: ${fitness._id}\n`);

        // Get some random users for participants
        const allUsers = await db.collection('users').find({}).toArray();
        const otherUsers = allUsers.filter(u => u.email !== 'elijah.peichev@gmail.com');

        // E-commerce participants: 4 active + 2 pending
        const ecommerceActive = [
            otherUsers[0],  // Sarah Johnson
            otherUsers[1],  // Michael Chen
            otherUsers[2],  // Emma Williams
            otherUsers[3]   // James Anderson
        ];

        const ecommercePending = [
            otherUsers[4],  // Olivia Martinez
            otherUsers[5]   // David Lee
        ];

        // Fitness participants: 3 active + 2 pending
        const fitnessActive = [
            otherUsers[6],  // Sophia Brown
            otherUsers[7],  // William Taylor
            otherUsers[8]   // Ava Garcia
        ];

        const fitnessPending = [
            otherUsers[9],  // Benjamin Rodriguez
            otherUsers[10]  // Isabella Martinez
        ];

        console.log('Creating E-commerce participants...');
        for (const user of ecommerceActive) {
            await db.collection('projectparticipants').insertOne({
                project: ecommerce._id,
                participant: user._id,
                editRights: false,
                deleteRights: false,
                editParticipants: false,
                acceptedAt: new Date()
            });
            console.log(`  ✅ Added ${user.nickname}`);
        }

        console.log('\nCreating E-commerce invites...');
        for (const user of ecommercePending) {
            await db.collection('invites').insertOne({
                project: ecommerce._id,
                user: user._id,
                status: 'pending',
                createdAt: new Date()
            });
            console.log(`  📧 Invited ${user.nickname}`);
        }

        console.log('\nCreating Fitness participants...');
        for (const user of fitnessActive) {
            await db.collection('projectparticipants').insertOne({
                project: fitness._id,
                participant: user._id,
                editRights: false,
                deleteRights: false,
                editParticipants: false,
                acceptedAt: new Date()
            });
            console.log(`  ✅ Added ${user.nickname}`);
        }

        console.log('\nCreating Fitness invites...');
        for (const user of fitnessPending) {
            await db.collection('invites').insertOne({
                project: fitness._id,
                user: user._id,
                status: 'pending',
                createdAt: new Date()
            });
            console.log(`  📧 Invited ${user.nickname}`);
        }

        console.log('\n✅ All participants and invites restored!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

restoreParticipants();
