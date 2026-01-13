<template>
  <div id="app">
    <!-- ===== NAVBAR WITH LOGO ===== -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- LOGO -->
        <div class="nav-logo-section">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tunisie_Telecom_logo.svg/1200px-Tunisie_Telecom_logo.svg.png" alt="Telecom Tunisia Logo" class="nav-logo-img" />
          <router-link to="/" class="nav-logo-text">Team Management</router-link>
        </div>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          
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

    <!-- ===== MAIN CONTENT ===== -->
    <main>
      <router-view />
    </main>

    <!-- ===== FOOTER WITH SLOGAN ===== -->
    <footer class="footer">
      <p class="slogan">La vie est émotions</p>
      <p class="copyright">&copy; 2026 Telecom Tunisia.  All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name:  'App',
  data() {
    return {
      isLoggedIn:  false
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.$router.afterEach(() => {
      this.checkLoginStatus();
    });
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage. getItem('token');
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
  font-family:  'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== NAVBAR ===== */
.navbar {
  background: linear-gradient(135deg, #FFFFFF 0%, #F7E1B5 100%);
  padding: 0;
  position: sticky;
  top: 0;
  box-shadow: 0 4px 12px rgba(152, 95, 13, 0.15);
  border-bottom: 3px solid #FFEC00;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding:  0 20px;
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

. nav-logo-text {
  color: #985F0D;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-logo-text:hover {
  color: #FFEC00;
}

/* ===== NAV MENU ===== */
.nav-menu {
  display: flex;
  gap: 15px;
  align-items:  center;
}

.nav-link {
  color: #985F0D;
  text-decoration: none;
  padding:  8px 15px;
  border-radius:  5px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
}

. nav-link:hover {
  background-color: #FFEC00;
  color:  #985F0D;
  transform:  translateY(-2px);
}

.btn-logout {
  background-color: #985F0D;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #FFEC00;
  color: #985F0D;
  transform: translateY(-2px);
}

/* ===== MAIN CONTENT ===== */
main {
  flex: 1;
}

/* ===== FOOTER ===== */
.footer {
  background-color: #985F0D;
  color:  #FFFFFF;
  text-align: center;
  padding: 30px 20px;
  margin-top: auto;
  border-top: 3px solid #FFEC00;
}

.slogan {
  font-size: 1.3rem;
  font-style: italic;
  font-weight: bold;
  margin:  0 0 10px 0;
  letter-spacing: 1px;
}

.copyright {
  font-size: 0.9rem;
  margin:  0;
  opacity: 0.9;
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
    font-size:  1.1rem;
  }

  . footer {
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
    font-size:  0.8rem;
  }
}
</style>
