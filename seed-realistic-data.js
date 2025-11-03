const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

// Define schemas
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    organisation: String,
    password: { type: String, required: true },
    avatar: {
        data: Buffer,
        contentType: String
    }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    created: { type: Date, required: true },
    lastModified: { type: Date, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true },
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
    name: { type: String, required: true },
    tasks: [mongoose.Types.ObjectId],
    sprints: [mongoose.Types.ObjectId],
    projectId: { type: mongoose.Types.ObjectId, required: true }
});

const sprintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    goal: String,
    tasks: [mongoose.Types.ObjectId]
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

const inviteSchema = new mongoose.Schema({
    host: mongoose.Types.ObjectId,
    guest: mongoose.Types.ObjectId,
    project: mongoose.Types.ObjectId
});

// Helper functions
function getDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function seedRealisticData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB successfully!\n');

        // Get models
        const User = mongoose.model('User', userSchema);
        const Project = mongoose.model('Project', projectSchema);
        const Backlog = mongoose.model('Backlog', backlogSchema);
        const Sprint = mongoose.model('Sprint', sprintSchema);
        const Task = mongoose.model('Task', taskSchema);
        const Invite = mongoose.model('Invite', inviteSchema);

        // Get existing users
        const existingUsers = await User.find({});
        console.log(`📊 Found ${existingUsers.length} existing users\n`);

        // Create Elijah if doesn't exist
        let elijah = await User.findOne({ email: 'elijah.peichev@gmail.com' });
        if (!elijah) {
            console.log('👤 Creating Elijah Peichev...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            elijah = await User.create({
                name: 'Elijah',
                surname: 'Peichev',
                nickname: 'epeichev',
                email: 'elijah.peichev@gmail.com',
                organisation: 'Tech Innovations',
                password: hashedPassword
            });
            console.log('✅ Created Elijah Peichev\n');
        } else {
            console.log('✅ Elijah Peichev already exists\n');
        }

        // Select random users for projects (excluding Elijah)
        const otherUsers = existingUsers.filter(u => u._id.toString() !== elijah._id.toString());
        
        // Clear existing project data for clean start
        console.log('🗑️  Clearing existing project data...');
        await Task.deleteMany({ createdBy: elijah._id });
        await Sprint.deleteMany({});
        await Backlog.deleteMany({ projectId: { $in: (await Project.find({ owner: elijah._id })).map(p => p._id) } });
        await Invite.deleteMany({ host: elijah._id });
        await Project.deleteMany({ owner: elijah._id });
        console.log('✅ Cleared existing data\n');

        // Project 1: E-commerce Platform
        console.log('📁 Creating Project 1: E-commerce Platform...');
        const projectStartDate1 = getDaysAgo(35);
        
        const project1Participants = getRandomElements(otherUsers, 6);
        const project1 = await Project.create({
            name: 'E-commerce Platform Redesign',
            created: projectStartDate1,
            lastModified: getDaysAgo(1),
            owner: elijah._id,
            participants: [
                {
                    participant: elijah._id,
                    rights: {
                        create: true, edit: true, delete: true, check: true,
                        editParticipants: true, addParticipants: true,
                        editProjectData: true, manageSprints: true
                    }
                },
                ...project1Participants.slice(0, 4).map(user => ({
                    participant: user._id,
                    rights: {
                        create: true, edit: true, delete: false, check: true,
                        editParticipants: false, addParticipants: true,
                        editProjectData: false, manageSprints: true
                    }
                }))
            ]
        });

        // Create invites for pending participants
        for (const user of project1Participants.slice(4, 6)) {
            await Invite.create({
                host: elijah._id,
                guest: user._id,
                project: project1._id
            });
        }
        console.log(`✅ Created project with ${project1.participants.length} active participants and ${2} pending invites`);

        // Create backlogs for Project 1
        const backlog1_frontend = await Backlog.create({
            name: 'Frontend Development',
            tasks: [],
            sprints: [],
            projectId: project1._id
        });

        const backlog1_backend = await Backlog.create({
            name: 'Backend API',
            tasks: [],
            sprints: [],
            projectId: project1._id
        });

        const backlog1_design = await Backlog.create({
            name: 'UI/UX Design',
            tasks: [],
            sprints: [],
            projectId: project1._id
        });

        // Sprint 1 - Completed (2 weeks ago)
        const sprint1 = await Sprint.create({
            name: 'Sprint 1: Foundation Setup',
            startDate: getDaysAgo(35),
            endDate: getDaysAgo(21),
            goal: 'Setup project infrastructure and core authentication',
            tasks: []
        });

        // Sprint 1 Tasks - All completed
        const sprint1Tasks = [];
        const taskTemplates1 = [
            { name: 'Setup React project structure', desc: 'Initialize React app with TypeScript and routing', difficulty: 'mid', priority: 'high', backlog: backlog1_frontend },
            { name: 'Configure backend environment', desc: 'Setup Node.js, Express, and MongoDB connection', difficulty: 'mid', priority: 'high', backlog: backlog1_backend },
            { name: 'Implement user authentication', desc: 'JWT-based auth system with login/register', difficulty: 'high', priority: 'high', backlog: backlog1_backend },
            { name: 'Design authentication UI', desc: 'Create login and registration page designs', difficulty: 'low', priority: 'high', backlog: backlog1_design },
            { name: 'Build login page', desc: 'Frontend implementation of login form', difficulty: 'mid', priority: 'high', backlog: backlog1_frontend },
            { name: 'Setup CI/CD pipeline', desc: 'Configure GitHub Actions for automated testing', difficulty: 'high', priority: 'mid', backlog: backlog1_backend },
        ];

        for (const template of taskTemplates1) {
            const executor = getRandomElement(project1.participants.slice(0, 4));
            const createdDate = new Date(getDaysAgo(34));
            const checkedDate = new Date(getDaysAgo(Math.floor(Math.random() * 14) + 21));
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project1._id,
                isChecked: true,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: checkedDate,
                executors: [executor.participant],
                status: 'done',
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            sprint1Tasks.push(task._id);
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }

        sprint1.tasks = sprint1Tasks;
        await sprint1.save();
        
        // Add sprint to all backlogs that have tasks in this sprint
        backlog1_frontend.sprints.push(sprint1._id);
        await backlog1_frontend.save();
        backlog1_backend.sprints.push(sprint1._id);
        await backlog1_backend.save();
        backlog1_design.sprints.push(sprint1._id);
        await backlog1_design.save();
        
        console.log(`✅ Created Sprint 1 with ${sprint1Tasks.length} completed tasks`);
        console.log(`   Sprint ID: ${sprint1._id}`);
        console.log(`   Backlog tasks count: frontend=${backlog1_frontend.tasks.length}, backend=${backlog1_backend.tasks.length}, design=${backlog1_design.tasks.length}`);

        // Sprint 2 - In Progress (current)
        const sprint2 = await Sprint.create({
            name: 'Sprint 2: Product Catalog',
            startDate: getDaysAgo(14),
            endDate: getDaysAgo(-7), // Ends in 7 days
            goal: 'Implement product catalog with search and filtering',
            tasks: []
        });

        const sprint2Tasks = [];
        const taskTemplates2 = [
            { name: 'Design product listing page', desc: 'Create mockups for product grid and list views', difficulty: 'mid', priority: 'high', status: 'done', checked: true, backlog: backlog1_design },
            { name: 'Build product API endpoints', desc: 'CRUD operations for products', difficulty: 'high', priority: 'high', status: 'done', checked: true, backlog: backlog1_backend },
            { name: 'Implement product listing UI', desc: 'Frontend grid component with pagination', difficulty: 'mid', priority: 'high', status: 'inProgress', checked: false, backlog: backlog1_frontend },
            { name: 'Add search functionality', desc: 'Backend search with filters by category, price, etc.', difficulty: 'high', priority: 'high', status: 'inProgress', checked: false, backlog: backlog1_backend },
            { name: 'Create product detail page', desc: 'Show full product information with images', difficulty: 'mid', priority: 'mid', status: 'inProgress', checked: false, backlog: backlog1_frontend },
            { name: 'Implement shopping cart', desc: 'Add to cart functionality with local storage', difficulty: 'mid', priority: 'mid', status: 'toDo', checked: false, backlog: backlog1_frontend },
            { name: 'Setup image upload', desc: 'Product image upload with compression', difficulty: 'high', priority: 'mid', status: 'toDo', checked: false, backlog: backlog1_backend },
        ];

        for (const template of taskTemplates2) {
            const executor = getRandomElement(project1.participants.slice(0, 4));
            const createdDate = new Date(getDaysAgo(13));
            const checkedDate = template.checked ? new Date(getDaysAgo(Math.floor(Math.random() * 7) + 1)) : null;
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project1._id,
                isChecked: template.checked,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: checkedDate,
                executors: [executor.participant],
                status: template.status,
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            sprint2Tasks.push(task._id);
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }

        sprint2.tasks = sprint2Tasks;
        await sprint2.save();
        
        // Add sprint to all backlogs that have tasks in this sprint
        backlog1_frontend.sprints.push(sprint2._id);
        await backlog1_frontend.save();
        backlog1_backend.sprints.push(sprint2._id);
        await backlog1_backend.save();
        backlog1_design.sprints.push(sprint2._id);
        await backlog1_design.save();
        
        console.log(`✅ Created Sprint 2 (current) with ${sprint2Tasks.length} tasks (2 done, 3 in progress, 2 to do)`);

        // Backlog tasks (not in sprint yet)
        const backlogTaskTemplates = [
            { name: 'Implement payment gateway', desc: 'Integrate Stripe for payments', difficulty: 'high', priority: 'high', backlog: backlog1_backend },
            { name: 'Add user reviews', desc: 'Allow users to review products', difficulty: 'mid', priority: 'mid', backlog: backlog1_backend },
            { name: 'Create admin dashboard', desc: 'Admin panel for managing products', difficulty: 'high', priority: 'mid', backlog: backlog1_frontend },
            { name: 'Implement wishlist', desc: 'Save favorite products', difficulty: 'low', priority: 'low', backlog: backlog1_frontend },
            { name: 'Setup email notifications', desc: 'Order confirmation emails', difficulty: 'mid', priority: 'low', backlog: backlog1_backend },
        ];

        for (const template of backlogTaskTemplates) {
            const createdDate = new Date(getDaysAgo(Math.floor(Math.random() * 10) + 5));
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project1._id,
                isChecked: false,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: null,
                executors: [],
                status: 'toDo',
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }
        console.log(`✅ Created ${backlogTaskTemplates.length} backlog tasks (not assigned to sprint)\n`);

        // Project 2: Mobile Fitness App
        console.log('📁 Creating Project 2: Mobile Fitness App...');
        const projectStartDate2 = getDaysAgo(28);
        
        const project2Participants = getRandomElements(otherUsers.filter(u => !project1Participants.includes(u)), 5);
        const project2 = await Project.create({
            name: 'Mobile Fitness Tracking App',
            created: projectStartDate2,
            lastModified: getDaysAgo(2),
            owner: elijah._id,
            participants: [
                {
                    participant: elijah._id,
                    rights: {
                        create: true, edit: true, delete: true, check: true,
                        editParticipants: true, addParticipants: true,
                        editProjectData: true, manageSprints: true
                    }
                },
                ...project2Participants.slice(0, 3).map(user => ({
                    participant: user._id,
                    rights: {
                        create: true, edit: true, delete: false, check: true,
                        editParticipants: false, addParticipants: false,
                        editProjectData: false, manageSprints: false
                    }
                }))
            ]
        });

        // Create invites for pending participants
        for (const user of project2Participants.slice(3, 5)) {
            await Invite.create({
                host: elijah._id,
                guest: user._id,
                project: project2._id
            });
        }
        console.log(`✅ Created project with ${project2.participants.length} active participants and ${2} pending invites`);

        // Create backlogs for Project 2
        const backlog2_mobile = await Backlog.create({
            name: 'Mobile Development',
            tasks: [],
            sprints: [],
            projectId: project2._id
        });

        const backlog2_api = await Backlog.create({
            name: 'Backend Services',
            tasks: [],
            sprints: [],
            projectId: project2._id
        });

        // Sprint 1 - Completed
        const sprint2_1 = await Sprint.create({
            name: 'Sprint 1: Core Features',
            startDate: getDaysAgo(28),
            endDate: getDaysAgo(14),
            goal: 'Build workout tracking and user profile',
            tasks: []
        });

        const sprint2_1Tasks = [];
        const taskTemplates2_1 = [
            { name: 'Setup React Native project', desc: 'Initialize mobile app with navigation', difficulty: 'mid', priority: 'high', backlog: backlog2_mobile },
            { name: 'Create user profile screen', desc: 'Display and edit user information', difficulty: 'low', priority: 'high', backlog: backlog2_mobile },
            { name: 'Build workout logging', desc: 'Log exercises with sets and reps', difficulty: 'high', priority: 'high', backlog: backlog2_mobile },
            { name: 'Implement workout API', desc: 'Store and retrieve workout data', difficulty: 'mid', priority: 'high', backlog: backlog2_api },
        ];

        for (const template of taskTemplates2_1) {
            const executor = getRandomElement(project2.participants.slice(0, 3));
            const createdDate = new Date(getDaysAgo(27));
            const checkedDate = new Date(getDaysAgo(Math.floor(Math.random() * 7) + 14));
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project2._id,
                isChecked: true,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: checkedDate,
                executors: [executor.participant],
                status: 'done',
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            sprint2_1Tasks.push(task._id);
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }

        sprint2_1.tasks = sprint2_1Tasks;
        await sprint2_1.save();
        
        // Add sprint to both backlogs
        backlog2_mobile.sprints.push(sprint2_1._id);
        await backlog2_mobile.save();
        backlog2_api.sprints.push(sprint2_1._id);
        await backlog2_api.save();
        
        console.log(`✅ Created Sprint 1 with ${sprint2_1Tasks.length} completed tasks`);

        // Sprint 2 - Current
        const sprint2_2 = await Sprint.create({
            name: 'Sprint 2: Progress Tracking',
            startDate: getDaysAgo(7),
            endDate: getDaysAgo(-7),
            goal: 'Add charts and progress visualization',
            tasks: []
        });

        const sprint2_2Tasks = [];
        const taskTemplates2_2 = [
            { name: 'Design progress charts', desc: 'Create chart components for weight and reps', difficulty: 'mid', priority: 'high', status: 'done', checked: true, backlog: backlog2_mobile },
            { name: 'Implement progress tracking', desc: 'Track user progress over time', difficulty: 'high', priority: 'high', status: 'inProgress', checked: false, backlog: backlog2_api },
            { name: 'Add exercise library', desc: 'Pre-populated exercise database', difficulty: 'low', priority: 'mid', status: 'toDo', checked: false, backlog: backlog2_api },
        ];

        for (const template of taskTemplates2_2) {
            const executor = getRandomElement(project2.participants.slice(0, 3));
            const createdDate = new Date(getDaysAgo(6));
            const checkedDate = template.checked ? new Date(getDaysAgo(2)) : null;
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project2._id,
                isChecked: template.checked,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: checkedDate,
                executors: [executor.participant],
                status: template.status,
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            sprint2_2Tasks.push(task._id);
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }

        sprint2_2.tasks = sprint2_2Tasks;
        await sprint2_2.save();
        
        // Add sprint to both backlogs
        backlog2_mobile.sprints.push(sprint2_2._id);
        await backlog2_mobile.save();
        backlog2_api.sprints.push(sprint2_2._id);
        await backlog2_api.save();
        
        console.log(`✅ Created Sprint 2 (current) with ${sprint2_2Tasks.length} tasks (1 done, 1 in progress, 1 to do)`);

        // Backlog tasks for Project 2
        const backlogTaskTemplates2 = [
            { name: 'Social features', desc: 'Add friends and workout sharing', difficulty: 'high', priority: 'mid', backlog: backlog2_mobile },
            { name: 'Nutrition tracking', desc: 'Log meals and calories', difficulty: 'high', priority: 'high', backlog: backlog2_mobile },
            { name: 'Achievement system', desc: 'Badges and milestones', difficulty: 'mid', priority: 'low', backlog: backlog2_mobile },
        ];

        for (const template of backlogTaskTemplates2) {
            const createdDate = new Date(getDaysAgo(Math.floor(Math.random() * 5) + 3));
            
            const task = await Task.create({
                name: template.name,
                desc: template.desc,
                projectId: project2._id,
                isChecked: false,
                createdBy: elijah._id,
                created: createdDate,
                checkedDate: null,
                executors: [],
                status: 'toDo',
                difficulty: template.difficulty,
                priority: template.priority,
                requirements: ''
            });
            
            template.backlog.tasks.push(task._id);
            await template.backlog.save();
        }
        console.log(`✅ Created ${backlogTaskTemplates2.length} backlog tasks\n`);

        // Summary
        console.log('🎉 Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   👤 User: Elijah Peichev (${elijah.email})`);
        console.log(`   📁 Projects: 2`);
        console.log(`      1. E-commerce Platform Redesign`);
        console.log(`         - 4 active participants + 2 pending invites`);
        console.log(`         - 2 sprints (1 completed, 1 in progress)`);
        console.log(`         - 18 tasks total (6 done, 3 in progress, 9 to do)`);
        console.log(`      2. Mobile Fitness Tracking App`);
        console.log(`         - 3 active participants + 2 pending invites`);
        console.log(`         - 2 sprints (1 completed, 1 in progress)`);
        console.log(`         - 10 tasks total (5 done, 1 in progress, 4 to do)`);
        console.log(`\n🔑 Login credentials:`);
        console.log(`   Email: elijah.peichev@gmail.com`);
        console.log(`   Password: password123\n`);

        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedRealisticData();
