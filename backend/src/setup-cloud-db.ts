import { config } from 'dotenv';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

config();

async function setupDatabase() {
    console.log('🔧 Setting up Neon database...');
    console.log(`📍 Host: ${process.env.DATABASE_HOST}`);
    console.log(`📍 Database: ${process.env.DATABASE_NAME}`);
    console.log('');

    const client = new Client({
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('✅ Connected to Neon database');

        // Read and execute init-db.sql
        const sqlPath = path.join(__dirname, '..', 'db', 'init-db.sql');

        if (!fs.existsSync(sqlPath)) {
            console.error('❌ init-db.sql not found at:', sqlPath);
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log('📝 Running database schema...');
        console.log('   - Creating tables...');
        console.log('   - Setting up Row-Level Security...');
        console.log('   - Creating indexes...');
        console.log('   - Inserting default tenant...');

        await client.query(sql);

        console.log('');
        console.log('✅ Database schema created successfully!');
        console.log('');
        console.log('🎉 Next steps:');
        console.log('   1. Run: npm run seed');
        console.log('   2. Run: npm run start:dev');
        console.log('');
    } catch (error: any) {
        console.error('❌ Error setting up database:');
        console.error(error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
