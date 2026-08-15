<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { feed } from '../store.js'
import { oneLine } from '../lib/posts.js'
import PocketMark from '../components/PocketMark.vue'

const route = useRoute()
const router = useRouter()

const tag = computed(() => {
  const t = route.query.tag
  return t === 'game' || t === 'app' ? t : 'all'
})

const posts = computed(() => feed(tag.value))

function setTag(next) {
  if (next === 'all') {
    router.replace({ path: '/', query: {} })
  } else {
    router.replace({ path: '/', query: { tag: next } })
  }
}

function ctaLabel(post) {
  return post.tag === 'game' ? 'Play' : 'Open'
}
</script>

<template>
  <div class="feed-page">
    <div v-if="!posts.length" class="feed" role="feed">
      <article class="slide slide-bone">
        <div class="slide-mast">
          <RouterLink class="brand" to="/" aria-label="coat pocket home">
            <PocketMark />
            <span class="wordmark">coat pocket</span>
          </RouterLink>
          <RouterLink class="new" to="/compose">New</RouterLink>
        </div>
        <nav class="sections" aria-label="Filter posts">
          <button type="button" :aria-pressed="tag === 'all'" @click="setTag('all')">All</button>
          <button type="button" :aria-pressed="tag === 'game'" @click="setTag('game')">Games</button>
          <button type="button" :aria-pressed="tag === 'app'" @click="setTag('app')">Apps</button>
        </nav>
        <p class="empty feed-empty">Nothing in this pocket yet.</p>
      </article>
    </div>

    <div v-else class="feed" role="feed">
      <article
        v-for="post in posts"
        :key="post.id"
        class="slide"
        :class="post.tag === 'game' ? 'slide-ink' : 'slide-bone'"
      >
        <div class="slide-mast">
          <RouterLink class="brand" to="/" aria-label="coat pocket home">
            <PocketMark />
            <span class="wordmark">coat pocket</span>
          </RouterLink>
          <RouterLink class="new" to="/compose">New</RouterLink>
        </div>
        <nav class="sections" aria-label="Filter posts">
          <button type="button" :aria-pressed="tag === 'all'" @click="setTag('all')">All</button>
          <button type="button" :aria-pressed="tag === 'game'" @click="setTag('game')">Games</button>
          <button type="button" :aria-pressed="tag === 'app'" @click="setTag('app')">Apps</button>
        </nav>
        <h1 class="slide-title">{{ post.title }}</h1>
        <p class="slide-line">{{ oneLine(post.body) }}</p>
        <div class="slide-hero">
          <img v-if="post.coverImage" :src="post.coverImage" :alt="`${post.title} screenshot`" />
          <div v-else class="hero-empty" aria-hidden="true" />
        </div>
        <RouterLink
          class="cta"
          :to="{ name: 'post', params: { id: post.id } }"
        >{{ ctaLabel(post) }}</RouterLink>
      </article>
    </div>
  </div>
</template>
