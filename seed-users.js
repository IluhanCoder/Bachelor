const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DB_CONN = "mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?appName=Backlogs";

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    nickname: { type: String, required: true, unique: true },
    organisation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const testUsers = [
    {
        name: "Daniel",
        surname: "Hernandez",
        nickname: "dhernandez",
        organisation: "CloudWorks",
        email: "dhernandez@example.com",
        password: "password123"
    },
    {
        name: "Sarah",
        surname: "Johnson",
        nickname: "sjohnson",
        organisation: "TechCorp",
        email: "sjohnson@example.com",
        password: "password123"
    },
    {
        name: "Michael",
        surname: "Chen",
        nickname: "mchen",
        organisation: "DevSolutions",
        email: "mchen@example.com",
        password: "password123"
    },
    {
        name: "Emma",
        surname: "Williams",
        nickname: "ewilliams",
        organisation: "CloudWorks",
        email: "ewilliams@example.com",
        password: "password123"
    },
    {
        name: "James",
        surname: "Brown",
        nickname: "jbrown",
        organisation: "TechCorp",
        email: "jbrown@example.com",
        password: "password123"
    },
    {
        name: "Sofia",
        surname: "Martinez",
        nickname: "smartinez",
        organisation: "InnovateLab",
        email: "smartinez@example.com",
        password: "password123"
    },
    {
        name: "David",
        surname: "Lee",
        nickname: "dlee",
        organisation: "DevSolutions",
        email: "dlee@example.com",
        password: "password123"
    },
    {
        name: "Olivia",
        surname: "Garcia",
        nickname: "ogarcia",
        organisation: "CloudWorks",
        email: "ogarcia@example.com",
        password: "password123"
    },
    {
        name: "Robert",
        surname: "Wilson",
        nickname: "rwilson",
        organisation: "InnovateLab",
        email: "rwilson@example.com",
        password: "password123"
    },
    {
        name: "Isabella",
        surname: "Anderson",
        nickname: "ianderson",
        organisation: "TechCorp",
        email: "ianderson@example.com",
        password: "password123"
    }
];

async function seedUsers() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_CONN);
        console.log('Connected successfully!');

        // Видалити існуючих користувачів
        console.log('Clearing existing users...');
        await User.deleteMany({});
        console.log('Existing users cleared.');

        // Хешувати паролі та додати користувачів
        console.log('Creating test users...');
        for (const userData of testUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            console.log(`Created user: ${userData.nickname}`);
        }

        console.log('\n✅ Successfully created all test users!');
        console.log(`Total users created: ${testUsers.length}`);
        
        // Показати створених користувачів
        const users = await User.find({}, 'nickname email organisation');
        console.log('\nCreated users:');
        users.forEach(user => {
            console.log(`- ${user.nickname} (${user.email}) - ${user.organisation}`);
        });

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

seedUsers();
