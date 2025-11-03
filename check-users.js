const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function checkUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Count all users
        const allUsers = await db.collection('users').find({}).toArray();
        console.log(`📊 Total users in database: ${allUsers.length}\n`);

        // Show first 5 users
        console.log('First 5 users:');
        allUsers.slice(0, 5).forEach(user => {
            console.log(`  - ${user.name || 'N/A'} ${user.surname || 'N/A'} (${user.nickname}) - ${user.email}`);
        });

        // Check Elijah
        const elijah = await db.collection('users').findOne({ email: 'elijah.peichev@gmail.com' });
        if (elijah) {
            console.log(`\n✅ Elijah found: ${elijah.name} ${elijah.surname} (${elijah.nickname})`);
            console.log(`   ID: ${elijah._id}`);
        } else {
            console.log('\n❌ Elijah not found!');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
