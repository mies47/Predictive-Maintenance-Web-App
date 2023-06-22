<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
    <v-row style="width: 100%">
      <v-col cols="12" align-self="center" class="my-3 text-center">
        <h1>Active Nodes</h1>
      </v-col>
      <v-col v-for="node in nodes" :key="node" cols="12" sm="6" md="4" lg="3">
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
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      nodes: [],
      loading: true
    }
  },
  mounted() {
    this.$axios
      .$get('/data/allNodes')
      .then((data) => {
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
