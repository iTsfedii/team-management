<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">Team Management</router-link>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          
          <router-link 
            v-if="! isLoggedIn" 
            to="/login" 
            class="nav-link"
          >
            Login
          </router-link>
          
          <router-link 
            v-if="! isLoggedIn" 
            to="/register" 
            class="nav-link"
          >
            Register
          </router-link>
          
          <router-link 
            v-if="isLoggedIn" 
            to="/dashboard" 
            class="nav-link"
          >
            Dashboard
          </router-link>
          
          <router-link 
            v-if="isLoggedIn" 
            to="/profile" 
            class="nav-link"
          >
            Profile
          </router-link>
          
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

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn:  false
    }
  },
  mounted() {
    this.checkLoginStatus();
    // Check every time route changes
    this.$router.afterEach(() => {
      this.checkLoginStatus();
    });
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !! token;
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
#app {
  font-family:  Arial, sans-serif;
  color: #333;
}

.navbar {
  background-color: #007bff;
  padding: 0;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display:  flex;
  justify-content:  space-between;
  align-items: center;
}

. nav-logo {
  color: white;
  font-size: 24px;
  font-weight:  bold;
  text-decoration:  none;
  padding: 15px 0;
}

.nav-logo:hover {
  color: #e0e0e0;
}

.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding:  8px 12px;
  border-radius:  4px;
  transition:  background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-logout {
  background-color: #dc3545;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius:  4px;
  font-weight: bold;
}

.btn-logout:hover {
  background-color: #c82333;
}

main {
  min-height: calc(100vh - 60px);
}
</style>
