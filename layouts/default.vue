<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>

export default {
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', content: "Nuxt.js project" }
    ],
    link: [
      { rel: "stylesheet",  href: "https://unpkg.com/element-ui/lib/theme-default/index.css"},
      { rel: 'icon', type: 'image/x-icon', href: 'https://cdn.gomix.com/2d2e28d2-e17b-4934-a643-b1c5ba787a0b%2Ffavicon.ico' }
    ]
  }
}
</script>
