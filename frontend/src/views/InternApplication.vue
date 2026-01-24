<template>
  <div class="intern-application-container">
    <div class="intern-inner">
      <!-- HEADER -->
      <div class="intern-header">
        <h1>🎓 Apply as Intern</h1>
        <p>Join our team as an intern and grow your skills!</p>
      </div>

      <!-- SUCCESS STATE -->
      <div v-if="applicationSubmitted" class="success-box">
        <h2>✅ Application Submitted!</h2>
        <p>Thank you for applying! We will review your application and contact you soon.</p>
        <p><strong>Status:</strong> Pending Review</p>
        <button @click="resetForm" class="btn-new-application">Submit Another Application</button>
      </div>

      <!-- APPLICATION FORM -->
      <div v-if="!applicationSubmitted" class="application-form-box">
        <!-- LOADING STATE -->
        <div v-if="loading" class="loading">Loading form...</div>

        <!-- ERROR STATE -->
        <div v-if="error" class="error">{{ error }}</div>

        <!-- FORM -->
        <form v-if="!loading" @submit.prevent="submitApplication" class="application-form">
          <div class="form-group">
            <label>Full Name *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input 
              v-model="formData.email" 
              type="email" 
              placeholder="Enter your email address"
              required
            />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              placeholder="Enter your phone number (optional)"
            />
          </div>

          <div class="form-group">
            <label>University/School *</label>
            <input 
              v-model="formData.university" 
              type="text" 
              placeholder="Enter your university or school name"
              required
            />
          </div>

          <div class="form-group">
            <label>Field of Study *</label>
            <input 
              v-model="formData.fieldOfStudy" 
              type="text" 
              placeholder="Enter your field of study (e.g., Computer Science)"
              required
            />
          </div>

          <div class="form-group">
            <label>Why do you want to be an intern? *</label>
            <textarea 
              v-model="formData.motivation" 
              placeholder="Tell us about your interest in our company and what you hope to learn..."
              rows="6"
              required
            ></textarea>
            <small class="character-count">{{ formData.motivation.length }}/500 characters</small>
          </div>

          <div class="form-group">
            <label>
              <input 
                v-model="formData.agreeTerms" 
                type="checkbox"
                required
              />
              <span>I agree to the terms and conditions</span>
            </label>
          </div>

          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Submitting...' : '📤 Submit Application' }}
          </button>
        </form>
      </div>

      <!-- INFO SECTION -->
      <div class="info-section">
        <h2>ℹ️ About Our Internship Program</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>🎯 Duration</h3>
            <p>3-6 months flexible internship period</p>
          </div>
          <div class="info-card">
            <h3>💼 Experience</h3>
            <p>Work on real projects with professional teams</p>
          </div>
          <div class="info-card">
            <h3>���� Learning</h3>
            <p>Gain hands-on experience and industry knowledge</p>
          </div>
          <div class="info-card">
            <h3>🚀 Opportunity</h3>
            <p>Potential for full-time employment after internship</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternApplication',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        university: '',
        fieldOfStudy: '',
        motivation: '',
        agreeTerms: false
      },
      loading: false,
      error: '',
      submitting: false,
      applicationSubmitted: false
    }
  },
  methods: {
    async submitApplication() {
      // Validation
      if (!this.formData.name || !this.formData.email || !this.formData.university || !this.formData.fieldOfStudy || !this.formData.motivation) {
        this.error = 'Please fill in all required fields';
        return;
      }

      if (this.formData.motivation.length > 500) {
        this.error = 'Motivation text cannot exceed 500 characters';
        return;
      }

      if (!this.formData.agreeTerms) {
        this.error = 'You must agree to the terms and conditions';
        return;
      }

      this.submitting = true;
      this.error = '';

      try {
        const response = await fetch('http://localhost:5000/api/intern-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            university: this.formData.university,
            fieldOfStudy: this.formData.fieldOfStudy,
            motivation: this.formData.motivation
          })
        });

        if (response.ok) {
          this.applicationSubmitted = true;
          console.log('Application submitted successfully');
        } else {
          const error = await response.json();
          this.error = error.message || 'Failed to submit application. Please try again.';
        }
      } catch (err) {
        this.error = 'Error: ' + err.message;
      } finally {
        this.submitting = false;
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        university: '',
        fieldOfStudy: '',
        motivation: '',
        agreeTerms: false
      };
      this.applicationSubmitted = false;
      this.error = '';
    }
  }
}
</script>

<style scoped>
.intern-application-container {
  width: 100%;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

.intern-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.intern-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.intern-header h1 {
  color: #1F2937;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.intern-header p {
  color: #6B7280;
  font-size: 1.1rem;
  margin: 0;
}

.success-box {
  background: white;
  border: 3px solid #10B981;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.success-box h2 {
  color: #065F46;
  font-size: 2rem;
  margin-bottom: 15px;
}

.success-box p {
  color: #6B7280;
  font-size: 1.1rem;
  margin: 10px 0;
}

.btn-new-application {
  padding: 12px 30px;
  background-color: #10B981;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.btn-new-application:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.application-form-box {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.loading, .error {
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
  margin-bottom: 20px;
}

.application-form {
  display: grid;
  gap: 25px;
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

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 2px solid #D1D5DB;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.character-count {
  color: #6B7280;
  font-size: 0.9rem;
  margin-top: 5px;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
  cursor: pointer;
}

.form-group label {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.form-group label span {
  font-weight: normal;
}

.btn-submit {
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

.btn-submit:hover:not(:disabled) {
  background-color: #2563EB;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.info-section {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  color: #1F2937;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-card {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.info-card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .intern-inner {
    padding: 20px 15px;
  }

  .intern-header h1 {
    font-size: 1.8rem;
  }

  .application-form-box {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
