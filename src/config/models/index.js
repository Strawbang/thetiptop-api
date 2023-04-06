const path = require('path');
const db = require('./modelAssociation');
const Seed = require('../seeders');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

console.log('----------- ENV -----------');
console.log(`ENV : ${process.env.ENV}`);

if (process.env.ENV === 'production') {
    db.sequelize.sync({ alter: true }).then(() => {
        console.log('Database already up to date !');
    }).catch((e) => {
        console.log(e);
    });
} else if (process.env.ENV === 'initialisation') {
    db.sequelize.sync({ force: true }).then(() => Seed()).catch((e) => {
        console.log(e);
    });
} else if (process.env.ENV == 'test') {
    console.log('Mock env test');
}
console.log('---------------------------');
