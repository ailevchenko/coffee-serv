const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const app = express();
const authRouter = require('./Route/authRouter');

const PORT = config.get('port') || 5000;
const mongoUrl = config.get('mongoUrl');

app.use(express.json());
app.use("/api/auth", authRouter);

const start = async () => {
        try {
            await mongoose.connect(mongoUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });

            app.listen(PORT, () => { console.log(`App has been started on port ${PORT}...`) });
        } catch (e) {
            console.error('Server Error...', e.message);
            process.exit(1)
        }
};

start();
