export const databaseConfig = {
    uri: process.env.MONGODB_URI,
    options: {
        connectTimeoutMs: 10000,
        socketTimeoutMS: 45000,
    },
};

