// Run database migration to add missing columns
const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
    const client = new Client({
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Migration SQL
        const migrations = [
            `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS block_reason_category TEXT`,
            `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS block_reason_text VARCHAR(120)`,
            `ALTER TABLE daily_check_ins ADD COLUMN IF NOT EXISTS helper_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
        ];

        for (const sql of migrations) {
            console.log(`Running: ${sql.substring(0, 60)}...`);
            await client.query(sql);
            console.log('✓ Success');
        }

        console.log('\n✅ All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
