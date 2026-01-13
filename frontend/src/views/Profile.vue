<template>
  <div class="profile">
    <h1>User Profile</h1>
    <p>This is a protected page - only logged-in users can see this. </p>
    
    <div class="profile-info">
      <p><strong>Name:</strong> {{ userName }}</p>
      <p><strong>Email:</strong> {{ userEmail }}</p>
      <p><strong>Joined:</strong> Today</p>
    </div>

    <router-link to="/dashboard" class="btn">Back to Dashboard</router-link>
    <button @click="logout" class="btn-logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      userName:  'User',
      userEmail: 'user@example.com'
    }
  },
  mounted() {
    // Check if user has token
    const token = localStorage. getItem('token');
    if (! token) {
      this.$router.push('/login');
    }
    // For now, show placeholder info
    this.userName = 'User';
    this.userEmail = 'user@example.com';
  },
  methods:  {
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
.profile {
  padding: 50px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 15px;
  font-size:  16px;
}

. profile-info {
  background-color: #f9f9f9;
  padding: 30px;
  border-radius:  8px;
  margin:  30px 0;
  text-align: left;
}

.profile-info p {
  margin-bottom: 15px;
}

.btn,
.btn-logout {
  display: inline-block;
  margin:  10px;
  padding:  10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
}

.btn:hover,
. btn-logout:hover {
  background-color: #0056b3;
}

.btn-logout {
  background-color:  #dc3545;
}

.btn-logout:hover {
  background-color: #c82333;
}
</style>
