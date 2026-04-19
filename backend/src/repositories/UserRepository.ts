import User from '../models/User';

/**
 * Repository for User database operations.
 */
class UserRepository {
  async findByEmail(email: string, selectPassword = false) {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (selectPassword) {
      query.select('+password');
    }
    return query;
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(userData: any) {
    return User.create(userData);
  }
}

export default new UserRepository();
