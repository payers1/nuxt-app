import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Trend from 'vuetrend'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRx from 'vue-rx'
import { Observable } from 'rxjs'

Vue.use(Trend)
Vue.use(ElementUI, { locale })
Vue.use(VueAxios, axios)
Vue.use(VueRx, { Observable })
