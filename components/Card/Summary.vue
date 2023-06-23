<template>
  <v-row v-if="items && Object.entries(items).length">
    <v-col v-for="[k, v] of Object.entries(items)" :key="k" cols="6" sm="4">
      <v-card height="100%" class="card" :to="v.route">
        <v-container fluid>
          <h3>{{ v.title }}</h3>
          <v-row height="100%">
            <v-col>
              <h4
                class="grey--text text-h4 text-lg-h2 font-weight-bold lh-normal"
              >
                {{ v.summary }}
              </h4>
            </v-col>
            <v-col align-self="center" align="center">
              <v-icon size="60" :color="v.color">{{ v.icon }}</v-icon>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CardSummary',
  props: {
    items: {
      type: Object,
      required: true
    }
  }
}
</script>
