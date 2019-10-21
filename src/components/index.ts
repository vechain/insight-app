
import Loading from './Loading.vue'
import Clause from './Clause.vue'
import Event from './Event.vue'
import Transfer from './Transfer.vue'
import AccountLink from './AccountLink.vue'
import InputData from './InputData.vue'
import Ident from './Ident.vue'
import SvgIcon from './SvgIcon.vue'
import Amount from './Amount.vue'
import Decoded from './Decoded.vue'

import Vue from 'vue'

Vue.component('Loading', Loading)
Vue.component('Clause', Clause)
Vue.component('Event', Event)
Vue.component('Transfer', Transfer)
Vue.component('AccountLink', AccountLink)
Vue.component('InputData', InputData)
Vue.component('Ident', Ident)
Vue.component('SvgIcon', SvgIcon)
Vue.component('Amount', Amount)
Vue.component('Decoded', Decoded)
Vue.component('BandwidthChart', () => import('./BandwidthChart.vue'))
