<template>
  <div id="app">
    <!-- ===== NAVBAR WITH LOGO ===== -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- LOGO -->
        <div class="nav-logo-section">
          <router-link to="/" class="nav-logo-text">Team Management</router-link>
        </div>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          
          <!-- BEFORE LOGIN -->
          <router-link 
            v-if="!isLoggedIn" 
            to="/login" 
            class="nav-link"
          >
            Login
          </router-link>
          
          <router-link 
            v-if="!isLoggedIn" 
            to="/register" 
            class="nav-link"
          >
            Register
          </router-link>

          <router-link 
            v-if="!isLoggedIn" 
            to="/intern-application" 
            class="nav-link intern-link"
          >
            🎓 Apply as Intern
          </router-link>
          
          <!-- AFTER LOGIN -->
          <router-link 
            v-if="isLoggedIn" 
            to="/dashboard" 
            class="nav-link"
          >
            Dashboard
          </router-link>
          
          <router-link v-if="isLoggedIn" to="/profile" class="nav-link">
            Profile
          </router-link>

          <!-- ADMIN ONLY -->
          <router-link 
            v-if="isLoggedIn && isAdmin" 
            to="/admin" 
            class="nav-link admin-link"
          >
            ⚙ Admin Panel
          </router-link>

          <!-- LOGOUT BUTTON -->
          <button 
            v-if="isLoggedIn" 
            @click="logout" 
            class="nav-link btn-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ===== MAIN CONTENT ===== -->
    <main>
      <router-view />
    </main>

    <!-- ===== FOOTER WITH SLOGAN ===== -->
    <footer class="footer">
      <p class="slogan">La vie est émotions</p>
      <p class="copyright">&copy; 2026 Telecom Tunisia. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    }
  },
  mounted() {
    this.checkAuth();
    // Check auth when storage changes (logout from another tab)
    window.addEventListener('storage', this.checkAuth);
    // Check auth after each route change
    this.$router.afterEach(() => {
      this.checkAuth();
    });
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuth);
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('=== checkAuth called ===');
      console.log('Token exists:', !!token);
      console.log('User string:', userStr);
      
      // Set isLoggedIn based on token
      this.isLoggedIn = !!token;
      
      // Reset isAdmin
      this.isAdmin = false;

      if (userStr && token) {
        try {
          const userData = JSON.parse(userStr);
          console.log('Parsed user:', userData);
          console.log('User role:', userData.role);
          
          // Check if role is exactly 'admin'
          if (userData.role === 'admin') {
            this.isAdmin = true;
            console.log('✅✅✅ SET isAdmin TO TRUE ✅✅✅');
          } else {
            console.log('❌ Role is not admin, it is:', userData.role);
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
          this.isAdmin = false;
        }
      } else {
        console.log('❌ No user string or token found');
      }
      
      console.log('Final state - isLoggedIn:', this.isLoggedIn, 'isAdmin:', this.isAdmin);
      console.log('=== checkAuth end ===');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== NAVBAR ===== */
.navbar {
  background: linear-gradient(135deg, #1E88E5 0%, #26C6DA 25%, #66BB6A 50%, #FDD835 75%, #FF9800 100%);
  padding: 0;
  position: sticky;
  top: 0;
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
  border-bottom: 3px solid #FF9800;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* ===== LOGO SECTION ===== */
.nav-logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.nav-logo-section:hover {
  transform: scale(1.05);
}

.nav-logo-img {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.nav-logo-text {
  color: #FFFFFF;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-logo-text:hover {
  color: #FDD835;
}

/* ===== NAV MENU ===== */
.nav-menu {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: #FFFFFF;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* INTERN LINK STYLING */
.intern-link {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #FFFFFF;
  color: #1E88E5;
  font-weight: bold;
}

.intern-link:hover {
  background-color: #FFFFFF;
  color: #FF9800;
  border-color: #FF9800;
}

/* ADMIN LINK STYLING */
.admin-link {
  background-color: #EF4444;
  color: white;
  border: 2px solid #DC2626;
  font-weight: bold;
}

.admin-link:hover {
  background-color: #DC2626;
  color: white;
}

/* LOGOUT BUTTON STYLING */
.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #FFFFFF;
  color: #FF9800;
  transform: translateY(-2px);
}

/* ===== MAIN CONTENT ===== */
main {
  flex: 1;
}

/* ===== FOOTER ===== */
.footer {
  background: linear-gradient(135deg, #1E88E5 0%, #26C6DA 25%, #66BB6A 50%, #FDD835 75%, #FF9800 100%);
  color: #FFFFFF;
  text-align: center;
  padding: 30px 20px;
  margin-top: auto;
  border-top: 3px solid #26C6DA;
  box-shadow: 0 -4px 12px rgba(30, 136, 229, 0.3);
}

.slogan {
  font-size: 1.3rem;
  font-style: italic;
  font-weight: bold;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.copyright {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
    height: auto;
    padding: 15px 20px;
  }

  .nav-logo-section {
    width: 100%;
    justify-content: center;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-logo-text {
    font-size: 1.2rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 6px 10px;
  }

  .slogan {
    font-size: 1.1rem;
  }

  .footer {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .nav-logo-img {
    height: 40px;
  }

  .nav-logo-text {
    font-size: 1rem;
  }

  .nav-menu {
    gap: 10px;
  }

  .nav-link {
    padding: 5px 8px;
    font-size: 0.8rem;
  }
}
</style>
