/* eslint-disable vue/multi-word-component-names */
//! Keep this at the top
import './utils/polyfill'
//! Keep this at the top after polyfill
import './data/migration'

import { createPinia } from 'pinia'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Button from 'primevue/button'
import PrimeVue from 'primevue/config'
import Divider from 'primevue/divider'
import Dropdown from 'primevue/dropdown'
import Fieldset from 'primevue/fieldset'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Listbox from 'primevue/listbox'
import ProgressSpinner from 'primevue/progressspinner'
import ScrollPanel from 'primevue/scrollpanel'
import Slider from 'primevue/slider'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Textarea from 'primevue/textarea'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import App from './App.vue'
import './components/web/copy-button'
import { CONVERTER_KEY } from './keys'
import converter from './utils/converter'

const app = createApp(App)

app.use(PrimeVue)
app.use(createPinia())

app.component('Button', Button)
app.component('Dropdown', Dropdown)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Textarea', Textarea)
app.component('InputSwitch', InputSwitch)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Listbox', Listbox)
app.component('ScrollPanel', ScrollPanel)
app.component('Slider', Slider)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Divider', Divider)
app.component('Fieldset', Fieldset)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)

app.directive('tooltip', Tooltip)

app.provide(CONVERTER_KEY, converter)

app.mount('#app')
