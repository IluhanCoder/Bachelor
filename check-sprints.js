const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

async function checkSprints() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get both projects
        const ecommerce = await db.collection('projects').findOne({ name: 'E-commerce Platform Redesign' });
        const fitness = await db.collection('projects').findOne({ name: 'Mobile Fitness Tracking App' });

        console.log('📁 E-commerce Platform Redesign:');
        if (ecommerce) {
            const backlogs = await db.collection('backlogs').find({ projectId: ecommerce._id }).toArray();
            console.log(`  Backlogs: ${backlogs.length}`);
            
            for (const backlog of backlogs) {
                console.log(`\n  Backlog: ${backlog.name}`);
                console.log(`    Tasks: ${backlog.tasks.length}`);
                console.log(`    Sprints: ${backlog.sprints.length}`);
                
                if (backlog.sprints.length > 0) {
                    for (const sprintId of backlog.sprints) {
                        const sprint = await db.collection('sprints').findOne({ _id: sprintId });
                        if (sprint) {
                            console.log(`\n    Sprint: ${sprint.name}`);
                            console.log(`      Start: ${sprint.startDate}`);
                            console.log(`      End: ${sprint.endDate}`);
                            console.log(`      Goal: ${sprint.goal}`);
                            console.log(`      Tasks in sprint: ${sprint.tasks ? sprint.tasks.length : 0}`);
                            
                            // Check tasks
                            if (sprint.tasks && sprint.tasks.length > 0) {
                                const tasks = await db.collection('tasks').find({ _id: { $in: sprint.tasks } }).toArray();
                                console.log(`      Tasks found: ${tasks.length}`);
                                const completedTasks = tasks.filter(t => t.isChecked);
                                const totalSP = tasks.reduce((sum, t) => {
                                    const sp = t.difficulty === 'low' ? 1 : t.difficulty === 'mid' ? 2 : t.difficulty === 'high' ? 3 : 0;
                                    return sum + sp;
                                }, 0);
                                const completedSP = completedTasks.reduce((sum, t) => {
                                    const sp = t.difficulty === 'low' ? 1 : t.difficulty === 'mid' ? 2 : t.difficulty === 'high' ? 3 : 0;
                                    return sum + sp;
                                }, 0);
                                console.log(`      Completed tasks: ${completedTasks.length}/${tasks.length}`);
                                console.log(`      Total SP: ${totalSP}, Completed SP: ${completedSP}`);
                            }
                        }
                    }
                }
            }
        }

        console.log('\n\n📁 Mobile Fitness Tracking App:');
        if (fitness) {
            const backlogs = await db.collection('backlogs').find({ projectId: fitness._id }).toArray();
            console.log(`  Backlogs: ${backlogs.length}`);
            
            for (const backlog of backlogs) {
                console.log(`\n  Backlog: ${backlog.name}`);
                console.log(`    Tasks: ${backlog.tasks.length}`);
                console.log(`    Sprints: ${backlog.sprints.length}`);
                
                if (backlog.sprints.length > 0) {
                    for (const sprintId of backlog.sprints) {
                        const sprint = await db.collection('sprints').findOne({ _id: sprintId });
                        if (sprint) {
                            console.log(`\n    Sprint: ${sprint.name}`);
                            console.log(`      Start: ${sprint.startDate}`);
                            console.log(`      End: ${sprint.endDate}`);
                            console.log(`      Tasks in sprint: ${sprint.tasks ? sprint.tasks.length : 0}`);
                            
                            if (sprint.tasks && sprint.tasks.length > 0) {
                                const tasks = await db.collection('tasks').find({ _id: { $in: sprint.tasks } }).toArray();
                                console.log(`      Tasks found: ${tasks.length}`);
                                const completedTasks = tasks.filter(t => t.isChecked);
                                const totalSP = tasks.reduce((sum, t) => {
                                    const sp = t.difficulty === 'low' ? 1 : t.difficulty === 'mid' ? 2 : t.difficulty === 'high' ? 3 : 0;
                                    return sum + sp;
                                }, 0);
                                const completedSP = completedTasks.reduce((sum, t) => {
                                    const sp = t.difficulty === 'low' ? 1 : t.difficulty === 'mid' ? 2 : t.difficulty === 'high' ? 3 : 0;
                                    return sum + sp;
                                }, 0);
                                console.log(`      Completed: ${completedTasks.length}/${tasks.length}`);
                                console.log(`      Total SP: ${totalSP}, Completed SP: ${completedSP}`);
                            }
                        }
                    }
                }
            }
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSprints();
