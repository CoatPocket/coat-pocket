import { computed, reactive } from 'vue'
import {
  createPost,
  filterByTag,
  initPosts,
  savePosts,
  sortNewestFirst,
  updatePost,
} from './lib/posts.js'

function storage() {
  return window.localStorage
}

export const state = reactive({
  posts: [],
  ready: false,
})

export function boot() {
  state.posts = initPosts(storage())
  state.ready = true
}

function persist() {
  savePosts(state.posts, storage())
}

export function addPost(input) {
  const post = createPost(input)
  state.posts = [post, ...state.posts]
  persist()
  return post
}

export function editPost(id, input) {
  const result = updatePost(state.posts, id, input)
  state.posts = result.posts
  persist()
  return result.post
}

export function getPost(id) {
  return state.posts.find((p) => p.id === id) || null
}

export function feed(tag) {
  return sortNewestFirst(filterByTag(state.posts, tag))
}

export function useFeed(tagRef) {
  return computed(() => feed(tagRef.value))
}
