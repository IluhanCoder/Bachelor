const axios = require('axios');

async function testPrediction() {
    try {
        // Get projects first
        const projectsResponse = await axios.get('http://localhost:5001/projects');
        console.log('Available projects:');
        projectsResponse.data.forEach(p => {
            console.log(`- ${p.name} (${p._id})`);
        });

        // Test with first project
        if (projectsResponse.data.length > 0) {
            const projectId = projectsResponse.data[0]._id;
            console.log(`\nTesting prediction for project: ${projectsResponse.data[0].name}`);
            
            const predictionResponse = await axios.post('http://localhost:5001/analytics/predict-ratio', {
                projectId: projectId,
                userId: undefined
            });

            console.log('\nPrediction results:');
            console.log(JSON.stringify(predictionResponse.data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testPrediction();
