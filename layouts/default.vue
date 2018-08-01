<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Wine Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', content: 'Wine Admin' }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
      }
    ]
  }
}
</script>
