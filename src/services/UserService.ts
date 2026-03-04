// UserService.ts

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  gender?: string;
  age?: number;
}

const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

class UserService {
  // =============================
  // Private Helpers
  // =============================

  private getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // =============================
  // Public API Methods
  // =============================

  // Register
  register(userData: Omit<User, 'id'>): { success: boolean; message: string } {
    const users = this.getUsers();

    const existingUser = users.find(
      (u) => u.username === userData.username
    );

    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Đăng ký thành công' };
  }

  // Login
  login(username: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return { success: false, message: 'Sai tên tài khoản hoặc mật khẩu' };
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, message: 'Đăng nhập thành công', user };
  }
  // Logout
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Get current logged in user
  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Update password
  updatePassword(userId: string, newPassword: string): { success: boolean; message: string } {
    const users = this.getUsers();

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    users[userIndex].password = newPassword;

    this.saveUsers(users);

    // update current user session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));

    return { success: true, message: 'Password updated successfully' };
  }

  // Get all users (optional)
  getAllUsers(): User[] {
    return this.getUsers();
  }

  // Update user info
updateUser(
  userId: string,
  updatedData: Partial<Pick<User, "name" | "gender" | "age">>
): { success: boolean; message: string; user?: User } {
  const users = this.getUsers();

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, message: "User not found" };
  }
  // Update allowed fields only
  users[userIndex] = {
    ...users[userIndex],
    ...updatedData,
  };
  this.saveUsers(users);
  // Update current logged in user session
  const currentUser = this.getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(users[userIndex])
    );
  }
  return {
    success: true,
    message: "Cập nhật thông tin thành công",
    user: users[userIndex],
  };
}
}

export default new UserService();