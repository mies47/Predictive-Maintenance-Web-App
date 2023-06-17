<template>
  <div class="d-flex justify-center align-center min-h-100vh">
    <v-flex lg6>
      <v-row no-gutters>
        <v-container fluid class="pb-12 text-center">
          <h1>Sign Up For Admin</h1>
          <v-col cols="12">
            One of our admins will confirm your account after signup ✌️
          </v-col>
        </v-container>
      </v-row>
      <v-col>
        <v-card elevation="2" light class="bg-wave rounded-0 px-4 py-4">
          <v-container>
            <v-row class="text-left">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model.trim="name"
                  type="text"
                  label="Name"
                  :error-messages="nameErrors"
                  flat
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model.trim="email"
                  type="text"
                  label="Email"
                  :error-messages="emailErrors"
                  flat
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
                  flat
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  :loading="isLoading"
                  color="primary"
                  @click="handleSignUp"
                  >Sign Up</v-btn
                >
              </v-col>
              <v-col cols="12" md="6" class="text-right my-auto">
                Already have an account?
                <nuxt-link to="/sign-in">Login</nuxt-link>
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
  name: 'FormSignUp',
  components: { SnackBar },
  mixins: [validationMixin],
  validations: {
    name: { required },
    email: { required, email },
    password: { required }
  },
  data() {
    return {
      name: '',
      password: '',
      email: '',
      error: '',
      showError: false,
      isLoading: false
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
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
    handleSignUp() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.isLoading = true
        this.$axios
          .$post('/signup/admin', {
            name: this.name,
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.error = 'You have successfully signed up.'
            this.showError = true
          })
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
