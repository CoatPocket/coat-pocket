import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { boot } from './store.js'
import './style.css'

boot()
createApp(App).use(router).mount('#app')
