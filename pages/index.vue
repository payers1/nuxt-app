<template>
  <el-container>
    <el-main>
      <el-row :gutter="30">
        <div>
          <el-pagination
            layout="prev, pager, next"
            :total="len$"
            :page-size="6"
            :current-page.sync="currentPage" />
        </div>
        <card v-for="wine$ in wines$" :wine="wine$._source" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Card from '@/components/Card'
import { from } from 'rxjs'
import { map, mapTo, pluck, exhaustMap, startWith, share } from 'rxjs/operators'

export default {
  components: {
    Card
  },
  data() {
    return {
      currentPage: 1
    }
  },
  subscriptions() {
    const PAGE_SIZE = 6
    const createLoader = url => from(this.$http.get(url))
    const baseUrl =
      'https://search-winedomain-7d66zy5brbaqa3i253pipja3ym.us-east-1.es.amazonaws.com/'

    const createUrl = pageNum =>
      `${baseUrl}/wines/wine/_search?size=${PAGE_SIZE}&from=${pageNum *
        PAGE_SIZE}`

    const activeTab$ = this.$watchAsObservable('currentPage', {
      immediate: true
    }).pipe(
      pluck('newValue'),
      map(createUrl),
      exhaustMap(createLoader),
      pluck('data', 'hits')
    )

    const wines$ = activeTab$.pipe(pluck('hits'))
    const len$ = activeTab$.pipe(pluck('total'))

    return {
      len$,
      wines$,
      activeTab$
    }
  }
}
</script>

<style scoped>
</style>
