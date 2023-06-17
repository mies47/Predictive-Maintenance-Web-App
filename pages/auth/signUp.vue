<template>
  <div>
    <FormSignUp />
    <span
      ><img src="/nuxt.png" height="12" /> Nuxtify &copy;
      {{ new Date().getFullYear() }} {{ company }}.
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import global from '~/constants/global'

export default {
  layout: 'blank',
  auth: 'guest',
  data() {
    return {
      company: global.company
    }
  },
  computed: {
    ...mapState({
      isDark: (state) => state.core.theme.isDark
    })
  }
}
</script>
