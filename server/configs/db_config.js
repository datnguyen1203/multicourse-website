var config = require("./configs");
const mongoose = require("mongoose");
const seedCategories = require('../seeders/seedCategories');

const url = config.databaseUrl;
const connect = mongoose.connect(url);
connect.then(
    async (db) => {
        console.log("Connected correctly to server");
        await seedCategories();
    },
    (err) => {
        console.log(err);
    }
);
