
import Loading from './Loading.vue'
import Clause from './Clause.vue'
import Event from './Event.vue'
import TransferItem from './TransferItem.vue'
import AccountLink from './AccountLink.vue'
import InputData from './InputData.vue'
import Ident from './Ident.vue'
import SvgIcon from './SvgIcon.vue'
import Amount from './Amount.vue'
import Fee from './Fee.vue'
import Decoded from './Decoded.vue'
import Copy from './Copy.vue'
import TransferItemList from './TransferItemList.vue'
import VeChainStatsLink from './VeChainStatsLink.vue'
import DepositPanel from './DepositPanel.vue'

import Vue from 'vue'

Vue.component('Loading', Loading)
Vue.component('Clause', Clause)
Vue.component('Event', Event)
Vue.component('TransferItem', TransferItem)
Vue.component('AccountLink', AccountLink)
Vue.component('InputData', InputData)
Vue.component('Ident', Ident)
Vue.component('SvgIcon', SvgIcon)
Vue.component('Amount', Amount)
Vue.component('Fee', Fee)
Vue.component('Decoded', Decoded)
Vue.component('BandwidthChart', () => import('./BandwidthChart.vue'))
Vue.component('Copy', Copy)
Vue.component('TransferItemList', TransferItemList)
Vue.component('VeChainStatsLink', VeChainStatsLink)
Vue.component('DepositPanel', DepositPanel)
