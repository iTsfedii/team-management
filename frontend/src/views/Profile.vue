<template>
  <div class="profile-container">
    <div class="profile-inner">
      <!-- HEADER -->
      <div class="profile-header">
        <h1>👤 My Profile</h1>
        <p class="breadcrumb">Home > Profile</p>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="loading">Loading profile...</div>

      <!-- ERROR STATE -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- SUCCESS MESSAGE -->
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <!-- PROFILE CONTENT -->
      <div v-if="!loading" class="profile-content">
        <!-- EDIT PROFILE SECTION -->
        <div class="profile-section">
          <h2>📝 Edit Profile</h2>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label>Full Name</label>
              <input 
                v-model="profileData.name" 
                type="text" 
                placeholder="Enter your full name"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input 
                v-model="profileData.email" 
                type="email" 
                placeholder="Enter your email"
              />
            </div>

            <div class="form-group">
              <label>Role</label>
              <input 
                v-model="profileData.role" 
                type="text" 
                disabled
                class="disabled-input"
              />
            </div>

            <div class="form-group">
              <label>Status</label>
              <input 
                v-model="profileData.status" 
                type="text" 
                disabled
                class="disabled-input"
              />
            </div>

            <button type="submit" class="btn-save" :disabled="savingProfile">
              {{ savingProfile ? 'Saving...' : '💾 Save Changes' }}
            </button>
          </form>
        </div>

        <!-- CHANGE PASSWORD SECTION -->
        <div class="profile-section">
          <h2>🔐 Change Password</h2>
          
          <form @submit.prevent="changePassword" class="profile-form">
            <div class="form-group">
              <label>Current Password</label>
              <input 
                v-model="passwordData.currentPassword" 
                type="password" 
                placeholder="Enter current password"
                required
              />
            </div>

            <div class="form-group">
              <label>New Password</label>
              <input 
                v-model="passwordData.newPassword" 
                type="password" 
                placeholder="Enter new password (min 6 characters)"
                required
              />
              <small class="password-hint">Must be at least 6 characters</small>
            </div>

            <div class="form-group">
              <label>Confirm Password</label>
              <input 
                v-model="passwordData.confirmPassword" 
                type="password" 
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" class="btn-change-password" :disabled="changingPassword">
              {{ changingPassword ? 'Changing...' : '🔄 Change Password' }}
            </button>
          </form>
        </div>

        <!-- USER INFO DISPLAY -->
        <div class="profile-section">
          <h2>ℹ️ Account Information</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Email</label>
              <p>{{ user.email }}</p>
            </div>

            <div class="info-item">
              <label>Role</label>
              <p class="role-badge" :class="user.role">{{ user.role.toUpperCase() }}</p>
            </div>

            <div class="info-item">
              <label>Status</label>
              <p class="status-badge" :class="user.status">{{ user.status }}</p>
            </div>

            <div class="info-item">
              <label>Member Since</label>
              <p>{{ formatDate(user.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      user: {
        name: '',
        email: '',
        role: '',
        status: '',
        createdAt: null
      },
      profileData: {
        name: '',
        email: '',
        role: '',
        status: ''
      },
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: true,
      error: '',
      successMessage: '',
      savingProfile: false,
      changingPassword: false
    }
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.user = data.user || data;
          this.profileData = {
            name: this.user.name,
            email: this.user.email,
            role: this.user.role,
            status: this.user.status
          };
        } else {
          this.error = 'Failed to load profile';
        }
      } catch (err) {
        this.error = 'Error: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile() {
      if (!this.profileData.name || !this.profileData.email) {
        this.error = 'Please fill in all fields';
        return;
      }

      this.savingProfile = true;
      this.error = '';
      this.successMessage = '';

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.profileData.name,
            email: this.profileData.email
          })
        });

        if (response.ok) {
          const data = await response.json();
          this.user = data.user || data;
          this.successMessage = '✅ Profile updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          const error = await response.json();
          this.error = error.message || 'Failed to update profile';
        }
      } catch (err) {
        this.error = 'Error: ' + err.message;
      } finally {
        this.savingProfile = false;
      }
    },

    async changePassword() {
      // Validation
      if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
        this.error = 'Please fill in all password fields';
        return;
      }

      if (this.passwordData.newPassword.length < 6) {
        this.error = 'New password must be at least 6 characters';
        return;
      }

      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      this.changingPassword = true;
      this.error = '';
      this.successMessage = '';

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/change-password', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword
          })
        });

        if (response.ok) {
          this.successMessage = '✅ Password changed successfully!';
          // Clear password fields
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          const error = await response.json();
          this.error = error.message || 'Failed to change password';
        }
      } catch (err) {
        this.error = 'Error: ' + err.message;
      } finally {
        this.changingPassword = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

.profile-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header h1 {
  color: #1F2937;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.breadcrumb {
  color: #6B7280;
  font-size: 1rem;
  margin: 0;
}

.loading, .error, .success {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.loading {
  color: #3B82F6;
}

.error {
  color: #7F1D1D;
  background-color: #FEE2E2;
  border: 2px solid #FCA5A5;
}

.success {
  color: #065F46;
  background-color: #D1FAE5;
  border: 2px solid #6EE7B7;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.profile-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  color: #1F2937;
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.profile-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #1F2937;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px;
  border: 2px solid #D1D5DB;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled,
.disabled-input {
  background-color: #F3F4F6;
  color: #6B7280;
  cursor: not-allowed;
}

.password-hint {
  color: #6B7280;
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn-save, .btn-change-password {
  padding: 12px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-save:hover:not(:disabled) {
  background-color: #2563EB;
  transform: translateY(-2px);
}

.btn-change-password:hover:not(:disabled) {
  background-color: #2563EB;
  transform: translateY(-2px);
}

.btn-save:disabled, .btn-change-password:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  padding: 15px;
  background-color: #F9FAFB;
  border-radius: 5px;
  border-left: 4px solid #3B82F6;
}

.info-item label {
  color: #3B82F6;
  font-weight: bold;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 8px;
}

.info-item p {
  color: #1F2937;
  font-size: 1.1rem;
  margin: 0;
}

.role-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.role-badge.admin {
  background-color: #FEE2E2;
  color: #7F1D1D;
}

.role-badge.employee {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.role-badge.intern {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  background-color: #FEF3C7;
  color: #92400E;
}

@media (max-width: 768px) {
  .profile-inner {
    padding: 20px 15px;
  }

  .profile-header h1 {
    font-size: 1.8rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>
