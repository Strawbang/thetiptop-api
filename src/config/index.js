require('dotenv').config({ path: __dirname + '/../../.env' });

const configs = {
    initialisation: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        host: process.env.HOST,
        timezone: 'Europe/Paris',
        port: 3306,
        dialect: process.env.DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
            timezone: 'local',
        },
        pool: {
            max: 10,
            min: 0,
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
        },
        secret: process.env.SECRET_KEY,
        logging: false,
    },
    development: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        host: process.env.HOST,
        timezone: 'Europe/Paris',
        port: 3306,
        dialect: process.env.DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
            timezone: 'local',
            compress: true,
            // maxAllowedPacket: 16777216,
            // maxAllowedPacket: 1073741824,
        },
        pool: {
            max: parseInt(process.env.POOL_MAX, 10),
            min: parseInt(process.env.POOL_MIN, 10),
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
        },
        secret: process.env.SECRET_KEY,
        logging: (...msg) => false,
        benchmark: true,
        logQueryParameters: true,
    },
    test: {
        username: 'root',
        password: 'Dsp8908Archi',
        database: 'thetiptop_dev',
        // host: 'localhost:3306',
        timezone: 'Europe/Paris',
        port: 3306,
        dialect: 'mariadb',
        dialectOptions: {
            bigNumberStrings: true,
            timezone: 'local',
        },
        secret: '8WDU29PMm0',
    },
    production: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB,
        host: process.env.HOST,
        timezone: 'Europe/Paris',
        port: process.env.PORTDB,
        dialect: process.env.DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
            timezone: 'local',
            // ssl: {
            //     ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
            // }
        },
        pool: {
            max: parseInt(process.env.POOL_MAX, 10),
            min: parseInt(process.env.POOL_MIN, 10),
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE,
        },
        secret: process.env.SECRET_KEY,
        logging: false,
    },
};

const getConfig = () => {
    const config = configs[process.env.ENV];
    return config;
};

module.exports = getConfig();
