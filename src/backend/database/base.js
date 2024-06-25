import mongoose from 'mongoose';
import {DBInfo, PostgresDBInfo} from '../config/configs.js'
import pg from 'pg'


const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(DBInfo.url, {
                dbName: DBInfo.dbname,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('Connected to MongoDB');
        } else {
            console.log('Already connected to MongoDB');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

const closeDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        } else {
            console.log('MongoDB connection is already closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

const clearDB = async () => {
    try {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

class PostgresDatabase {
    constructor() {
        const {Client} = pg
        this.client = new Client({
            user: PostgresDBInfo.user,
            host: PostgresDBInfo.host,
            database: PostgresDBInfo.database,
            password: PostgresDBInfo.password,
            port: PostgresDBInfo.port,
        });
        this.isConnected = false;
    }

    async connect() {
        try {
            if (!this.isConnected) {
                await this.client.connect();
                this.isConnected = true;
                console.log('Connected to the database');
                this.client.on('end', () => {
                    this.isConnected = false;
                    console.log('Database connection ended');
                });
                this.client.on('error', async (err) => {
                    console.error('Database connection error:', err);
                    this.isConnected = false;
                    await this.reconnect(); // Attempt to reconnect
                });
            }else {
                console.log('Already connected to the database');
            }
        } catch (err) {
            console.error('Error connecting to the database:', err);
        }
    }
    async reconnect() {
        console.log('Attempting to reconnect to the database...');
        try {
            await this.connect();
        } catch (err) {
            console.error('Error reconnecting to the database:', err);
            setTimeout(() => this.reconnect(), 5000);
        }
    }

    async close() {
        try {
            await this.client.end();
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database connection:', err);
        }
    }
}


export {connectDB, closeDB, clearDB, PostgresDatabase};
