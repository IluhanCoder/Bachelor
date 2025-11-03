const mongoose = require('mongoose');

const DB_CONN = "mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?appName=Backlogs";

const projectSchema = new mongoose.Schema({
    name: String,
    created: Date,
    lastModified: Date,
    owner: mongoose.Types.ObjectId,
    participants: [{
        participant: mongoose.Types.ObjectId,
        rights: Object
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

const Project = mongoose.model('Project', projectSchema);
const Backlog = mongoose.model('Backlog', backlogSchema);
const Task = mongoose.model('Task', taskSchema);
const Sprint = mongoose.model('Sprint', sprintSchema);
const Invite = mongoose.model('Invite', inviteSchema);

async function cleanDemoProjects() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_CONN);
        console.log('Connected successfully!\n');

        // Знайти проекти для видалення
        const projectsToDelete = await Project.find({
            name: { $in: ['Mobile Banking App', 'AI Content Generator'] }
        });

        console.log(`Found ${projectsToDelete.length} demo projects to delete\n`);

        for (const project of projectsToDelete) {
            console.log(`Deleting project: ${project.name}`);
            
            // Видалити всі таски проекту
            const deletedTasks = await Task.deleteMany({ projectId: project._id });
            console.log(`  - Deleted ${deletedTasks.deletedCount} tasks`);

            // Видалити беклоги та їх спринти
            const backlogs = await Backlog.find({ projectId: project._id });
            let totalSprints = 0;
            for (const backlog of backlogs) {
                if (backlog.sprints && backlog.sprints.length > 0) {
                    const deletedSprints = await Sprint.deleteMany({ _id: { $in: backlog.sprints } });
                    totalSprints += deletedSprints.deletedCount;
                }
            }
            console.log(`  - Deleted ${totalSprints} sprints`);

            const deletedBacklogs = await Backlog.deleteMany({ projectId: project._id });
            console.log(`  - Deleted ${deletedBacklogs.deletedCount} backlogs`);

            // Видалити запрошення
            const deletedInvites = await Invite.deleteMany({ project: project._id });
            console.log(`  - Deleted ${deletedInvites.deletedCount} invites`);

            // Видалити сам проект
            await Project.deleteOne({ _id: project._id });
            console.log(`  ✅ Project deleted\n`);
        }

        console.log('🎉 Cleanup completed!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

cleanDemoProjects();
