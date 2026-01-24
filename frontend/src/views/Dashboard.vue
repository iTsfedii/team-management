<template>
  <div class="dashboard-container">
    <!-- WELCOME SECTION -->
    <div class="welcome-section">
      <h1>Welcome, {{ user.name }}!  👋</h1>
      <p class="role-badge" :class="user.role">{{ user.role. toUpperCase() }}</p>
    </div>

    <!-- USER INFO SECTION -->
    <div class="user-info-section">
      <div class="info-card">
        <h3>📧 Email</h3>
        <p>{{ user.email }}</p>
      </div>
      <div class="info-card">
        <h3>👤 Role</h3>
        <p>{{ user.role }}</p>
      </div>
      <div class="info-card">
        <h3>📊 Total Tasks</h3>
        <p>{{ tasks.length }}</p>
      </div>
      <div class="info-card">
        <h3>✅ Completed</h3>
        <p>{{ completedTasks }}</p>
      </div>
    </div>

    <!-- TASKS SECTION -->
    <div class="tasks-section">
      <div class="section-header">
        <h2>📋 Your Tasks</h2>
        <button v-if="user.role === 'admin'" @click="showModal = true" class="btn-add-task">
          + Add New Task
        </button>
      </div>

      <div v-if="loading" class="loading">Loading tasks...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="! loading && tasks.length === 0" class="no-tasks">No tasks yet!  🎉</div>

      <div v-if="!loading && tasks.length > 0" class="tasks-list">
        <div v-for="task in tasks" :key="task._id" class="task-card" :class="task.completed ? 'completed' :  ''">
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="priority-badge" :class="task.priority">{{ task.priority }}</span>
          </div>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-details">
            <span class="due-date">📅 Due: {{ formatDate(task.dueDate) }}</span>
            <span class="status-task" :class="task.completed ? 'done' : 'pending'">
              {{ task.completed ? '✅ Completed' : '⏳ Pending' }}
            </span>
          </div>
          <button v-if="! task.completed && user.role !== 'admin'" @click="completeTask(task._id)" class="btn-complete" :disabled="completing">
            {{ completing ? 'Marking.. .' : 'Mark as Complete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- PROGRESS SECTION -->
    <div v-if="tasks.length > 0" class="progress-section">
      <h3>Task Completion Progress</h3>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="progress-text">{{ completedTasks }} / {{ tasks.length }} completed</p>
    </div>

    <!-- MODAL FOR CREATING TASK -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Task</h2>
          <button class="btn-close" @click="showModal = false">&times;</button>
        </div>

        <form @submit.prevent="createTask" class="task-form">
          <div class="form-group">
            <label>Task Title *</label>
            <input v-model="newTask.title" type="text" placeholder="Enter task title" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newTask.description" placeholder="Enter description" rows="4"></textarea>
          </div>

          <div class="form-group">
            <label>Assign To *</label>
            <select v-model="newTask.assignedTo" required>
              <option value="">Select a user... </option>
              <option v-for="employee in employees" :key="employee._id" :value="employee._id">
                {{ employee.name }} ({{ employee.role }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Priority *</label>
            <select v-model="newTask.priority" required>
              <option value="">Select priority... </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="form-group">
            <label>Due Date *</label>
            <input v-model="newTask.dueDate" type="date" required />
          </div>

          <div class="form-buttons">
            <button type="button" @click="showModal = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit" :disabled="creatingTask">
              {{ creatingTask ? 'Creating...' :  'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      user: {
        name: '',
        email: '',
        role: ''
      },
      tasks: [],
      employees: [],
      loading: true,
      error: '',
      completing: false,
      showModal:  false,
      creatingTask: false,
      newTask: {
        title: '',
        description: '',
        assignedTo: '',
        priority:  '',
        dueDate: ''
      }
    }
  },
  computed: {
    completedTasks() {
      return this. tasks.filter(task => task. completed).length;
    },
    progressPercentage() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasks / this.tasks.length) * 100);
    }
  },
  mounted() {
    this.fetchUserProfile();
    this.fetchUserTasks();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers:  {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.user = data. user || data;
          
          if (this.user.role === 'admin') {
            this. fetchEmployees();
          }
        } else {
          this.error = 'Failed to fetch profile';
        }
      } catch (err) {
        this.error = 'Error:  ' + err.message;
      }
    },

    async fetchUserTasks() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks/my-tasks', {
          headers:  {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            this.tasks = data;
          } else if (data.tasks) {
            this.tasks = data.tasks;
          } else {
            this.tasks = [];
          }
          
          console.log('Tasks loaded:', this.tasks);
        } else {
          this.error = 'Failed to fetch tasks';
        }
      } catch (err) {
        this.error = 'Error: ' + err. message;
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployees() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.employees = data.users ?  data.users. filter(u => u.role !== 'admin') : [];
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (err) {
        console.error('Error:', err. message);
      }
    },

    async createTask() {
      if (!this.newTask.title || !this.newTask.assignedTo || !this.newTask.priority || !this.newTask.dueDate) {
        alert('Please fill in all required fields! ');
        return;
      }

      this.creatingTask = true;
      try {
        const token = localStorage. getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newTask)
        });

        if (response.ok) {
          const data = await response.json();
          this.tasks.push(data.task);
          this.showModal = false;
          this. newTask = { title: '', description: '', assignedTo: '', priority: '', dueDate: '' };
          alert('Task created successfully!  ✅');
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create task');
        }
      } catch (err) {
        alert('Error: ' + err. message);
      } finally {
        this.creatingTask = false;
      }
    },

    async completeTask(taskId) {
      this.completing = true;
      try {
        const token = localStorage. getItem('token');
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ completed: true })
        });

        if (response.ok) {
          const taskIndex = this.tasks.findIndex(t => t._id === taskId);
          if (taskIndex !== -1) {
            this. tasks[taskIndex].completed = true;
          }
        } else {
          this.error = 'Failed to update task';
        }
      } catch (err) {
        this.error = 'Error: ' + err.message;
      } finally {
        this.completing = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'No due date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

.dashboard-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow:  0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  color: #1F2937;
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.role-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.role-badge.admin {
  background-color: #FEE2E2;
  color:  #7F1D1D;
}

. role-badge.employee {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.role-badge.intern {
  background-color: #D1FAE5;
  color: #065F46;
}

.user-info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow:  0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3B82F6;
}

.info-card h3 {
  color: #3B82F6;
  margin-bottom: 10px;
  font-size: 1rem;
}

.info-card p {
  color: #1F2937;
  font-size: 1. 3rem;
  font-weight: bold;
  margin:  0;
}

.tasks-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  color: #1F2937;
  font-size: 1.8rem;
  margin: 0;
}

.btn-add-task {
  padding: 10px 20px;
  background-color: #10B981;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-add-task:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.loading, .error, .no-tasks {
  background: white;
  padding: 30px;
  border-radius:  10px;
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

. no-tasks {
  color:  #6B7280;
}

.tasks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.task-card {
  background: white;
  padding:  20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #3B82F6;
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.task-card. completed {
  opacity: 0.7;
  border-left-color: #10B981;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items:  center;
  margin-bottom:  15px;
}

.task-header h3 {
  color:  #1F2937;
  margin: 0;
  font-size: 1.2rem;
}

.priority-badge {
  padding: 4px 12px;
  border-radius:  20px;
  font-weight: bold;
  font-size: 0.8rem;
}

.priority-badge.high {
  background-color: #FEE2E2;
  color:  #7F1D1D;
}

.priority-badge. medium {
  background-color:  #FEF3C7;
  color:  #92400E;
}

.priority-badge.low {
  background-color: #D1FAE5;
  color: #065F46;
}

.task-description {
  color: #6B7280;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.task-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.due-date {
  color: #6B7280;
}

.status-task {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 5px;
}

.status-task.done {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-task.pending {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.btn-complete {
  width: 100%;
  padding:  10px;
  background-color: #10B981;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-complete:hover:not(:disabled) {
  background-color: #059669;
}

.btn-complete:disabled {
  background-color: #9CA3AF;
  cursor:  not-allowed;
}

. progress-section {
  background: white;
  padding: 30px;
  border-radius:  10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-section h3 {
  color:  #1F2937;
  margin-bottom: 20px;
}

.progress-bar {
  height: 30px;
  background-color:  #E5E7EB;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background:  linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.progress-text {
  color: #6B7280;
  text-align: center;
  margin:  0;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h2 {
  color:  #1F2937;
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
}

.task-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #1F2937;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #D1D5DB;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel {
  padding: 10px 20px;
  background-color: #E5E7EB;
  color: #1F2937;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background-color: #D1D5DB;
}

.btn-submit {
  padding: 10px 20px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2563EB;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 20px 15px;
  }

  .welcome-section h1 {
    font-size: 1.8rem;
  }

  . tasks-list {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-add-task {
    width: 100%;
  }
}
</style>
