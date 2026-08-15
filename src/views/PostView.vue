<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from '../store.js'

const route = useRoute()
const post = computed(() => getPost(route.params.id))
const ink = computed(() => post.value && post.value.tag === 'game')

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const dt = new Date(Number(y), Number(m) - 1, Number(d))
  return dt.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <article v-if="post" class="note" :class="{ 'note-ink': ink }">
    <div class="note-hero">
      <img v-if="post.coverImage" :src="post.coverImage" :alt="`${post.title} screenshot`" />
      <div v-else class="hero-empty" aria-hidden="true" />
    </div>
    <p class="note-meta">
      <span>{{ post.tag }}</span>
      <span>{{ formatDate(post.date) }}</span>
    </p>
    <h1 class="note-title">{{ post.title }}</h1>
    <p class="body">{{ post.body }}</p>
    <div class="btn-row note-actions">
      <RouterLink class="btn-ghost" to="/">Back</RouterLink>
      <RouterLink class="btn-ghost" :to="{ name: 'edit', params: { id: post.id } }">Edit</RouterLink>
    </div>
  </article>
  <div v-else class="page">
    <p class="empty">That post is not on this phone.</p>
    <RouterLink class="btn-ghost" to="/">Back to feed</RouterLink>
  </div>
</template>
