/**
 * auth.ts — QuickServIndia Role-Based Authentication System
 *
 * ROLE-BASED AUTHENTICATION:
 * ─────────────────────────────────────────────
 * This system supports three user roles:
 * 1. Customer - Regular users who book services
 * 2. Provider - Service providers who offer services
 * 3. Admin - System administrators with full access
 *
 * Each role has different fields and access levels.
 * Passwords are hashed using a simple hash function (for demo purposes).
 * In production, use bcrypt or similar on the backend.
 */

export type UserRole = "customer" | "provider" | "admin";

export interface BaseUser {
  id?: number; // Optional ID from backend
  name: string;
  email: string;
  password: string; // Hashed password
  role: UserRole;
  createdAt: string;
}

export interface Customer extends BaseUser {
  role: "customer";
  phone: string;
  location: string;
}

export interface Provider extends BaseUser {
  role: "provider";
  businessName: string;
  serviceCategory: string;
  location: string;
  phone: string;
}

export interface Admin extends BaseUser {
  role: "admin";
  adminKey: string; // Secret key for admin verification
}

export type User = Customer | Provider | Admin;

const USERS_KEY = "qs_users";
const SESSION_KEY = "qs_session";
const ADMIN_SECRET_KEY = "QUICKSERV_ADMIN_2024"; // Secret key for admin registration

/** Simple hash function for demo purposes */
function hashPassword(password: string): string {
  // In production, use bcrypt or similar on backend
  // This is a simple hash for demonstration
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hashed_${Math.abs(hash).toString(16)}_${password.length}`;
}

/** Verify hashed password */
function verifyPassword(inputPassword: string, hashedPassword: string): boolean {
  return hashPassword(inputPassword) === hashedPassword;
}

/** Read all registered users from localStorage */
export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Save the full users array back to localStorage */
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Check if an email is already registered */
export function emailExists(email: string): boolean {
  return getUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Register a new customer */
export function registerCustomer(
  name: string,
  email: string,
  phone: string,
  password: string,
  location: string
): string | null {
  // Validation
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!email.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!phone.trim()) return "Phone number is required.";
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) return "Enter a valid 10-digit phone number.";
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!location.trim()) return "Location is required.";
  if (emailExists(email)) return "This email is already registered. Please login.";

  const users = getUsers();
  const customer: Customer = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    role: "customer",
    phone: phone.trim(),
    location: location.trim(),
    createdAt: new Date().toISOString()
  };
  users.push(customer);
  saveUsers(users);
  return null; // null = success
}

/** Register a new service provider */
export function registerProvider(
  name: string,
  businessName: string,
  serviceCategory: string,
  location: string,
  email: string,
  phone: string,
  password: string
): string | null {
  // Validation
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!businessName.trim()) return "Business name is required.";
  if (!serviceCategory.trim()) return "Service category is required.";
  if (!location.trim()) return "Location is required.";
  if (!email.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!phone.trim()) return "Phone number is required.";
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) return "Enter a valid 10-digit phone number.";
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (emailExists(email)) return "This email is already registered. Please login.";

  const users = getUsers();
  const provider: Provider = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    role: "provider",
    businessName: businessName.trim(),
    serviceCategory: serviceCategory.trim(),
    location: location.trim(),
    phone: phone.trim(),
    createdAt: new Date().toISOString()
  };
  users.push(provider);
  saveUsers(users);
  return null; // null = success
}

/** Register a new admin (requires secret key) */
export function registerAdmin(
  name: string,
  email: string,
  password: string,
  adminKey: string
): string | null {
  // Validation
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!email.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!adminKey.trim()) return "Admin key is required.";
  if (adminKey !== ADMIN_SECRET_KEY) return "Invalid admin key. Access denied.";
  if (emailExists(email)) return "This email is already registered. Please login.";

  const users = getUsers();
  const admin: Admin = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    role: "admin",
    adminKey: adminKey,
    createdAt: new Date().toISOString()
  };
  users.push(admin);
  saveUsers(users);
  return null; // null = success
}

/** Login — returns the user on success or an error string */
export function loginUser(email: string, password: string): User | string {
  if (!email.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!password) return "Password is required.";

  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!user) return "Incorrect email or password. Please try again.";
  
  // Verify password
  if (!verifyPassword(password, user.password)) {
    return "Incorrect email or password. Please try again.";
  }

  // Save session with role
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, role: user.role }));
  return user;
}

/** Get the currently logged-in user (null if not logged in) */
export function getCurrentUser(): User | null {
  // First check if we have API-stored user data
  const apiUserData = localStorage.getItem("qs_user");
  if (apiUserData) {
    try {
      const userData = JSON.parse(apiUserData);
      // Convert API user data to User format
      const users = getUsers();
      const user = users.find((u) => u.email === userData.email);
      if (user) {
        // Merge the ID from API data
        return { ...user, id: userData.id };
      }
    } catch {
      // Fall through to session check
    }
  }
  
  // Fallback to session data
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  
  try {
    const { email } = JSON.parse(sessionData);
    return getUsers().find((u) => u.email === email) ?? null;
  } catch {
    return null;
  }
}

/** Check if user has specific role */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/** Get user's role */
export function getUserRole(): UserRole | null {
  const user = getCurrentUser();
  return user?.role ?? null;
}

/** Log out */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("qs_token");
  localStorage.removeItem("qs_user");
}

/** Get dashboard route based on role */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/dashboard";
    case "provider":
      return "/provider-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/login";
  }
}

/** Get all users by role (admin only) */
export function getUsersByRole(role: UserRole): User[] {
  if (!hasRole("admin")) return [];
  return getUsers().filter(u => u.role === role);
}

/** Get statistics (admin only) */
export function getStatistics() {
  if (!hasRole("admin")) return null;
  
  const users = getUsers();
  return {
    totalUsers: users.length,
    customers: users.filter(u => u.role === "customer").length,
    providers: users.filter(u => u.role === "provider").length,
    admins: users.filter(u => u.role === "admin").length
  };
}
