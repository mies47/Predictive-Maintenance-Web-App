<template>
  <v-card height="100%" class="card">
    <v-container fluid>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          <h4 class="ma-0">{{ user.email }}</h4>
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Name: {{ user.name }}
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Sign Up At: {{ user.signed_up_at.replace('T', ' ').split('.')[0] }}
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Last Login At:
          {{ user.last_login_at?.replace('T', ' ').split('.')[0] }}
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" class="d-flex align-center justify-center py-0">
          <span class="mr-5 my-0"> Verified: </span>
          <v-switch
            :input-value="user.is_verified"
            :disabled="user.is_verified"
            @change="verify(user.email)"
          />
        </v-col>
      </v-row>
      <v-divider v-if="user.is_verified" class="mx-auto" inset></v-divider>
      <v-row v-if="user.is_verified" class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Verified At:
          {{ user.verified_at?.replace('T', ' ').split('.')[0] }}
        </v-col>
      </v-row>
    </v-container>
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    verify(email) {
      this.loading = true
      this.$axios
        .$put('/admin/verify', {
          email
        })
        .then(() => {
          this.$emit('update')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
