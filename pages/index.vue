<template>
  <el-container>
    <el-main>
      <el-row class="controls" type="flex">
        <el-col :xs="24" :md="8">
          <el-pagination
            layout="prev, pager, next"
            :total="len"
            :page-size="4"
            :current-page.sync="currentPage" />
        </el-col>
        <el-col :xs="24" :md="8" style="text-align:center; margin-top:-8px">
          <el-checkbox-group :max="1" v-model="filterGroup">
            <el-checkbox-button border v-for="filter in filters" :label="filter" :key="filter">
              {{filter}}
            </el-checkbox-button>
          </el-checkbox-group>
          </el-col>
        <el-col :xs="24" :md="8">
          <el-slider
            v-model="priceRange"
            range
            :max="100" />
        </el-col>
        </el-row>
      <el-row :gutter="30">
        <card v-for="wine$ in wines$" :wine="wine$" :key="wine$.productId" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Card from '@/components/Card'
import { from, combineLatest } from 'rxjs'
import { map, pluck, exhaustMap, share, debounceTime } from 'rxjs/operators'

export default {
  components: {
    Card
  },
  computed: {
    len: function() {
      return this.wines$ && this.wines$.length
    }
  },
  data() {
    return {
      filterGroup: [],
      currentPage: 1,
      priceRange: [8, 25],
      filters: ['Top Rated', 'Chairmans Selection']
    }
  },
  subscriptions() {
    const PAGE_SIZE = 4
    const createLoader = ({ url, q }) => from(this.$http.post(url, q))

    const createUrl = ([pageNum, priceRange, filters]) => {
      const BASE_URL =
        'https://owlifsh7s1.execute-api.us-east-1.amazonaws.com/dev/graphql'
      const url = BASE_URL
      let categoryFilter = 'category_id: "all"'
      const q = {
        query: `{
          wines(
            minprice: ${priceRange[0]},
            maxprice: ${priceRange[1]},
            ${categoryFilter}
          ) {
            variety
            productId
            tag
            ratings
            img
            title
            price
            description
            starred
          }
        }`
      }
      return {
        url,
        q
      }
    }

    const priceRange$ = this.$watchAsObservable('priceRange', {
      immediate: true
    }).pipe(
      debounceTime(1000),
      pluck('newValue')
    )

    const currentPage$ = this.$watchAsObservable('currentPage', {
      immediate: true
    }).pipe(pluck('newValue'))

    const currentFilters$ = this.$watchAsObservable('filterGroup', {
      immediate: true
    }).pipe(pluck('newValue'))

    const wines$ = combineLatest(
      currentPage$,
      priceRange$,
      currentFilters$
    ).pipe(
      map(createUrl),
      exhaustMap(createLoader),
      pluck('data', 'data', 'wines')
    )

    return {
      wines$,
      currentPage$
    }
  }
}
</script>

<style scoped>
.controls {
  flex-wrap: wrap;
  margin-bottom: 10px;
}
</style>
