<template>
  <div class="admin-container">
    <div class="admin-inner">
      <!-- HEADER -->
      <div class="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Manage users, tasks, and intern applications</p>
      </div>

      <!-- TABS -->
      <div class="admin-tabs">
        <button 
          @click="activeTab = 'tasks'" 
          :class="{ active: activeTab === 'tasks' }" 
          class="tab-button"
        >
          📋 Tasks
        </button>
        <button 
          @click="activeTab = 'users'" 
          :class="{ active: activeTab === 'users' }" 
          class="tab-button"
        >
          👥 Users
        </button>
        <button 
          @click="activeTab = 'interns'" 
          :class="{ active: activeTab === 'interns' }" 
          class="tab-button"
        >
          🎓 Intern Applications
        </button>
      </div>

      <!-- TASKS TAB -->
      <div v-if="activeTab === 'tasks'" class="tab-content">
        <h2>📋 Task Management</h2>
        
        <div v-if="loadingTasks" class="loading">Loading tasks...</div>
        <div v-if="errorTasks" class="error">{{ errorTasks }}</div>

        <div v-if="!loadingTasks && tasks.length === 0" class="no-data">No tasks yet</div>

        <div v-if="!loadingTasks && tasks.length > 0" class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks" :key="task._id">
                <td>{{ task.title }}</td>
                <td>{{ task.assignedToName || 'Unknown' }}</td>
                <td><span class="priority-badge" :class="task.priority">{{ task.priority }}</span></td>
                <td><span class="status-badge" :class="task.completed ? 'done' : 'pending'">{{ task.completed ? 'Completed' : 'Pending' }}</span></td>
                <td>{{ formatDate(task.dueDate) }}</td>
                <td>
                  <button @click="deleteTask(task._id)" class="btn-delete" :disabled="deletingTask">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- USERS TAB -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <h2>👥 User Management</h2>
        
        <div v-if="loadingUsers" class="loading">Loading users...</div>
        <div v-if="errorUsers" class="error">{{ errorUsers }}</div>

        <div v-if="!loadingUsers && users.length === 0" class="no-data">No users yet</div>

        <div v-if="!loadingUsers && users.length > 0" class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="role-badge" :class="user.role">{{ user.role }}</span></td>
                <td><span class="status-badge" :class="user.status">{{ user.status }}</span></td>
                <td>{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- INTERNS TAB -->
      <div v-if="activeTab === 'interns'" class="tab-content">
        <h2>🎓 Intern Applications</h2>
        
        <div v-if="loadingInterns" class="loading">Loading applications...</div>
        <div v-if="errorInterns" class="error">{{ errorInterns }}</div>

        <div v-if="!loadingInterns && internApplications.length === 0" class="no-data">No pending applications</div>

        <div v-if="!loadingInterns && internApplications.length > 0" class="interns-grid">
          <div v-for="app in internApplications" :key="app._id" class="intern-card">
            <div class="intern-card-header">
              <h3>{{ app.name }}</h3>
              <span class="status-badge pending">{{ app.status }}</span>
            </div>

            <div class="intern-details">
              <p><strong>📧 Email:</strong> {{ app.email }}</p>
              <p><strong>📅 Applied:</strong> {{ formatDate(app.createdAt) }}</p>
              <p><strong>💬 Motivation:</strong></p>
              <p class="motivation-text">{{ app.motivation }}</p>
            </div>

            <div class="intern-actions">
              <button @click="approveIntern(app._id, app.email, app.name)" class="btn-approve" :disabled="approvingIntern">
                {{ approvingIntern ? 'Approving...' : '✅ Approve' }}
              </button>
              <button @click="rejectIntern(app._id)" class="btn-reject" :disabled="rejectingIntern">
                {{ rejectingIntern ? 'Rejecting...' : '❌ Reject' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      activeTab: 'tasks',
      tasks: [],
      users: [],
      internApplications: [],
      loadingTasks: true,
      loadingUsers: true,
      loadingInterns: true,
      errorTasks: '',
      errorUsers: '',
      errorInterns: '',
      deletingTask: false,
      approvingIntern: false,
      rejectingIntern: false
    }
  },
  mounted() {
    this.fetchTasks();
    this.fetchUsers();
    this.fetchInternApplications();
  },
  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.tasks = data.tasks || [];
        } else {
          this.errorTasks = 'Failed to load tasks';
        }
      } catch (err) {
        this.errorTasks = 'Error: ' + err.message;
      } finally {
        this.loadingTasks = false;
      }
    },

    async fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.users = data.users || [];
        } else {
          this.errorUsers = 'Failed to load users';
        }
      } catch (err) {
        this.errorUsers = 'Error: ' + err.message;
      } finally {
        this.loadingUsers = false;
      }
    },

    async fetchInternApplications() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/intern-applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.internApplications = data.applications || [];
        } else {
          this.errorInterns = 'Failed to load applications';
        }
      } catch (err) {
        this.errorInterns = 'Error: ' + err.message;
      } finally {
        this.loadingInterns = false;
      }
    },

    async deleteTask(taskId) {
      if (!confirm('Are you sure you want to delete this task?')) return;

      this.deletingTask = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const index = this.tasks.findIndex(t => t._id === taskId);
          if (index !== -1) {
            this.tasks.splice(index, 1);
          }
          alert('Task deleted successfully');
        } else {
          alert('Failed to delete task');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        this.deletingTask = false;
      }
    },

    async approveIntern(appId, email, name) {
      this.approvingIntern = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/intern-applications/${appId}/approve`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, name })
        });

        if (response.ok) {
          const index = this.internApplications.findIndex(app => app._id === appId);
          if (index !== -1) {
            this.internApplications.splice(index, 1);
          }
          alert(`✅ ${name} approved! Credentials sent to ${email}`);
        } else {
          const error = await response.json();
          alert('Error: ' + (error.message || 'Failed to approve'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        this.approvingIntern = false;
      }
    },

    async rejectIntern(appId) {
      if (!confirm('Are you sure you want to reject this application?')) return;

      this.rejectingIntern = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/intern-applications/${appId}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const index = this.internApplications.findIndex(app => app._id === appId);
          if (index !== -1) {
            this.internApplications.splice(index, 1);
          }
          alert('❌ Application rejected');
        } else {
          alert('Failed to reject application');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        this.rejectingIntern = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
}
</script>

<style scoped>
.admin-container {
  width: 100%;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

.admin-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.admin-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  color: #1F2937;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.admin-header p {
  color: #6B7280;
  font-size: 1.1rem;
  margin: 0;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 24px;
  background-color: white;
  color: #6B7280;
  border: 2px solid #D1D5DB;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: #3B82F6;
  color: #3B82F6;
}

.tab-button.active {
  background-color: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.tab-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-content h2 {
  color: #1F2937;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.loading, .error, .no-data {
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
}

.loading {
  color: #3B82F6;
}

.error {
  color: #7F1D1D;
  background-color: #FEE2E2;
  border: 2px solid #FCA5A5;
}

.no-data {
  color: #6B7280;
  background-color: #F9FAFB;
}

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead {
  background-color: #F3F4F6;
}

.admin-table th {
  padding: 15px;
  text-align: left;
  color: #1F2937;
  font-weight: bold;
  border-bottom: 2px solid #D1D5DB;
}

.admin-table td {
  padding: 15px;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.admin-table tbody tr:hover {
  background-color: #F9FAFB;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
}

.priority-badge.high {
  background-color: #FEE2E2;
  color: #7F1D1D;
}

.priority-badge.medium {
  background-color: #FEF3C7;
  color: #92400E;
}

.priority-badge.low {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
}

.status-badge.done {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-badge.pending {
  background-color: #FEF3C7;
  color: #92400E;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
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

.btn-delete {
  padding: 6px 12px;
  background-color: #EF4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-delete:hover:not(:disabled) {
  background-color: #DC2626;
}

.btn-delete:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.interns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.intern-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.intern-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
  border-color: #3B82F6;
}

.intern-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.intern-card-header h3 {
  color: #1F2937;
  margin: 0;
  font-size: 1.2rem;
}

.intern-details {
  margin-bottom: 20px;
}

.intern-details p {
  color: #6B7280;
  margin: 8px 0;
  font-size: 0.95rem;
}

.intern-details strong {
  color: #1F2937;
}

.motivation-text {
  background-color: #F9FAFB;
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid #3B82F6;
  margin-top: 10px !important;
  line-height: 1.6;
}

.intern-actions {
  display: flex;
  gap: 10px;
}

.btn-approve, .btn-reject {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-approve {
  background-color: #10B981;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background-color: #059669;
}

.btn-reject {
  background-color: #EF4444;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background-color: #DC2626;
}

.btn-approve:disabled, .btn-reject:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-inner {
    padding: 20px 15px;
  }

  .admin-header h1 {
    font-size: 1.8rem;
  }

  .admin-tabs {
    gap: 5px;
  }

  .tab-button {
    flex: 1;
    font-size: 0.9rem;
  }

  .admin-table {
    font-size: 0.9rem;
  }

  .admin-table th, .admin-table td {
    padding: 10px;
  }

  .interns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
