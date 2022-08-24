const config = {
    dev: true,
    baseUrl: '127.0.0.1',
    port: {
        api: 11500,
    },
    mysql: {
        master: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '12345678',
            database: 'GameJam',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true,
        },
    },
    redis: {
        sessionStore: {
            host: '127.0.0.1',
            port: 36379,
            db: 0,
        },
        gen: {
            host: '127.0.0.1',
            port: 36379,
            db: 0,
        },
        user: {
            host: '127.0.0.1',
            port: 36379,
            db: 0,
        },
    },
};

module.exports = config;
