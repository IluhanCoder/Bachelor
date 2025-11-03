const mongoose = require('mongoose');

const DB_CONN = "mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?appName=Backlogs";

// Схеми
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    nickname: String,
    organisation: String,
    email: String,
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
    checkedDate: { type: Date, required: false },
    executors: [mongoose.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});

const sprintSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    goal: String,
    tasks: [mongoose.Types.ObjectId]
});

const inviteSchema = new mongoose.Schema({
    host: mongoose.Types.ObjectId,
    guest: mongoose.Types.ObjectId,
    project: mongoose.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Backlog = mongoose.model('Backlog', backlogSchema);
const Task = mongoose.model('Task', taskSchema);
const Sprint = mongoose.model('Sprint', sprintSchema);
const Invite = mongoose.model('Invite', inviteSchema);

async function analyzeExistingProject() {
    console.log('\n🔍 Analyzing existing E-Commerce project...\n');
    
    const project = await Project.findOne({ name: /E-Commerce/i }).lean();
    if (!project) {
        console.log('E-Commerce project not found!');
        return null;
    }
    
    console.log('Project:', project.name);
    console.log('Created:', project.created);
    console.log('Owner:', project.owner);
    console.log('Participants:', project.participants.length);
    
    const backlogs = await Backlog.find({ projectId: project._id }).lean();
    console.log('Backlogs:', backlogs.length);
    
    for (const backlog of backlogs) {
        console.log(`  - ${backlog.name}: ${backlog.tasks?.length || 0} tasks, ${backlog.sprints?.length || 0} sprints`);
    }
    
    const tasks = await Task.find({ projectId: project._id }).lean();
    console.log('Tasks:', tasks.length);
    
    const sprints = [];
    for (const backlog of backlogs) {
        if (backlog.sprints && backlog.sprints.length > 0) {
            const backlogSprints = await Sprint.find({ _id: { $in: backlog.sprints } }).lean();
            sprints.push(...backlogSprints);
        }
    }
    console.log('Sprints:', sprints.length);
    
    return { project, backlogs, tasks, sprints };
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function seedRealisticProjects() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_CONN);
        console.log('Connected successfully!\n');

        // Аналіз існуючого проекту
        await analyzeExistingProject();

        // Отримати всіх користувачів
        const users = await User.find({}).lean();
        console.log(`\n📊 Found ${users.length} users in database\n`);

        // Дати для реалістичності (2 місяці назад до сьогодні)
        const now = new Date();
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        // Проект 1: Mobile Banking App
        console.log('Creating Project 1: Mobile Banking App...');
        const project1Owner = users.find(u => u.nickname === 'sjohnson');
        const project1Start = new Date(twoMonthsAgo);
        project1Start.setDate(project1Start.getDate() + 2);
        
        const project1Participants = [
            { user: users.find(u => u.nickname === 'mchen'), rights: { create: true, edit: true, delete: false, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: true } },
            { user: users.find(u => u.nickname === 'ewilliams'), rights: { create: true, edit: true, delete: false, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: false } },
            { user: users.find(u => u.nickname === 'jbrown'), rights: { create: true, edit: true, delete: false, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: false } },
        ];

        const project1 = new Project({
            name: 'Mobile Banking App',
            created: project1Start,
            lastModified: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 дні тому
            owner: project1Owner._id,
            participants: project1Participants.map(p => ({
                participant: p.user._id,
                rights: p.rights
            }))
        });
        await project1.save();

        // Запрошення для проекту 1
        const invite1 = new Invite({
            host: project1Owner._id,
            guest: users.find(u => u.nickname === 'smartinez')._id,
            project: project1._id
        });
        await invite1.save();

        // Беклоги для проекту 1
        const backlog1_1 = new Backlog({
            name: 'Frontend Development',
            tasks: [],
            sprints: [],
            projectId: project1._id
        });
        await backlog1_1.save();

        const backlog1_2 = new Backlog({
            name: 'Backend API',
            tasks: [],
            sprints: [],
            projectId: project1._id
        });
        await backlog1_2.save();

        // Спринти для проекту 1
        const sprint1_1Start = new Date(project1Start);
        sprint1_1Start.setDate(sprint1_1Start.getDate() + 5);
        const sprint1_1End = new Date(sprint1_1Start);
        sprint1_1End.setDate(sprint1_1End.getDate() + 14);

        const sprint1_1 = new Sprint({
            name: 'Sprint 1: Authentication & User Profile',
            startDate: sprint1_1Start,
            endDate: sprint1_1End,
            goal: 'Implement user authentication and basic profile management',
            tasks: []
        });
        await sprint1_1.save();

        const sprint1_2Start = new Date(sprint1_1End);
        sprint1_2Start.setDate(sprint1_2Start.getDate() + 1);
        const sprint1_2End = new Date(sprint1_2Start);
        sprint1_2End.setDate(sprint1_2End.getDate() + 14);

        const sprint1_2 = new Sprint({
            name: 'Sprint 2: Account Management',
            startDate: sprint1_2Start,
            endDate: sprint1_2End,
            goal: 'Build account viewing and transaction history features',
            tasks: []
        });
        await sprint1_2.save();

        const sprint1_3Start = new Date(sprint1_2End);
        sprint1_3Start.setDate(sprint1_3Start.getDate() + 1);
        const sprint1_3End = new Date(sprint1_3Start);
        sprint1_3End.setDate(sprint1_3End.getDate() + 14);

        const sprint1_3 = new Sprint({
            name: 'Sprint 3: Transfers & Payments',
            startDate: sprint1_3Start,
            endDate: sprint1_3End,
            goal: 'Enable money transfers and bill payments',
            tasks: []
        });
        await sprint1_3.save();

        // Таски для проекту 1
        const project1Tasks = [
            // Sprint 1 tasks
            { name: 'Design login screen UI', desc: 'Create mockups and implement login interface', backlog: backlog1_1, sprint: sprint1_1, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint1_1Start.getTime() + 1 * 60 * 60 * 1000), checked: new Date(sprint1_1Start.getTime() + 2 * 24 * 60 * 60 * 1000), executors: [project1Participants[1].user], createdBy: project1Owner },
            { name: 'Implement JWT authentication', desc: 'Set up JWT token generation and validation on backend', backlog: backlog1_2, sprint: sprint1_1, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint1_1Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint1_1Start.getTime() + 3 * 24 * 60 * 60 * 1000), executors: [project1Participants[0].user], createdBy: project1Owner },
            { name: 'User registration flow', desc: 'Complete user registration with email verification', backlog: backlog1_1, sprint: sprint1_1, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint1_1Start.getTime() + 5 * 60 * 60 * 1000), checked: new Date(sprint1_1Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project1Participants[2].user], createdBy: project1Participants[0].user },
            { name: 'Profile page design', desc: 'Design and implement user profile viewing/editing', backlog: backlog1_1, sprint: sprint1_1, status: 'done', difficulty: 'low', priority: 'mid', created: new Date(sprint1_1Start.getTime() + 6 * 60 * 60 * 1000), checked: new Date(sprint1_1Start.getTime() + 7 * 24 * 60 * 60 * 1000), executors: [project1Participants[1].user], createdBy: project1Owner },
            { name: 'Password reset functionality', desc: 'Implement forgot password and reset flow', backlog: backlog1_2, sprint: sprint1_1, status: 'done', difficulty: 'mid', priority: 'mid', created: new Date(sprint1_1Start.getTime() + 8 * 60 * 60 * 1000), checked: new Date(sprint1_1Start.getTime() + 10 * 24 * 60 * 60 * 1000), executors: [project1Participants[0].user], createdBy: project1Participants[0].user },
            
            // Sprint 2 tasks
            { name: 'Account dashboard UI', desc: 'Create main dashboard showing account balances', backlog: backlog1_1, sprint: sprint1_2, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint1_2Start.getTime() + 1 * 60 * 60 * 1000), checked: new Date(sprint1_2Start.getTime() + 4 * 24 * 60 * 60 * 1000), executors: [project1Participants[1].user], createdBy: project1Owner },
            { name: 'Transaction history API', desc: 'Build endpoint for fetching user transaction history', backlog: backlog1_2, sprint: sprint1_2, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint1_2Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint1_2Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project1Participants[0].user], createdBy: project1Participants[0].user },
            { name: 'Transaction filtering', desc: 'Add filters for date range, amount, and transaction type', backlog: backlog1_1, sprint: sprint1_2, status: 'done', difficulty: 'mid', priority: 'mid', created: new Date(sprint1_2Start.getTime() + 3 * 60 * 60 * 1000), checked: new Date(sprint1_2Start.getTime() + 6 * 24 * 60 * 60 * 1000), executors: [project1Participants[2].user], createdBy: project1Owner },
            { name: 'Account details screen', desc: 'Show detailed info for individual accounts', backlog: backlog1_1, sprint: sprint1_2, status: 'done', difficulty: 'low', priority: 'mid', created: new Date(sprint1_2Start.getTime() + 5 * 60 * 60 * 1000), checked: new Date(sprint1_2Start.getTime() + 8 * 24 * 60 * 60 * 1000), executors: [project1Participants[1].user], createdBy: project1Owner },
            { name: 'Export transactions to PDF', desc: 'Allow users to download transaction history as PDF', backlog: backlog1_2, sprint: sprint1_2, status: 'done', difficulty: 'mid', priority: 'low', created: new Date(sprint1_2Start.getTime() + 7 * 60 * 60 * 1000), checked: new Date(sprint1_2Start.getTime() + 11 * 24 * 60 * 60 * 1000), executors: [project1Participants[0].user], createdBy: project1Participants[2].user },

            // Sprint 3 tasks
            { name: 'Transfer money UI', desc: 'Design interface for initiating transfers', backlog: backlog1_1, sprint: sprint1_3, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint1_3Start.getTime() + 1 * 60 * 60 * 1000), checked: new Date(sprint1_3Start.getTime() + 3 * 24 * 60 * 60 * 1000), executors: [project1Participants[1].user], createdBy: project1Owner },
            { name: 'Transfer processing API', desc: 'Backend logic for processing money transfers', backlog: backlog1_2, sprint: sprint1_3, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint1_3Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint1_3Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project1Participants[0].user], createdBy: project1Participants[0].user },
            { name: 'Beneficiary management', desc: 'Save and manage frequently used beneficiaries', backlog: backlog1_1, sprint: sprint1_3, status: 'done', difficulty: 'low', priority: 'mid', created: new Date(sprint1_3Start.getTime() + 4 * 60 * 60 * 1000), checked: new Date(sprint1_3Start.getTime() + 7 * 24 * 60 * 60 * 1000), executors: [project1Participants[2].user], createdBy: project1Owner },
            { name: 'Bill payment integration', desc: 'Integrate with utility companies for bill payments', backlog: backlog1_2, sprint: sprint1_3, status: 'inProgress', difficulty: 'hight', priority: 'high', created: new Date(sprint1_3Start.getTime() + 6 * 60 * 60 * 1000), checked: null, executors: [project1Participants[0].user], createdBy: project1Owner },
            { name: 'Transaction notifications', desc: 'Push notifications for successful/failed transactions', backlog: backlog1_2, sprint: sprint1_3, status: 'toDo', difficulty: 'mid', priority: 'mid', created: new Date(sprint1_3Start.getTime() + 8 * 60 * 60 * 1000), checked: null, executors: [project1Participants[0].user, project1Participants[1].user], createdBy: project1Participants[0].user },

            // Backlog tasks (not in sprint)
            { name: 'Implement biometric authentication', desc: 'Add fingerprint and face recognition login', backlog: backlog1_1, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'mid', created: getRandomDate(sprint1_2Start, sprint1_3Start), checked: null, executors: [], createdBy: project1Owner },
            { name: 'Dark mode support', desc: 'Add dark theme option to the app', backlog: backlog1_1, sprint: null, status: 'toDo', difficulty: 'mid', priority: 'low', created: getRandomDate(sprint1_1Start, sprint1_2Start), checked: null, executors: [], createdBy: project1Participants[1].user },
            { name: 'Multi-currency support', desc: 'Support multiple currencies and conversions', backlog: backlog1_2, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'low', created: getRandomDate(sprint1_2Start, now), checked: null, executors: [], createdBy: project1Participants[0].user },
        ];

        const createdProject1Tasks = [];
        for (const taskData of project1Tasks) {
            const task = new Task({
                name: taskData.name,
                desc: taskData.desc,
                projectId: project1._id,
                isChecked: taskData.checked !== null,
                createdBy: taskData.createdBy._id,
                created: taskData.created,
                checkedDate: taskData.checked,
                executors: taskData.executors.map(e => e._id),
                status: taskData.status,
                difficulty: taskData.difficulty,
                priority: taskData.priority,
                requirements: ''
            });
            await task.save();
            createdProject1Tasks.push({ task, backlog: taskData.backlog, sprint: taskData.sprint });
        }

        // Оновити беклоги та спринти
        for (const backlog of [backlog1_1, backlog1_2]) {
            const backlogTasks = createdProject1Tasks
                .filter(t => t.backlog._id.equals(backlog._id))
                .map(t => t.task._id);
            backlog.tasks = backlogTasks;
            
            const backlogSprints = [...new Set(createdProject1Tasks
                .filter(t => t.backlog._id.equals(backlog._id) && t.sprint)
                .map(t => t.sprint._id.toString()))];
            backlog.sprints = backlogSprints;
            await backlog.save();
        }

        for (const sprint of [sprint1_1, sprint1_2, sprint1_3]) {
            const sprintTasks = createdProject1Tasks
                .filter(t => t.sprint && t.sprint._id.equals(sprint._id))
                .map(t => t.task._id);
            sprint.tasks = sprintTasks;
            await sprint.save();
        }

        console.log(`✅ Project 1 created: ${project1Tasks.length} tasks, 3 sprints, 2 backlogs\n`);

        // Проект 2: AI Content Generator
        console.log('Creating Project 2: AI Content Generator...');
        const project2Owner = users.find(u => u.nickname === 'dlee');
        const project2Start = new Date(twoMonthsAgo);
        project2Start.setDate(project2Start.getDate() + 10);
        
        const project2Participants = [
            { user: users.find(u => u.nickname === 'ogarcia'), rights: { create: true, edit: true, delete: true, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: true } },
            { user: users.find(u => u.nickname === 'rwilson'), rights: { create: true, edit: true, delete: false, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: false } },
            { user: users.find(u => u.nickname === 'dhernandez'), rights: { create: true, edit: false, delete: false, check: true, editParticipants: false, addParticipants: false, editProjectData: false, manageSprints: false } },
        ];

        const project2 = new Project({
            name: 'AI Content Generator',
            created: project2Start,
            lastModified: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // вчора
            owner: project2Owner._id,
            participants: project2Participants.map(p => ({
                participant: p.user._id,
                rights: p.rights
            }))
        });
        await project2.save();

        // Запрошення для проекту 2
        const invite2 = new Invite({
            host: project2Owner._id,
            guest: users.find(u => u.nickname === 'ianderson')._id,
            project: project2._id
        });
        await invite2.save();

        // Беклоги для проекту 2
        const backlog2_1 = new Backlog({
            name: 'Core AI Features',
            tasks: [],
            sprints: [],
            projectId: project2._id
        });
        await backlog2_1.save();

        const backlog2_2 = new Backlog({
            name: 'User Interface',
            tasks: [],
            sprints: [],
            projectId: project2._id
        });
        await backlog2_2.save();

        const backlog2_3 = new Backlog({
            name: 'Infrastructure',
            tasks: [],
            sprints: [],
            projectId: project2._id
        });
        await backlog2_3.save();

        // Спринти для проекту 2
        const sprint2_1Start = new Date(project2Start);
        sprint2_1Start.setDate(sprint2_1Start.getDate() + 3);
        const sprint2_1End = new Date(sprint2_1Start);
        sprint2_1End.setDate(sprint2_1End.getDate() + 14);

        const sprint2_1 = new Sprint({
            name: 'Sprint 1: MVP & OpenAI Integration',
            startDate: sprint2_1Start,
            endDate: sprint2_1End,
            goal: 'Build basic content generation using OpenAI API',
            tasks: []
        });
        await sprint2_1.save();

        const sprint2_2Start = new Date(sprint2_1End);
        sprint2_2Start.setDate(sprint2_2Start.getDate() + 2);
        const sprint2_2End = new Date(sprint2_2Start);
        sprint2_2End.setDate(sprint2_2End.getDate() + 14);

        const sprint2_2 = new Sprint({
            name: 'Sprint 2: Templates & Customization',
            startDate: sprint2_2Start,
            endDate: sprint2_2End,
            goal: 'Add content templates and user customization options',
            tasks: []
        });
        await sprint2_2.save();

        const sprint2_3Start = new Date(sprint2_2End);
        sprint2_3Start.setDate(sprint2_3Start.getDate() + 1);
        const sprint2_3End = new Date(sprint2_3Start);
        sprint2_3End.setDate(sprint2_3End.getDate() + 14);

        const sprint2_3 = new Sprint({
            name: 'Sprint 3: Analytics & Optimization',
            startDate: sprint2_3Start,
            endDate: sprint2_3End,
            goal: 'Track usage metrics and optimize performance',
            tasks: []
        });
        await sprint2_3.save();

        // Таски для проекту 2
        const project2Tasks = [
            // Sprint 1
            { name: 'OpenAI API integration', desc: 'Set up OpenAI API client and authentication', backlog: backlog2_1, sprint: sprint2_1, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint2_1Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint2_1Start.getTime() + 2 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },
            { name: 'Basic prompt engineering', desc: 'Create effective prompts for content generation', backlog: backlog2_1, sprint: sprint2_1, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint2_1Start.getTime() + 3 * 60 * 60 * 1000), checked: new Date(sprint2_1Start.getTime() + 4 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },
            { name: 'Simple web interface', desc: 'Create minimal UI for text input and output', backlog: backlog2_2, sprint: sprint2_1, status: 'done', difficulty: 'low', priority: 'high', created: new Date(sprint2_1Start.getTime() + 5 * 60 * 60 * 1000), checked: new Date(sprint2_1Start.getTime() + 3 * 24 * 60 * 60 * 1000), executors: [project2Participants[1].user], createdBy: project2Owner },
            { name: 'Content type selector', desc: 'Dropdown to select blog post, email, social media, etc.', backlog: backlog2_2, sprint: sprint2_1, status: 'done', difficulty: 'low', priority: 'mid', created: new Date(sprint2_1Start.getTime() + 6 * 60 * 60 * 1000), checked: new Date(sprint2_1Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project2Participants[1].user], createdBy: project2Participants[0].user },
            { name: 'Rate limiting', desc: 'Implement API rate limiting to control costs', backlog: backlog2_3, sprint: sprint2_1, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint2_1Start.getTime() + 8 * 60 * 60 * 1000), checked: new Date(sprint2_1Start.getTime() + 7 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },

            // Sprint 2
            { name: 'Template library', desc: 'Create library of pre-built content templates', backlog: backlog2_1, sprint: sprint2_2, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint2_2Start.getTime() + 1 * 60 * 60 * 1000), checked: new Date(sprint2_2Start.getTime() + 4 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user, project2Participants[2].user], createdBy: project2Owner },
            { name: 'Tone and style options', desc: 'Allow users to customize tone (formal, casual, etc.)', backlog: backlog2_2, sprint: sprint2_2, status: 'done', difficulty: 'mid', priority: 'mid', created: new Date(sprint2_2Start.getTime() + 3 * 60 * 60 * 1000), checked: new Date(sprint2_2Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project2Participants[1].user], createdBy: project2Participants[0].user },
            { name: 'Length control', desc: 'Add word count and length preferences', backlog: backlog2_2, sprint: sprint2_2, status: 'done', difficulty: 'low', priority: 'mid', created: new Date(sprint2_2Start.getTime() + 4 * 60 * 60 * 1000), checked: new Date(sprint2_2Start.getTime() + 6 * 24 * 60 * 60 * 1000), executors: [project2Participants[1].user], createdBy: project2Owner },
            { name: 'Save and load drafts', desc: 'Allow users to save generated content as drafts', backlog: backlog2_2, sprint: sprint2_2, status: 'done', difficulty: 'mid', priority: 'mid', created: new Date(sprint2_2Start.getTime() + 6 * 60 * 60 * 1000), checked: new Date(sprint2_2Start.getTime() + 8 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },
            { name: 'User accounts system', desc: 'Implement user registration and authentication', backlog: backlog2_3, sprint: sprint2_2, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint2_2Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint2_2Start.getTime() + 9 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },

            // Sprint 3
            { name: 'Usage analytics dashboard', desc: 'Track and display user generation statistics', backlog: backlog2_2, sprint: sprint2_3, status: 'done', difficulty: 'mid', priority: 'mid', created: new Date(sprint2_3Start.getTime() + 1 * 60 * 60 * 1000), checked: new Date(sprint2_3Start.getTime() + 5 * 24 * 60 * 60 * 1000), executors: [project2Participants[1].user], createdBy: project2Owner },
            { name: 'Response caching', desc: 'Cache common requests to reduce API calls', backlog: backlog2_3, sprint: sprint2_3, status: 'done', difficulty: 'hight', priority: 'high', created: new Date(sprint2_3Start.getTime() + 2 * 60 * 60 * 1000), checked: new Date(sprint2_3Start.getTime() + 6 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Participants[0].user },
            { name: 'Cost tracking', desc: 'Monitor and report API usage costs', backlog: backlog2_3, sprint: sprint2_3, status: 'done', difficulty: 'mid', priority: 'high', created: new Date(sprint2_3Start.getTime() + 3 * 60 * 60 * 1000), checked: new Date(sprint2_3Start.getTime() + 7 * 24 * 60 * 60 * 1000), executors: [project2Participants[0].user], createdBy: project2Owner },
            { name: 'Performance optimization', desc: 'Optimize response times and loading speeds', backlog: backlog2_3, sprint: sprint2_3, status: 'inProgress', difficulty: 'hight', priority: 'mid', created: new Date(sprint2_3Start.getTime() + 5 * 60 * 60 * 1000), checked: null, executors: [project2Participants[0].user], createdBy: project2Owner },
            { name: 'A/B testing framework', desc: 'Set up framework for testing different prompts', backlog: backlog2_1, sprint: sprint2_3, status: 'toDo', difficulty: 'hight', priority: 'low', created: new Date(sprint2_3Start.getTime() + 7 * 60 * 60 * 1000), checked: null, executors: [project2Participants[0].user], createdBy: project2Participants[0].user },

            // Backlog tasks
            { name: 'Multi-language support', desc: 'Generate content in multiple languages', backlog: backlog2_1, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'mid', created: getRandomDate(sprint2_1Start, sprint2_2Start), checked: null, executors: [], createdBy: project2Owner },
            { name: 'SEO optimization suggestions', desc: 'Provide SEO recommendations for generated content', backlog: backlog2_1, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'mid', created: getRandomDate(sprint2_2Start, sprint2_3Start), checked: null, executors: [], createdBy: project2Participants[2].user },
            { name: 'Export to various formats', desc: 'Export content to PDF, DOCX, HTML, etc.', backlog: backlog2_2, sprint: null, status: 'toDo', difficulty: 'mid', priority: 'low', created: getRandomDate(sprint2_2Start, now), checked: null, executors: [], createdBy: project2Participants[1].user },
            { name: 'Collaboration features', desc: 'Allow team members to collaborate on content', backlog: backlog2_2, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'low', created: getRandomDate(sprint2_3Start, now), checked: null, executors: [], createdBy: project2Owner },
            { name: 'API for third-party integrations', desc: 'Create public API for external tools', backlog: backlog2_3, sprint: null, status: 'toDo', difficulty: 'hight', priority: 'low', created: getRandomDate(sprint2_1Start, sprint2_3Start), checked: null, executors: [], createdBy: project2Participants[0].user },
        ];

        const createdProject2Tasks = [];
        for (const taskData of project2Tasks) {
            const task = new Task({
                name: taskData.name,
                desc: taskData.desc,
                projectId: project2._id,
                isChecked: taskData.checked !== null,
                createdBy: taskData.createdBy._id,
                created: taskData.created,
                checkedDate: taskData.checked,
                executors: taskData.executors.map(e => e._id),
                status: taskData.status,
                difficulty: taskData.difficulty,
                priority: taskData.priority,
                requirements: ''
            });
            await task.save();
            createdProject2Tasks.push({ task, backlog: taskData.backlog, sprint: taskData.sprint });
        }

        // Оновити беклоги та спринти для проекту 2
        for (const backlog of [backlog2_1, backlog2_2, backlog2_3]) {
            const backlogTasks = createdProject2Tasks
                .filter(t => t.backlog._id.equals(backlog._id))
                .map(t => t.task._id);
            backlog.tasks = backlogTasks;
            
            const backlogSprints = [...new Set(createdProject2Tasks
                .filter(t => t.backlog._id.equals(backlog._id) && t.sprint)
                .map(t => t.sprint._id.toString()))];
            backlog.sprints = backlogSprints;
            await backlog.save();
        }

        for (const sprint of [sprint2_1, sprint2_2, sprint2_3]) {
            const sprintTasks = createdProject2Tasks
                .filter(t => t.sprint && t.sprint._id.equals(sprint._id))
                .map(t => t.task._id);
            sprint.tasks = sprintTasks;
            await sprint.save();
        }

        console.log(`✅ Project 2 created: ${project2Tasks.length} tasks, 3 sprints, 3 backlogs\n`);

        console.log('\n🎉 All demo projects created successfully!\n');
        console.log('Summary:');
        console.log('- Mobile Banking App: 18 tasks across 3 sprints');
        console.log('- AI Content Generator: 20 tasks across 3 sprints');
        console.log('\nAll projects span approximately 2 months with realistic dates and progress.');

    } catch (error) {
        console.error('❌ Error seeding projects:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

seedRealisticProjects();
