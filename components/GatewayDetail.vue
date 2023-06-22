<template>
  <v-card height="100%" class="card">
    <v-container fluid>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          <h4 class="ma-0">{{ gateway.mac }}</h4>
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Sign Up At: {{ gateway.signed_up_at.replace('T', ' ').split('.')[0] }}
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Last Login At:
          {{ gateway.last_login_at?.replace('T', ' ').split('.')[0] }}
        </v-col>
      </v-row>
      <v-divider class="mx-auto" inset></v-divider>
      <v-row class="my-2">
        <v-col cols="12" class="d-flex align-center justify-center py-0">
          <span class="mr-5 my-0"> Verified: </span>
          <v-switch
            :input-value="gateway.is_verified"
            :disabled="gateway.is_verified"
            @change="verify(gateway.mac)"
          />
        </v-col>
      </v-row>
      <v-divider v-if="gateway.is_verified" class="mx-auto" inset></v-divider>
      <v-row v-if="gateway.is_verified" class="my-2">
        <v-col cols="12" align-self="center" align="center">
          Verified At:
          {{ gateway.verified_at?.replace('T', ' ').split('.')[0] }}
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
    gateway: {
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
    verify(macAddress) {
      this.loading = true
      this.$axios
        .$put('/gateway/verify', {
          mac: macAddress
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
