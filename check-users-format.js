const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://iluhannn:Qazwsx123@cluster0.yj5ks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function checkUsers() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const database = client.db('test');
        const users = database.collection('users');
        
        // Get all users
        const allUsers = await users.find({}).toArray();
        
        console.log(`\nTotal users: ${allUsers.length}\n`);
        console.log('='.repeat(80));
        
        allUsers.forEach((user, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(JSON.stringify(user, null, 2));
            console.log('='.repeat(80));
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkUsers();
