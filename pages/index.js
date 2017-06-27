import { mapState, mapActions } from 'vuex'
import List from '~components/List'
import { getData } from '../store/helpers';

export default {
  components: {
    List
  },

  fetch: getData,

  computed: {
    ...mapState({
      users: (state) => state.users
    })
  }
}
