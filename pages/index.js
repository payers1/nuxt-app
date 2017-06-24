import {mapState, mapMutations} from 'vuex'
import axios from 'axios'
import List from '~components/List'

const get = (url) => axios({
  url,
  method: 'GET',
  headers: {
    Authorization: `Basic ${process.env.GITHUB_TOKEN || process.env.github_token || ""}`
  }
});

export default {
  components: {
    List
  },

  async fetch({store, redirect}) {
    const randomOffset = Math.floor(Math.random(0) * 100);
    const resp = await get('https://api.github.com/users?per_page=5&since=' + randomOffset)

    const users = resp.data.map(async user => {
      const { data } = await get(user.url);
      return data;
    })
    const d = await Promise.all(users);
    store.commit('init', d)
  },

  computed: {
    ...mapState({
      users: (state) => state.users
    })
  }
}
