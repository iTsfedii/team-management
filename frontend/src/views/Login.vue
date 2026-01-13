<template>
  <div class="login-container">
    <div class="overlay"></div>

    <div class="login-box">
      <div class="login-content">
        <h2>Sign in</h2>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <form @submit.prevent="login">
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@email.com"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" :disabled="loading" class="btn-login">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <p class="register-link">
          No account?
          <router-link to="/register">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.$router.push('/dashboard')
        } else {
          this.error = data.message || 'Login failed'
        }
      } catch (err) {
        this.error = 'Error ' + err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Full page background stays */
.login-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

/* Modern overlay: gradient + subtle dark */
.overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 500px at 20% 20%, rgba(99, 102, 241, 0.35), transparent 60%),
    radial-gradient(700px 450px at 85% 80%, rgba(37, 99, 235, 0.25), transparent 55%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.35), rgba(2, 6, 23, 0.75));
}

/*
  Make it NOT only centered:
  - Form sits on the RIGHT side
  - Full height layout
*/
.login-box{
  position: relative;
  z-index: 1;
  width: min(520px, 92vw);
  padding: 24px;

  /* add these to center it */
  margin: 0 auto;
}

/* Modern glass card */
.login-content {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 40px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45),
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
}

.login-content h2 {
  text-align: left;
  margin: 0 0 22px;
  color: #ffffff;
  font-size: 28px;
  letter-spacing: -0.02em;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(226, 232, 240, 0.9); /* modern light slate */
  font-size: 13px;
  font-weight: 600;
}

/* Inputs: no yellow, modern border + focus ring */
.form-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: #ffffff;

  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}

.form-group input::placeholder {
  color: rgba(165, 180, 252, 0.85);
}

.form-group input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.75);
  background: rgba(2, 6, 23, 0.50);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.22);
}

/* Button: modern gradient */
.btn-login {
  width: 100%;
  padding: 12px 14px;
  margin-top: 10px;
  border-radius: 12px;
  border: none;

  background: linear-gradient(135deg, #6366f1, #2563eb);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  transition: transform .05s ease, filter .15s ease;
}

.btn-login:hover { filter: brightness(1.06); }
.btn-login:active { transform: translateY(1px); }

.btn-login:disabled {
  background: rgba(148, 163, 184, 0.35);
  cursor: not-allowed;
  filter: none;
}

/* Error */
.error {
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
  border: 1px solid rgba(239, 68, 68, 0.25);
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 18px;
}

/* Links */
.register-link {
  text-align: left;
  margin-top: 18px;
  color: rgba(199, 210, 254, 0.95);
  font-size: 14px;
}

.register-link a {
  color: #a5b4fc;
  font-weight: 700;
  text-decoration: none;
}

.register-link a:hover {
  color: #c7d2fe;
  text-decoration: underline;
}

/* Mobile: bring it back to center and full width */
@media (max-width: 900px) {
  .login-box {
    width: 100%;
    margin-left: 0;
    padding: 18px;
  }

  .login-content {
    max-width: 520px;
    padding: 30px 20px;
  }

  .login-content h2 {
    font-size: 1.6rem;
  }
}
</style>
