import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:  { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:  { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name:  'Dashboard',
    component:  Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ROUTE GUARD - Protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    // Route needs login
    if (token) {
      // User has token → Allow ✅
      next();
    } else {
      // No token → Go to login ❌
      next('/login');
    }
  } else {
    // Public route → Allow ✅
    next();
  }
});

export default router;
