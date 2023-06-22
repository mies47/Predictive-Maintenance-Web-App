<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
    <v-row style="width: 100%">
      <v-col cols="12" align-self="center" class="my-3 text-center">
        <h1>Active Gateways</h1>
      </v-col>
      <v-col cols="12">
        <v-row align="center">
          <v-divider class="ml-0" inset />
          <h3 class="ml-4 mb-0">Unverified Gateways</h3>
          <v-divider class="ml-4" inset />
        </v-row>
      </v-col>
      <v-col
        v-for="gateway in unverifiedGateways"
        :key="gateway.mac"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <GatewayDetail :gateway="gateway" @update="update" />
      </v-col>
      <v-col
        v-if="unverifiedGateways.length == 0"
        cols="12"
        align-self="center"
        class="text-center grey--text my-5"
      >
        There are currently no unverified nodes!
      </v-col>
      <v-col cols="12">
        <v-row align="center">
          <v-divider class="ml-0" inset />
          <h3 class="ml-4 mb-0">Verified Gateways</h3>
          <v-divider class="ml-4" inset />
        </v-row>
      </v-col>
      <v-col
        v-for="gateway in verifiedGateways"
        :key="gateway.mac"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <GatewayDetail :gateway="gateway" />
      </v-col>
      <v-col
        v-if="verifiedGateways.length == 0"
        cols="12"
        align-self="center"
        class="text-center grey--text my-5"
      >
        There are currently no verified nodes!
      </v-col>
    </v-row>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import GatewayDetail from '~/components/GatewayDetail.vue'

export default {
  components: { GatewayDetail },
  data() {
    return {
      gateways: [],
      loading: true
    }
  },
  computed: {
    verifiedGateways() {
      return this.gateways.filter((g) => g.is_verified)
    },
    unverifiedGateways() {
      return this.gateways.filter((g) => !g.is_verified)
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
        .$get('/gateway/all')
        .then((data) => {
          this.gateways = data
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
