const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'Users & Products API',
		description: 'Users and Products API'
	},
	host: 'localhost:3000',
	schemes: ['http']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];
		
swaggerAutogen(outputFile, endpointFiles, doc);