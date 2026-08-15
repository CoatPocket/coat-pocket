import { createRouter, createWebHistory } from 'vue-router'
import FeedView from './views/FeedView.vue'
import PostView from './views/PostView.vue'
import ComposeView from './views/ComposeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'feed', component: FeedView },
    { path: '/post/:id', name: 'post', component: PostView },
    { path: '/compose', name: 'compose', component: ComposeView },
    { path: '/edit/:id', name: 'edit', component: ComposeView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
