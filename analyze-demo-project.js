const mongoose = require('mongoose');

const DB_CONN = "mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?appName=Backlogs";

const taskSchema = new mongoose.Schema({
    name: String,
    desc: String,
    projectId: mongoose.Types.ObjectId,
    isChecked: Boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: { type: Date, required: false },
    executors: [mongoose.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});

const Task = mongoose.model('Task', taskSchema);

async function analyzeTasks() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_CONN);
        console.log('Connected successfully!\n');

        // Знайти всі таски з E-commerce проекту
        const tasks = await Task.find({}).lean();
        
        console.log('📊 Analyzing all tasks in database...\n');
        console.log(`Total tasks found: ${tasks.length}\n`);

        // Унікальні значення статусів
        const statuses = [...new Set(tasks.map(t => t.status).filter(Boolean))];
        console.log('✅ Unique STATUS values:');
        statuses.forEach(s => console.log(`   - "${s}"`));

        // Унікальні значення складності
        const difficulties = [...new Set(tasks.map(t => t.difficulty).filter(Boolean))];
        console.log('\n🎯 Unique DIFFICULTY values:');
        difficulties.forEach(d => console.log(`   - "${d}"`));

        // Унікальні значення пріоритету
        const priorities = [...new Set(tasks.map(t => t.priority).filter(Boolean))];
        console.log('\n⚡ Unique PRIORITY values:');
        priorities.forEach(p => console.log(`   - "${p}"`));

        // Показати декілька прикладів тасок
        console.log('\n📝 Sample tasks:');
        tasks.slice(0, 5).forEach((task, i) => {
            console.log(`\n${i + 1}. ${task.name}`);
            console.log(`   status: "${task.status}"`);
            console.log(`   difficulty: "${task.difficulty}"`);
            console.log(`   priority: "${task.priority}"`);
            console.log(`   isChecked: ${task.isChecked}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n\nDatabase connection closed.');
    }
}

analyzeTasks();
