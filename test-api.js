const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elijahpeichev_db_user:Aill1525@backlogs.p0zsawe.mongodb.net/test?retryWrites=true&w=majority';

// Copy the exact aggregation pipeline from project-service.ts
const fullLookUp = [
  {
    $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'ownerInfo'
    }
  },
  {
    $unwind: {
      path: '$participants',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'participants.participant',
      foreignField: '_id',
      as: 'participantsInfo'
    }
  },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      created: { $first: '$created' },
      lastModified: { $first: '$lastModified' },
      owner: { $first: '$ownerInfo' },
      participants: {
        $push: {
          participant: { $arrayElemAt: ['$participantsInfo', 0] },
          rights: '$participants.rights'
        }
      },
      tasks: { $first: '$tasks' }
    }
  },
  {
    $addFields: {
      participants: {
        $filter: {
          input: '$participants',
          as: 'p',
          cond: { $ne: ['$$p.participant', null] }
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      created: 1,
      lastModified: 1,
      owner: { $arrayElemAt: ['$owner', 0] },
      participants: 1
    }
  }
];

async function testAPI() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Test E-commerce project
        const ecommerce = await db.collection('projects').findOne({ name: 'E-commerce Platform Redesign' });
        
        console.log('📁 Testing E-commerce project aggregation:\n');
        
        const result = await db.collection('projects').aggregate([
            {
                $match: {
                    _id: ecommerce._id
                }
            },
            ...fullLookUp
        ]).toArray();

        console.log('Result:', JSON.stringify(result[0], null, 2));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testAPI();
