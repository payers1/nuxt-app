<template>
  <div class='card'>
    <div class='card-content'>
      <div class='avatar'>
        <img style="border-radius: 20px; width: 40px; height: 40px" :src="user.avatar_url"/>
      </div>
      <div class='stuff'>
        <div class='card-title'>
        <div> {{user.name}} </div>
        <div class='card-subtitle'>
          <span> {{user.login}} </span>
          <span> {{user.email}} </span>
        </div>
      </div>
        <div class='location'> {{ user.location }} </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['user'],
    data() {
      return {
        src: ''
      }
    }
  }
</script>

<style scoped>

.location {
  font-size: 10px;
}
.stuff {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
}

.card-content {
  padding: 12px;
  display: flex;
}

.card-title {
  max-width: 180px;
  flex-grow: 1;
  font-size: 18px;
}

.card-subtitle {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgb(133, 139, 147)
}

.card {
  display: flex;
  box-sizing: border-box;
  width: 320px;
  min-height: 90px;
  margin-bottom: 10px;
  /*margin-left: 0px;*/
  background: white;
  box-shadow: 1px 2px 1px rgb(213, 213, 214);
}

.avatar {
  width: 40px;
  text-align: center;
  line-height: 40px;
  margin-right: 12px;
}


</style>
