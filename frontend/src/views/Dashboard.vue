<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome, {{ userName }}!</p>
    <p>This is a protected page - only logged-in users can see this. </p>
    <button @click="logout" class="btn-logout">Logout</button>
    <router-link to="/profile" class="btn">Go to Profile</router-link>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userName: 'User'
    }
  },
  mounted() {
    // Get user info from localStorage or API
    const token = localStorage.getItem('token');
    if (! token) {
      this.$router.push('/login');
    }
    // For now, just show "User"
    this.userName = 'User';
  },
  methods: {
    logout() {
      // Delete token from localStorage
      localStorage.removeItem('token');
      // Redirect to login
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 50px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
  font-size: 16px;
}

.btn-logout,
.btn {
  display: inline-block;
  margin:  10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration:  none;
  cursor: pointer;
  font-weight: bold;
}

.btn-logout:hover,
.btn:hover {
  background-color: #0056b3;
}

. btn-logout {
  background-color:  #dc3545;
}

.btn-logout:hover {
  background-color: #c82333;
}
</style>
