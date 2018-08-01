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
          <el-row class="tags">
            <el-tag v-for="tag in tags" :key="tag">{{tag}}</el-tag>
            <el-tag>{{wine.variety}}</el-tag>
          </el-row>
          <el-row>
            <el-form>
                <el-form-item>
                  <el-input type="textarea" :autosize="size" resize="none" v-model="wine.description"></el-input>
                </el-form-item>
                <el-button v-stream:click="save$" type="primary">Save</el-button>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </el-col>
</template>

<script>
import gql from 'graphql-tag'
import { from } from 'rxjs'
import { map, pluck, exhaustMap, switchMap, share } from 'rxjs/operators'

export default {
  data() {
    return {
      size: {
        maxRows: 6
      },
      search: ''
    }
  },
  methods: {
    updateWineDescription() {
      const { productId, description } = this.wine
      return this.$apollo.mutate({
        mutation: gql`
          mutation($productId: String!, $description: String) {
            updateWine(productId: $productId, description: $description) {
              description
            }
          }
        `,
        variables: {
          productId,
          description
        }
      })
    }
  },
  domStreams: ['save$'],
  subscriptions() {
    const createLoader = () => from(this.updateWineDescription())
    const update$ = this.save$.pipe(switchMap(createLoader))
    return {
      update$
    }
  },
  computed: {
    image: function() {
      return `https://www.finewineandgoodspirits.com${this.wine.img}`
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
.tags {
  margin-bottom: 19px;
}

.el-textarea {
  resize: none !important;
}
</style>
