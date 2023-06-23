<template>
  <v-app id="default" :dark="isDark">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :dark="isDark"
      fixed
      app
      floating
      styles="height: calc(100% - 2rem); top: 0px; max-height: calc(100% - 0px)"
    >
      <nuxt-link to="/" class="no-underline success--text">
        <v-flex
          align-self-center
          class="text-center justify-center align-center"
          style="height: 33px"
        >
          <h4 class="my-6" v-text="title"
        /></v-flex>
      </nuxt-link>

      <v-list :dark="isDark">
        <slot v-for="(item, i) in items">
          <v-list-group
            v-if="item.items && item.items.length && item.to === null"
            :key="`${item.title}-key-${i + 1}`"
            v-model="item.active"
            :prepend-icon="item.icon"
            :color="isDark ? 'warning' : 'accent-1'"
            :value="false"
            :ripple="false"
          >
            <template v-if="item.items" v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="child in item.items"
              :key="child.title"
              :to="child.to"
            >
              <v-list-item-action>
                <v-icon center dense>
                  {{ child.icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.title"
            :to="item.to"
            exact
            :ripple="false"
          >
            <v-list-item-action>
              <v-icon center>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </slot>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :color="isDark ? 'default' : 'white'"
      :dark="isDark"
      elevation="8"
      app
      class="px-4"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon
        :class="drawer ? '' : 'menu-toggle'"
        @click.stop="drawer = !drawer"
      />
      <v-btn
        small
        icon
        :class="drawer ? '' : 'd-none'"
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn small icon @click.stop="setTheme">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
      <v-menu transition="slide-y-transition" bottom top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" width="auto" v-on="on">
            <v-row align="center">
              <v-col cols="auto">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-col>
              <v-col>
                <v-row>
                  {{ $auth.user?.name }}
                </v-row>
                <v-row>
                  <small>
                    {{ $auth.user?.email }}
                  </small>
                </v-row>
              </v-col>
            </v-row>
          </v-btn>
        </template>
        <v-list class="pl-2 pr-4">
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Logout </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      light
      fixed
      bottom
      right
      small
      color="error"
      @click="toTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-overlay v-if="$nuxt.isOffline" :value="overlay" z-index="1000">
      <v-banner color="warning" single-line @click:icon="alert">
        <v-icon slot="icon" color="light" size="36">
          mdi-wifi-strength-alert-outline
        </v-icon>
        <span class="white--text"
          >Unable to verify your Internet connection</span
        >
        <template v-slot:actions>
          <v-btn
            class="white--text"
            color="warning"
            text
            flat
            fab
            @click="overlay = !overlay"
          >
            <v-icon> mdi-window-close </v-icon>
          </v-btn>
        </template>
      </v-banner></v-overlay
    >
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import global from '~/constants/global'

export default {
  name: 'LayoutDefault',
  data() {
    return {
      title: 'AUT Predictive Maintenance',
      company: global.company,
      drawer: false,
      overlay: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-vibrate',
          title: 'Nodes',
          to: '/nodes'
        },
        {
          icon: 'mdi-router-wireless',
          title: 'Gateways',
          to: '/gateways'
        },
        {
          icon: 'mdi-account',
          title: 'Users',
          to: '/users'
        }
      ],
      miniVariant: false,
      right: true,
      fab: true,
      darkmode: false,
      searchLength: false,
      search: ''
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: this.$vuetify.theme.isDark ? 'theme--dark' : 'theme--light'
      }
    }
  },
  computed: {
    ...mapState({ isDark: (state) => state.core.theme.isDark })
  },
  created() {
    const {
      $isServer,
      $store: { commit }
    } = this
    // Execute initial stores
    if (!$isServer) {
      commit('core/INITIALIZE_STORE')
    }
  },
  methods: {
    setTheme() {
      const {
        $vuetify,
        $store: { dispatch }
      } = this
      $vuetify.theme.dark = !$vuetify.theme.isDark
      const nuxtify = JSON.parse(localStorage.getItem('nuxtify') || 'null')
      dispatch('core/setDark', {
        ...nuxtify,
        isDark: $vuetify.theme.dark
      })
    },
    searchFocus() {
      this.searchLength = !this.searchLength
      this.search = ''
    },
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      const { $vuetify } = this
      $vuetify.goTo(0)
    },
    async logout() {
      try {
        await this.$auth.logout()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<!-- Styles -->
<!-- <style lang="scss">
@import '~/assets/scss/theme';
</style> -->
