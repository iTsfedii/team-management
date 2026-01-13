<template>
  <div class="home">
    <h1>Welcome to Team Management</h1>
    <p>Manage your team efficiently</p>
    <router-link to="/login" class="btn">Login</router-link>
    <router-link to="/register" class="btn">Register</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>


<style scoped>
.home {
  text-align: center;
  padding: 50px;
}
.btn {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color:  white;
  text-decoration:  none;
  border-radius:  5px;
}
</style>
