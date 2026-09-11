require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/database');

async function createAdmin() {
  try {
    const email = 'admin@ratingplatform.com';
    const password = 'Admin@123';
    const name = 'Super Admin User Account';
    const role = 'admin';
    const address = 'Admin Office';

    // Check if admin already exists
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      // Update password for existing admin
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password = ?, role = ? WHERE email = ?', [hashedPassword, role, email]);
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, address]
      );
      console.log('✅ Admin user created! ID:', result.insertId);
    }

    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('   Email   : admin@ratingplatform.com');
    console.log('   Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
