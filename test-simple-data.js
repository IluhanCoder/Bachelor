const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

// Schemas
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    nickname: String,
    email: String,
    organisation: String,
    password: String
});

const projectSchema = new mongoose.Schema({
    name: String,
    created: Date,
    lastModified: Date,
    owner: mongoose.Types.ObjectId,
    participants: [{
        participant: mongoose.Types.ObjectId,
        rights: {
            create: Boolean,
            edit: Boolean,
            delete: Boolean,
            check: Boolean,
            editParticipants: Boolean,
            addParticipants: Boolean,
            editProjectData: Boolean,
            manageSprints: Boolean
        }
    }]
});

const backlogSchema = new mongoose.Schema({
    name: String,
    tasks: [mongoose.Types.ObjectId],
    sprints: [mongoose.Types.ObjectId],
    projectId: mongoose.Types.ObjectId
});

const taskSchema = new mongoose.Schema({
    name: String,
    desc: String,
    projectId: mongoose.Types.ObjectId,
    isChecked: Boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date,
    executors: [mongoose.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});

async function testSimpleData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected!\n');

        const User = mongoose.model('User', userSchema);
        const Project = mongoose.model('Project', projectSchema);
        const Backlog = mongoose.model('Backlog', backlogSchema);
        const Task = mongoose.model('Task', taskSchema);

        // Get Elijah
        let elijah = await User.findOne({ email: 'elijah.peichev@gmail.com' });
        if (!elijah) {
            console.log('❌ Elijah not found');
            process.exit(1);
        }

        // Clear old data
        await Task.deleteMany({ createdBy: elijah._id });
        await Backlog.deleteMany({ projectId: { $in: (await Project.find({ owner: elijah._id })).map(p => p._id) } });
        await Project.deleteMany({ owner: elijah._id });
        console.log('✅ Cleared old data\n');

        // Create simple project
        const project = await Project.create({
            name: 'Test Project',
            created: new Date(),
            lastModified: new Date(),
            owner: elijah._id,
            participants: [{
                participant: elijah._id,
                rights: {
                    create: true, edit: true, delete: true, check: true,
                    editParticipants: true, addParticipants: true,
                    editProjectData: true, manageSprints: true
                }
            }]
        });
        console.log(`✅ Created project: ${project._id}`);

        // Create ONE backlog
        const backlog = await Backlog.create({
            name: 'Main Backlog',
            tasks: [],
            sprints: [],
            projectId: project._id
        });
        console.log(`✅ Created backlog: ${backlog._id}`);

        // Create 3 simple tasks and add to backlog
        const task1 = await Task.create({
            name: 'Task 1',
            desc: 'First task',
            projectId: project._id,
            isChecked: false,
            createdBy: elijah._id,
            created: new Date(),
            executors: [elijah._id],
            status: 'toDo',
            difficulty: 'low',
            priority: 'high'
        });
        console.log(`✅ Created task 1: ${task1._id}`);

        // Add task to backlog using findByIdAndUpdate (like the real API)
        await Backlog.findByIdAndUpdate(backlog._id, { $push: { tasks: task1._id } });
        console.log(`✅ Added task 1 to backlog`);

        const task2 = await Task.create({
            name: 'Task 2',
            desc: 'Second task',
            projectId: project._id,
            isChecked: true,
            createdBy: elijah._id,
            created: new Date(),
            checkedDate: new Date(),
            executors: [elijah._id],
            status: 'done',
            difficulty: 'mid',
            priority: 'mid'
        });
        await Backlog.findByIdAndUpdate(backlog._id, { $push: { tasks: task2._id } });
        console.log(`✅ Created task 2: ${task2._id} and added to backlog`);

        const task3 = await Task.create({
            name: 'Task 3',
            desc: 'Third task',
            projectId: project._id,
            isChecked: false,
            createdBy: elijah._id,
            created: new Date(),
            executors: [elijah._id],
            status: 'inProgress',
            difficulty: 'high',
            priority: 'low'
        });
        await Backlog.findByIdAndUpdate(backlog._id, { $push: { tasks: task3._id } });
        console.log(`✅ Created task 3: ${task3._id} and added to backlog`);

        // Verify backlog
        const updatedBacklog = await Backlog.findById(backlog._id);
        console.log(`\n✅ Backlog now has ${updatedBacklog.tasks.length} tasks`);
        console.log(`   Task IDs: ${updatedBacklog.tasks.join(', ')}`);

        console.log(`\n🎉 Test data created successfully!`);
        console.log(`📁 Project ID: ${project._id}`);
        console.log(`📋 Go to task board to see 3 tasks\n`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

testSimpleData();
