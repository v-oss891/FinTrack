const { query } = require('./src/config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  try {
    // Create demo user if not exists
    const hashedPassword = await bcrypt.hash('password', 10);
    await query(`
      INSERT INTO users (id, name, email, password) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, [uuidv4(), 'Demo User', 'demo@example.com', hashedPassword]);

    console.log('Demo user seeded: demo@example.com / password');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();

