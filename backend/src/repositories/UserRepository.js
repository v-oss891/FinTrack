const User = require('../models/User');

/**
 * Repository for User database operations.
 * Responsibility: Direct interaction with the User model.
 */
class UserRepository {
  async findByEmail(email, selectPassword = false) {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (selectPassword) {
      query.select('+password');
    }
    return query;
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }
}

module.exports = new UserRepository();
