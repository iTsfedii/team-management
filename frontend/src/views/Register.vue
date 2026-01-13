<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-content">
        <h2>Register</h2>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="success" class="success">
          {{ success }}
        </div>

        <form @submit.prevent="register">
          <div class="form-group">
            <label>Full Name</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" :disabled="loading" class="btn-register">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      name:  '',
      email: '',
      password: '',
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async register() {
      this.error = ''
      this.success = ''
      this.loading = true

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name:  this.name,
            email: this.email,
            password: this.password
          })
        })

        const data = await response.json()

        if (response.ok) {
          this.success = 'Registration successful!  Redirecting to login...'
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.error = data.message || 'Registration failed'
        }
      } catch (err) {
        this.error = 'Error: ' + err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 50%, #1E40AF 100%);
}

.register-box {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.register-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 10px;
  box-shadow:  0 8px 32px rgba(0, 0, 0, 0.3);
  border-left: 5px solid #3B82F6;
}

.register-content h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #1F2937;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display:  block;
  margin-bottom:  8px;
  color:  #1F2937;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #3B82F6;
  border-radius: 5px;
  background-color: #F0F9FF;
}

.form-group input:focus {
  outline: none;
  border-color: #1E40AF;
  background-color: #FFFFFF;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.btn-register {
  width: 100%;
  padding: 12px;
  background-color: #3B82F6;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-register:not(:disabled):hover {
  background-color: #1E40AF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-register:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.error {
  color: #7F1D1D;
  background-color:  #FEE2E2;
  border: 2px solid #FCA5A5;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.success {
  color: #065F46;
  background-color: #DCFCE7;
  border:  2px solid #86EFAC;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #4B5563;
}

.login-link a {
  color: #3B82F6;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #1E40AF;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .register-content {
    padding: 30px 20px;
  }

  .register-content h2 {
    font-size: 1.5rem;
  }
}
</style>
