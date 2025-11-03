const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function checkSP() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get project 123
        const project123 = await db.collection('projects').findOne({ name: '123' });
        if (project123) {
            console.log('📁 Project "123":');
            const tasks123 = await db.collection('tasks').find({ projectId: project123._id }).toArray();
            console.log(`\n  Tasks (${tasks123.length}):`);
            tasks123.forEach(task => {
                console.log(`    - ${task.name}`);
                console.log(`      difficulty: ${task.difficulty}`);
                console.log(`      priority: ${task.priority}`);
                console.log(`      status: ${task.status}`);
                console.log(`      All fields:`, Object.keys(task));
                console.log('');
            });
        }

        // Get E-commerce project
        const ecommerce = await db.collection('projects').findOne({ name: 'E-commerce Platform Redesign' });
        if (ecommerce) {
            console.log('\n📁 E-commerce Platform Redesign:');
            const tasks = await db.collection('tasks').find({ projectId: ecommerce._id }).limit(3).toArray();
            console.log(`\n  First 3 tasks:`);
            tasks.forEach(task => {
                console.log(`    - ${task.name}`);
                console.log(`      difficulty: ${task.difficulty}`);
                console.log(`      priority: ${task.priority}`);
                console.log(`      status: ${task.status}`);
                console.log(`      All fields:`, Object.keys(task));
                console.log('');
            });
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSP();
