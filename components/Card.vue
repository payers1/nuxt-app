<template>
  <el-col :gutter="20" :xl="8" :md="12" :sm="12">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <el-row type="flex" justify="space-between">
          <el-col :xs="18" :sm="19"><span> {{wine.title}} </span></el-col>
          <el-col :xs="3" :sm="2"><span> {{wine.price}} </span></el-col>
          <el-col :xs="1" :sm="2">  <el-button type="plain" :icon="icon" @click="toggleStarred()" circle></el-button></el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="8">
          <img :src="image" class="image">
        </el-col>
        <el-col :span="16">
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
      starred: false,
      size: {
        maxRows: 6
      },
      search: ''
    }
  },
  methods: {
    toggleStarred() {
      this.starred = !this.starred
    },
    updateWineDescription() {
      const starred = this.wine.starred || this.starred
      const { productId, description } = this.wine
      return this.$apollo.mutate({
        mutation: gql`
          mutation(
            $productId: String!
            $description: String
            $starred: Boolean
          ) {
            updateWine(
              productId: $productId
              description: $description
              starred: $starred
            ) {
              description
              starred
            }
          }
        `,
        variables: {
          productId,
          description,
          starred
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
    icon: function() {
      return this.starred || this.wine.starred
        ? 'el-icon-star-on'
        : 'el-icon-star-off'
    },
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
  background: white;
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
.el-row {
  align-items: center;
}
</style>
