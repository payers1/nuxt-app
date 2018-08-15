<template>
  <el-container>
    <el-main>
      <el-row class="controls" type="flex">
        <el-col :xs="24" :md="8">
          <el-pagination
            layout="prev, pager, next"
            :total="len"
            :page-size="9"
            :current-page.sync="currentPage" />
        </el-col>
        <el-col :xs="24" :md="8" style="text-align:center; margin-top:-8px">
          <el-radio-group v-model="filterGroup">
            <el-radio-button border v-for="filter in filters" :label="filter" :key="filter">
              {{filter}}
            </el-radio-button>
          </el-radio-group>
          </el-col>
        <el-col :xs="24" :offset="1" :md="6">
          <el-slider
            v-model="priceRange"
            range
            :max="100" />
        </el-col>
        </el-row>
      <el-row :gutter="30">
        <card v-for="wine$ in wines" :wine="wine$" :key="wine$.productId" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Card from '@/components/Card'
import { from, combineLatest } from 'rxjs'
import {
  map,
  pluck,
  startWith,
  exhaustMap,
  share,
  debounceTime,
  merge,
  mapTo,
  scan
} from 'rxjs/operators'

export default {
  components: {
    Card
  },
  computed: {
    len: function() {
      return this.wines$ && this.wines$.length
    },
    wines: function() {
      return (
        this.wines$ &&
        this.wines$.slice((this.currentPage - 1) * 9, this.currentPage * 9)
      )
    }
  },
  data() {
    return {
      filterGroup: [],
      currentPage: 1,
      priceRange: [8, 25],
      filters: ['Top Rated', 'Chairmans Selection', 'Red', 'Sparkling', 'Rosé']
    }
  },
  subscriptions() {
    const getCategoryFilter = filters => {
      console.log('filters', filters)
      if (!filters) {
        return 'category_id: "Top Rated"'
      } else if (filters === 'Top Rated') {
        return 'category_id: "top_rated"'
      } else if (filters === 'Red') {
        return 'category_id: "red"'
      } else if (filters === 'Sparkling') {
        return 'category_id: "sparkling"'
      } else if (filters === 'Rosé') {
        return 'category_id: "rose"'
      }
      return 'category_id: "chairmans"'
    }
    const createLoader = ({ url, q }) => from(this.$http.post(url, q))

    const createUrl = ([priceRange, filters]) => {
      const BASE_URL =
        'https://owlifsh7s1.execute-api.us-east-1.amazonaws.com/dev/graphql'
      const url = BASE_URL
      let categoryFilter = getCategoryFilter(filters)
      console.log('cat filter', categoryFilter)
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
      immediate: false
    }).pipe(pluck('newValue'))

    const currentFilters$ = this.$watchAsObservable('filterGroup', {
      immediate: true
    }).pipe(pluck('newValue'))

    const wines$ = combineLatest(priceRange$, currentFilters$).pipe(
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
