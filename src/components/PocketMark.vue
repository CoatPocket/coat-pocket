<script setup>
defineProps({
  inverse: { type: Boolean, default: false },
})
</script>

<template>
  <svg class="pocket-mark" viewBox="0 0 64 64" width="28" height="44" aria-hidden="true">
    <defs>
      <mask :id="inverse ? 'welt-inv' : 'welt'">
        <rect width="64" height="64" fill="#fff" />
        <rect x="24" y="18" width="16" height="5" rx="2.5" fill="#000" />
      </mask>
    </defs>
    <rect
      x="18"
      y="10"
      width="28"
      height="44"
      rx="8"
      :fill="inverse ? '#F3EDE3' : '#111111'"
      :mask="inverse ? 'url(#welt-inv)' : 'url(#welt)'"
    />
  </svg>
</template>
