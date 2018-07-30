<template>
  <el-col :gutter="20" :lg="8" :sm="12">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <el-row type="flex" justify="space-between">
          <el-col :xs="18" :sm="20"><span> {{wine.title}} </span></el-col>
          <el-col :xs="4" :sm="2"><span> {{wine.price}} </span></el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="10">
          <img :src="image" class="image">
        </el-col>
        <el-col :span="14">
          <el-tag v-for="tag in tags" :key="tag">{{tag}}</el-tag>
        </el-col>
      </el-row>
    </el-card>
  </el-col>
</template>

<script>
import { from } from 'rxjs'
import { map, mapTo, pluck, exhaustMap, startWith, share } from 'rxjs/operators'

export default {
  computed: {
    image: function() {
      if (this.wine.img) {
        return `https://www.finewineandgoodspirits.com${this.wine.img}`
      }
      return 'http://via.placeholder.com/200x300'
    },
    tags: function() {
      const filteredRatings = this.wine.ratings.filter(
        item => item != "Chairman's Selection�"
      )
      const tag = this.wine.tag.replace('�', '')
      return this.wine.tag
        ? [...new Set(filteredRatings.concat(tag))]
        : filteredRatings
    }
  },
  props: ['wine']
}
</script>

<style scoped>
.box-card {
  margin-bottom: 30px;
  height: 400px;
}
.button {
  float: right;
  padding: 3px 0;
}

p {
  margin: 0;
}
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.image {
  max-width: 100%;
  height: auto;
}
</style>
