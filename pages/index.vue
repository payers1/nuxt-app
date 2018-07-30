<template>
  <el-container>
    <el-main>
      <el-row type="flex">
        <el-col>
      <el-pagination
        layout="prev, pager, next"
        :total="len$"
        :page-size="6"
        :current-page.sync="currentPage" />
        </el-col>
        <el-col>
        <el-slider
          v-model="priceRange"
          range
          :max="100" />
          </el-col>
        </el-row>
      <el-row :gutter="30">
        <div>
        </div>
        <card v-for="wine$ in wines$" :wine="wine$._source" :key="wine$._source.productId" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Card from '@/components/Card'
import { from, combineLatest } from 'rxjs'
import { map, mapTo, pluck, exhaustMap, startWith, share } from 'rxjs/operators'

export default {
  components: {
    Card
  },
  data() {
    return {
      currentPage: 1,
      priceRange: [8, 25]
    }
  },
  subscriptions() {
    const PAGE_SIZE = 6
    const createLoader = ({ url, q }) => from(this.$http.post(url, q))

    const baseUrl =
      'https://search-winedomain-7d66zy5brbaqa3i253pipja3ym.us-east-1.es.amazonaws.com/'

    const createUrl = ([pageNum, priceRange]) => {
      const url = `${baseUrl}/wines/wine/_search?size=${PAGE_SIZE}&from=${pageNum *
        PAGE_SIZE}`
      const q = {
        query: {
          range: {
            price: {
              gte: priceRange[0],
              lt: priceRange[1]
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
    }).pipe(pluck('newValue'))

    const currentPage$ = this.$watchAsObservable('currentPage', {
      immediate: true
    }).pipe(pluck('newValue'))

    const data$ = combineLatest(currentPage$, priceRange$).pipe(
      map(createUrl),
      exhaustMap(createLoader),
      pluck('data', 'hits')
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
