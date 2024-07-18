/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 *available to both logged in and logged out users
 *
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 * available to only logged out users
 *
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * Special case so we dont block anyone
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * WE ALWAYS WANT TO ALLOW THESE ROUTES
 * @type {string}
 *
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 *
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
