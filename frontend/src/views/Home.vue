k<template>
  <div class="home">
    <div class="overlay"></div>
    <div class="home-content">
      <h1>Welcome to Team Management</h1>
      <p>Manage your team efficiently</p>
      <div class="button-group">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/register" class="btn">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-image: url('/telecom.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Modern overlay with gradient */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.75));
}

.home-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 50px 20px;
  max-width: 800px;
}

.home-content h1 {
  font-size: 3rem;
  color: #FFFFFF;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;
}

.home-content p {
  font-size: 1.5rem;
  color: rgba(226, 232, 240, 0.95);
  margin-bottom: 40px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #6366F1, #2563EB);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
}

.btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .home-content h1 {
    font-size: 2rem;
  }

  .home-content p {
    font-size: 1.2rem;
  }

  .btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>
