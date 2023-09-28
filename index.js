const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use('/auth', authRouter)

const start = async() => {
    try {
        await mongoose.connect(`mongodb+srv://ruslansagitov93:root@auth-cluster.qbi2ymz.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log('The server started on PORT - ', PORT))
    } catch (e) {
        console.log('start error', e);
    }
}

start();