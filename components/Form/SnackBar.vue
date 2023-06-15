<template>
  <v-snackbar :value="show" :dark="isDark" bottom app>
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="red" text v-bind="attrs" @click="$emit('close')">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SnackBar',
  props: {
    text: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({ isDark: (state) => state.core.theme.isDark })
  }
}
</script>
