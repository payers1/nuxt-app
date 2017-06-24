<template>
  <div>
    <div class='list-header'>
      <div style="font-size: 1.17em; font-weight: bold"> Users </div>
      <span style="font-size: 12px">  </span>
    </div>
    <div class='list'>
      <card v-for="user in users" :key="user.id" :user="user"></card>
    </div>
  </div>
</template>

<style scoped>
  .list-header {
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  .list {
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-content: flex-start;
    min-height: 500px;
    padding: 4px;
    flex-wrap: wrap;
    min-width: 300px;
    max-width: 330px;

  }
  .container {
    padding-top: 100px;
    background: rgb(242, 242, 245);
    min-height: 89vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  import Card from '~components/Card'

  export default {
    props: ['users'],

    components: {
      Card
    }
  }
</script>
