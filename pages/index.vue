<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <CardSummary :items="summary" />
        <h2 class="my-5">Active Nodes</h2>
        <v-row style="min-height: 20vh">
          <v-col v-for="node in nodes" :key="node" cols="12" sm="6" lg="4">
            <v-card height="100%" class="card" :to="`/nodes/${node}`">
              <v-container fluid>
                <v-row height="100%">
                  <v-col cols="9" align-self="center" align="center">
                    <div>{{ node }}</div>
                  </v-col>
                  <v-col cols="3" align-self="center" align="center">
                    <v-icon size="60" color="red">mdi-vibrate</v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
          <v-col
            v-if="nodes.length == 0"
            cols="12"
            align-self="center"
            class="text-center grey--text"
          >
            There are currently no active nodes or an error has occured!
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Footer />
  </v-container>
</template>

<script>
import CardSummary from '@/components/Card/Summary.vue'
export default {
  name: 'IndexPage',
  components: {
    CardSummary
  },
  data() {
    return {
      summary: {
        admin: {
          title: 'Admins Summary',
          summary: 0,
          color: 'green',
          icon: 'mdi-account-box-outline',
          route: '/users'
        },
        gateway: {
          title: 'Gateway Summary',
          summary: 0,
          color: 'blue',
          icon: 'mdi-router-wireless',
          route: '/gateways'
        },
        node: {
          title: 'Nodes Summary',
          summary: 0,
          color: 'red',
          icon: 'mdi-vibrate',
          route: '/nodes'
        }
      },
      loading: true,
      nodes: []
    }
  },
  head() {
    return {
      title: 'Homepage - Admin Dashboard',
      description: 'An admin dashboard for predictive maintenance analytics.'
    }
  },
  mounted() {
    this.$axios
      .$get('/admin/all')
      .then((data) => {
        this.summary.admin.summary = data.length
      })
      .catch((error) => {
        console.log(error)
      })
    this.$axios
      .$get('/gateway/all')
      .then((data) => {
        this.summary.gateway.summary = data.length
      })
      .catch((error) => {
        console.log(error)
      })
    this.$axios
      .$get('/data/allNodes')
      .then((data) => {
        this.summary.node.summary = data.length
        this.nodes = data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
