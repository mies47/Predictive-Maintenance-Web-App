<template>
  <div class="d-flex justify-center align-center min-h-100vh">
    <v-flex lg6>
      <v-row no-gutters>
        <v-container fluid class="pb-12">
          <h1 class="text-center">Sign In To Your Admin Account</h1>
        </v-container>
      </v-row>
      <v-col>
        <v-card elevation="2" class="bg-wave" light>
          <v-container>
            <v-row class="text-left">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model.trim="email"
                  type="text"
                  label="Email"
                  :error-messages="emailErrors"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model.trim="password"
                  type="password"
                  name="password"
                  label="Password"
                  :error-messages="passwordErrors"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn :loading="isLoading" color="primary" @click="handleLogin"
                  >Login</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" class="text-right my-auto">
                Don't have an account?
                <nuxt-link to="/sign-up">Sign Up</nuxt-link>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <SnackBar :show="showError" :text="error" @close="showError = false" />
    </v-flex>
  </div>
</template>

<script>
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import SnackBar from './SnackBar.vue'

export default Vue.extend({
  name: 'FormSignIn',
  components: { SnackBar },
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required }
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      showError: false,
      isLoading: false
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      return errors
    }
  },
  methods: {
    handleLogin() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isLoading = true
        this.$auth
          .loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            }
          })
          .then(() => {})
          .catch((error) => {
            this.error = error.response?.data?.detail || error.toString()
            this.showError = true
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  }
})
</script>
