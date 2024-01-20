const mongoose = require('mongoose');

const connectDB = async (uri) => {
    mongoose.set('strictQuery', true);
    try {
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host} Database: ${conn.connection.name}`);

    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB