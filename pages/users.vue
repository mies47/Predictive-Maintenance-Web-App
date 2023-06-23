<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
    <v-row style="width: 100%">
      <v-col cols="12" align-self="center" class="my-3 text-center">
        <h1>All Admin Users</h1>
      </v-col>
      <v-col cols="12">
        <v-row align="center">
          <v-divider class="ml-0" inset />
          <h3 class="ml-4 mb-0">Unverified Admins</h3>
          <v-divider class="ml-4" inset />
        </v-row>
      </v-col>
      <v-col
        v-for="user in unverifiedUsers"
        :key="user.email"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <UserDetail :user="user" @update="update" />
      </v-col>
      <v-col
        v-if="unverifiedUsers.length == 0"
        cols="12"
        align-self="center"
        class="text-center grey--text my-5"
      >
        There are currently no unverified users!
      </v-col>
      <v-col cols="12">
        <v-row align="center">
          <v-divider class="ml-0" inset />
          <h3 class="ml-4 mb-0">Verified Admins</h3>
          <v-divider class="ml-4" inset />
        </v-row>
      </v-col>
      <v-col
        v-for="user in verifiedUsers"
        :key="user.email"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <UserDetail :user="user" />
      </v-col>
      <v-col
        v-if="verifiedUsers.length == 0"
        cols="12"
        align-self="center"
        class="text-center grey--text my-5"
      >
        There are currently no verified users!
      </v-col>
    </v-row>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import UserDetail from '~/components/UserDetail.vue'

export default {
  components: { UserDetail },
  data() {
    return {
      users: [],
      loading: true
    }
  },
  computed: {
    verifiedUsers() {
      return this.users.filter((u) => u.is_verified)
    },
    unverifiedUsers() {
      return this.users.filter((u) => !u.is_verified)
    }
  },
  mounted() {
    this.loading = false
    this.update()
  },
  methods: {
    update() {
      this.loading = true
      this.$axios
        .$get('/admin/all')
        .then((data) => {
          this.users = data
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
