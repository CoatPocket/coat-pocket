<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addPost, editPost, getPost } from '../store.js'
import { todayDate, validatePostInput } from '../lib/posts.js'
import { compressImageFile } from '../lib/image.js'

const route = useRoute()
const router = useRouter()

const editingId = computed(() => (route.name === 'edit' ? route.params.id : null))
const missing = computed(() => editingId.value && !getPost(editingId.value))

const form = reactive({
  title: '',
  body: '',
  tag: '',
  date: todayDate(),
  coverImage: '',
})

const errors = ref({})
const imageError = ref('')
const compressing = ref(false)

function loadFromPost(post) {
  form.title = post.title
  form.body = post.body
  form.tag = post.tag
  form.date = post.date || todayDate()
  form.coverImage = post.coverImage || ''
}

watch(
  () => route.fullPath,
  () => {
    errors.value = {}
    imageError.value = ''
    if (editingId.value) {
      const post = getPost(editingId.value)
      if (post) loadFromPost(post)
    } else {
      form.title = ''
      form.body = ''
      form.tag = ''
      form.date = todayDate()
      form.coverImage = ''
    }
  },
  { immediate: true },
)

const canPublish = computed(() => validatePostInput(form).ok)

async function onFile(event) {
  const file = event.target.files && event.target.files[0]
  event.target.value = ''
  if (!file) return
  imageError.value = ''
  compressing.value = true
  try {
    form.coverImage = await compressImageFile(file)
  } catch (err) {
    imageError.value = err.message || 'Could not use that image.'
  } finally {
    compressing.value = false
  }
}

function clearCover() {
  form.coverImage = ''
  imageError.value = ''
}

function submit() {
  const result = validatePostInput(form)
  errors.value = result.errors
  if (!result.ok) return
  const payload = {
    title: form.title,
    body: form.body,
    tag: form.tag,
    date: form.date || todayDate(),
    coverImage: form.coverImage,
  }
  const post = editingId.value ? editPost(editingId.value, payload) : addPost(payload)
  router.push({ name: 'post', params: { id: post.id } })
}
</script>

<template>
  <div v-if="missing" class="page">
    <p class="empty">That post is not on this phone.</p>
    <RouterLink class="btn-ghost" to="/">Back to feed</RouterLink>
  </div>
  <form v-else class="page compose" @submit.prevent="submit">
    <h1 class="compose-title">{{ editingId ? 'Edit post' : 'New post' }}</h1>

    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" type="text" autocomplete="off" required />
      <p v-if="errors.title" class="err">{{ errors.title }}</p>
    </div>

    <div class="field">
      <label for="body">Body</label>
      <textarea id="body" v-model="form.body" required />
      <p v-if="errors.body" class="err">{{ errors.body }}</p>
    </div>

    <div class="field">
      <label for="tag">Tag</label>
      <select id="tag" v-model="form.tag" required>
        <option disabled value="">Choose game or app</option>
        <option value="game">Game</option>
        <option value="app">App</option>
      </select>
      <p v-if="errors.tag" class="err">{{ errors.tag }}</p>
    </div>

    <div class="field">
      <label for="date">Date</label>
      <input id="date" v-model="form.date" type="date" />
    </div>

    <div class="field">
      <label for="cover">Cover image URL</label>
      <input id="cover" v-model="form.coverImage" type="text" inputmode="url" placeholder="https://…" />
    </div>

    <div class="btn-row compose-files">
      <label class="btn-ghost file-btn">
        {{ compressing ? 'Compressing…' : 'Choose file' }}
        <input type="file" accept="image/*" :disabled="compressing" @change="onFile" />
      </label>
      <button v-if="form.coverImage" class="btn-ghost" type="button" @click="clearCover">Remove cover</button>
    </div>
    <p v-if="imageError" class="err">{{ imageError }}</p>
    <img v-if="form.coverImage" class="preview" :src="form.coverImage" alt="Cover preview" />

    <div class="btn-row compose-actions">
      <RouterLink class="btn-ghost" to="/">Cancel</RouterLink>
      <button class="btn-signal" type="submit" :disabled="!canPublish">
        {{ editingId ? 'Save' : 'Publish' }}
      </button>
    </div>
  </form>
</template>
