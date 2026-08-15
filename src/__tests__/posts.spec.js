import { describe, expect, it } from 'vitest'
import {
  STORAGE_KEY,
  createPost,
  filterByTag,
  initPosts,
  loadPosts,
  savePosts,
  sortNewestFirst,
  todayDate,
  oneLine,
  updatePost,
  validatePostInput,
} from '../lib/posts.js'

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed))
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      map.set(k, String(v))
    },
    removeItem: (k) => {
      map.delete(k)
    },
    clear: () => map.clear(),
    _map: map,
  }
}

describe('create post validation', () => {
  it('rejects missing title, body, and tag', () => {
    const empty = validatePostInput({})
    expect(empty.ok).toBe(false)
    expect(empty.errors.title).toBeTruthy()
    expect(empty.errors.body).toBeTruthy()
    expect(empty.errors.tag).toBeTruthy()

    expect(() => createPost({ title: '', body: 'x', tag: 'game' })).toThrow('Validation failed')
    expect(() => createPost({ title: 'x', body: '   ', tag: 'game' })).toThrow('Validation failed')
    expect(() => createPost({ title: 'x', body: 'y', tag: 'other' })).toThrow('Validation failed')
    expect(() => createPost({ title: 'x', body: 'y' })).toThrow('Validation failed')
  })

  it('creates a post when title, body, and tag are present', () => {
    const post = createPost({ title: '  Hello  ', body: 'World', tag: 'game' }, { id: 'p1', now: 1000 })
    expect(post.id).toBe('p1')
    expect(post.title).toBe('Hello')
    expect(post.body).toBe('World')
    expect(post.tag).toBe('game')
  })
})

describe('date default', () => {
  it('defaults date to today when omitted', () => {
    const now = new Date('2026-08-15T15:30:00')
    expect(todayDate(now)).toBe('2026-08-15')
    const post = createPost(
      { title: 'T', body: 'B', tag: 'app' },
      { now: now.getTime(), id: 'd1' },
    )
    expect(post.date).toBe('2026-08-15')
  })

  it('keeps an explicit date', () => {
    const post = createPost(
      { title: 'T', body: 'B', tag: 'app', date: '2026-01-02' },
      { now: Date.parse('2026-08-15T00:00:00Z'), id: 'd2' },
    )
    expect(post.date).toBe('2026-01-02')
  })
})

describe('filter by game vs app', () => {
  const posts = [
    createPost({ title: 'G', body: 'b', tag: 'game' }, { id: 'g1', now: 1 }),
    createPost({ title: 'A', body: 'b', tag: 'app' }, { id: 'a1', now: 2 }),
    createPost({ title: 'G2', body: 'b', tag: 'game' }, { id: 'g2', now: 3 }),
  ]

  it('returns only games or only apps', () => {
    expect(filterByTag(posts, 'game').map((p) => p.id)).toEqual(['g1', 'g2'])
    expect(filterByTag(posts, 'app').map((p) => p.id)).toEqual(['a1'])
  })

  it('returns all when tag is all or empty', () => {
    expect(filterByTag(posts, 'all')).toHaveLength(3)
    expect(filterByTag(posts, '')).toHaveLength(3)
  })
})

describe('edit updates the same id', () => {
  it('replaces fields on the matching post and keeps the id', () => {
    const original = createPost({ title: 'Old', body: 'one', tag: 'game' }, { id: 'keep-me', now: 50 })
    const extra = createPost({ title: 'Other', body: 'two', tag: 'app' }, { id: 'other', now: 40 })
    const { posts, post } = updatePost([original, extra], 'keep-me', {
      title: 'New title',
      body: 'updated body',
      tag: 'app',
      date: '2026-07-01',
      coverImage: 'https://example.com/c.jpg',
    })
    expect(post.id).toBe('keep-me')
    expect(post.title).toBe('New title')
    expect(post.body).toBe('updated body')
    expect(post.tag).toBe('app')
    expect(post.date).toBe('2026-07-01')
    expect(post.createdAt).toBe(50)
    expect(posts.find((p) => p.id === 'keep-me').title).toBe('New title')
    expect(posts.find((p) => p.id === 'other').title).toBe('Other')
    expect(posts).toHaveLength(2)
  })
})

describe('newest-first sort', () => {
  it('orders by date then createdAt, newest first', () => {
    const posts = [
      createPost({ title: 'old', body: 'b', tag: 'game', date: '2026-01-01' }, { id: 'a', now: 300 }),
      createPost({ title: 'new', body: 'b', tag: 'app', date: '2026-08-15' }, { id: 'b', now: 100 }),
      createPost({ title: 'mid later', body: 'b', tag: 'game', date: '2026-03-01' }, { id: 'c', now: 250 }),
      createPost({ title: 'mid earlier', body: 'b', tag: 'app', date: '2026-03-01' }, { id: 'd', now: 200 }),
    ]
    expect(sortNewestFirst(posts).map((p) => p.id)).toEqual(['b', 'c', 'd', 'a'])
  })
})

describe('persist + reload', () => {
  it('restores posts from storage after a reload', () => {
    const store = memoryStorage()
    const first = initPosts(store)
    expect(first.length).toBeGreaterThanOrEqual(2)
    expect(first.some((p) => p.tag === 'game')).toBe(true)
    expect(first.some((p) => p.tag === 'app')).toBe(true)

    const added = createPost({ title: 'Live', body: 'note', tag: 'game' }, { id: 'live-1', now: 9 })
    const all = [added, ...first]
    savePosts(all, store)

    const reloaded = loadPosts(store)
    expect(reloaded.map((p) => p.id)).toEqual(all.map((p) => p.id))
    expect(reloaded.find((p) => p.id === 'live-1').title).toBe('Live')

    const afterBoot = initPosts(store)
    expect(afterBoot.find((p) => p.id === 'live-1')).toBeTruthy()
    expect(store.getItem(STORAGE_KEY)).toBeTruthy()
  })
})

describe('one-line feed copy', () => {
  it('takes the first sentence and trims long lines', () => {
    expect(oneLine('A tiny stall. A long night. More.')).toBe('A tiny stall.')
    expect(oneLine('x'.repeat(80)).length).toBeLessThanOrEqual(73)
  })
})
