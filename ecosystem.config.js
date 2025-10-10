module.exports = {
  apps: [
    {
      name: 'XAP-CHECKOUT',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      namespace: 'web',
      args: 'start',
    },
  ],
}
