/**
 * API entry point.
 *
 * - VITE_API_URL set   -> talk to the real Waracle Store backend (monorepo).
 * - VITE_API_URL unset -> use the bundled in-browser mock, so the web app runs
 *   fully standalone with no backend required.
 *
 * Both expose the same get/post interface, so nothing else in the app changes.
 */
import mockApi from './mockApi';
import httpApi from './httpApi';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const api = API_URL ? httpApi : mockApi;

export default api;
