<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from './store.js'
import PocketMark from './components/PocketMark.vue'

const route = useRoute()

const onFeed = computed(() => route.name === 'feed')
const ink = computed(() => {
  if (route.name !== 'post') return false
  const post = getPost(route.params.id)
  return Boolean(post && post.tag === 'game')
})
const hideNew = computed(() => route.name === 'compose' || route.name === 'edit')
</script>

<template>
  <div class="root" :class="{ ink, feed: onFeed }">
    <header v-if="!onFeed" class="mast">
      <RouterLink class="brand" to="/" aria-label="coat pocket home">
        <PocketMark />
        <span class="wordmark">coat pocket</span>
      </RouterLink>
      <RouterLink v-if="!hideNew" class="new" to="/compose">New</RouterLink>
    </header>
    <RouterView />
  </div>
</template>
