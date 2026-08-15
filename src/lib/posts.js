export const STORAGE_KEY = 'coat-pocket-posts'
export const TAGS = ['game', 'app']

export function todayDate(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function oneLine(body, max = 72) {
  const text = String(body || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  const sentence = text.split(/(?<=[.!?])\s+/)[0] || text
  if (sentence.length <= max) return sentence
  return `${sentence.slice(0, max).trimEnd()}…`
}

export function validatePostInput(input = {}) {
  const errors = {}
  if (!input.title || !String(input.title).trim()) {
    errors.title = 'Title is required'
  }
  if (!input.body || !String(input.body).trim()) {
    errors.body = 'Body is required'
  }
  if (!input.tag || !TAGS.includes(input.tag)) {
    errors.tag = 'Tag must be game or app'
  }
  return { ok: Object.keys(errors).length === 0, errors }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createPost(input, { now = Date.now(), id } = {}) {
  const { ok, errors } = validatePostInput(input)
  if (!ok) {
    const err = new Error('Validation failed')
    err.errors = errors
    throw err
  }
  return {
    id: id || newId(),
    title: String(input.title).trim(),
    body: String(input.body).trim(),
    tag: input.tag,
    date: input.date || todayDate(new Date(now)),
    coverImage: input.coverImage || '',
    createdAt: now,
    sample: Boolean(input.sample),
  }
}

export function updatePost(posts, id, input) {
  const { ok, errors } = validatePostInput(input)
  if (!ok) {
    const err = new Error('Validation failed')
    err.errors = errors
    throw err
  }
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) {
    throw new Error('Post not found')
  }
  const updated = {
    ...posts[idx],
    title: String(input.title).trim(),
    body: String(input.body).trim(),
    tag: input.tag,
    date: input.date || posts[idx].date,
    coverImage: input.coverImage ?? posts[idx].coverImage,
  }
  const next = posts.slice()
  next[idx] = updated
  return { posts: next, post: updated }
}

export function filterByTag(posts, tag) {
  if (!tag || tag === 'all') return posts.slice()
  return posts.filter((p) => p.tag === tag)
}

export function sortNewestFirst(posts) {
  return posts.slice().sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return (b.createdAt || 0) - (a.createdAt || 0)
  })
}

export function loadPosts(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function savePosts(posts, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function seedPosts() {
  return [
    createPost(
      {
        title: 'Night Stall',
        body: 'A tiny stall. A long night. Tap ingredients in order, serve the queue, upgrade between nights.',
        tag: 'game',
        date: '2026-08-15',
        coverImage: '/covers/night-stall.png',
        sample: true,
      },
      { now: Date.parse('2026-08-15T18:00:00Z'), id: 'sample-game-night-stall' },
    ),
    createPost(
      {
        title: 'Parked',
        body: 'Paint the floor you parked on. Lock the sign. Walk back to it.',
        tag: 'app',
        date: '2026-08-14',
        coverImage: '/covers/parked.svg',
        sample: true,
      },
      { now: Date.parse('2026-08-14T16:00:00Z'), id: 'sample-app-parked' },
    ),
    createPost(
      {
        title: 'How this pocket works',
        body: 'One post, one screen. Filter Games or Apps. New writes a note on this phone. Edit from the post.',
        tag: 'app',
        date: '2026-08-12',
        coverImage: '/covers/pocket-note.svg',
        sample: true,
      },
      { now: Date.parse('2026-08-12T10:00:00Z'), id: 'sample-howto' },
    ),
  ]
}

export function initPosts(storage) {
  const existing = loadPosts(storage)
  if (existing && existing.length) return existing
  const seeded = seedPosts()
  savePosts(seeded, storage)
  return seeded
}
