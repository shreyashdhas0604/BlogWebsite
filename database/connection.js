const mongoose = require('mongoose');

// const connectionString = `${process.env.MONGO_URI}`;

async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

module.exports = { connectdb };