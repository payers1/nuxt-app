<template>
  <el-container>
    <el-main>
      <el-row class="controls" type="flex">
        <el-col :xs="24" :md="8">
          <el-pagination
            layout="prev, pager, next"
            :total="len$"
            :page-size="6"
            :current-page.sync="currentPage" />
        </el-col>
        <el-col :xs="24" :md="8" style="text-align:center; margin-top:-8px">
          <el-checkbox-group v-model="filterGroup">
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
        <card v-for="wine$ in wines$" :wine="wine$._source" :key="wine$._source.productId" />
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
  data() {
    return {
      filterGroup: [],
      currentPage: 1,
      priceRange: [8, 25],
      filters: ['Top Rated']
    }
  },
  subscriptions() {
    const PAGE_SIZE = 6
    const BASE_URL =
      'https://search-winedomain-7d66zy5brbaqa3i253pipja3ym.us-east-1.es.amazonaws.com/'

    const createLoader = ({ url, q }) => from(this.$http.post(url, q))

    const createUrl = ([pageNum, priceRange, filters]) => {
      const tagFilters =
        filters.length > 0
          ? {
              must: [
                {
                  match: {
                    tag: 'Top Rated'
                  }
                }
              ]
            }
          : {}
      const url = `${BASE_URL}/wines/wine/_search?size=${PAGE_SIZE}&from=${(pageNum -
        1) *
        PAGE_SIZE}`
      const q = {
        query: {
          bool: {
            ...tagFilters,
            filter: {
              range: {
                price: {
                  gte: priceRange[0],
                  lt: priceRange[1]
                }
              }
            }
          }
        }
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

    const data$ = combineLatest(
      currentPage$,
      priceRange$,
      currentFilters$
    ).pipe(
      map(createUrl),
      exhaustMap(createLoader),
      pluck('data', 'hits'),
      share()
    )

    const wines$ = data$.pipe(pluck('hits'))
    const len$ = data$.pipe(pluck('total'))

    return {
      len$,
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
