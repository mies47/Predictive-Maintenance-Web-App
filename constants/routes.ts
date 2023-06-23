const AUTH = {
  SIGNIN: {
    href: '/auth/signIn.vue',
    route: '/sign-in',
    url: '/sign-in'
  },
  SIGNUP: {
    href: '/auth/signUp.vue',
    route: '/sign-up',
    url: '/sign-up'
  }
}

const DASHBOARD = {
  HOME: {
    href: '/index.vue',
    route: '/',
    url: '/'
  },
  NODES: {
    href: '/nodes/index.vue',
    route: '/nodes/',
    url: '/nodes/'
  },
  NODE: {
    href: '/nodes/_nodeId.vue',
    route: '/nodes/:nodeId',
    url: '/nodes/:nodeId'
  },
  Gateways: {
    href: '/gateways.vue',
    route: '/gateways',
    url: '/gateways'
  },
  Users: {
    href: '/users.vue',
    route: '/users',
    url: '/users'
  }
}

const API = {
  API: {
    href: '/api/v1',
    route: '/api/v1',
    url: '/api/v1'
  }
}

module.exports = { ...AUTH, ...DASHBOARD, ...API }
