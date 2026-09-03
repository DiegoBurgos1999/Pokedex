<script setup lang="ts">
withDefaults(defineProps<{ radius?: 'none' | 'xs' | 'pill' }>(), { radius: 'xs' })
</script>

<template>
  <div
    class="skeleton"
    :class="{ 'rounded-pill': radius === 'pill', 'rounded-xs': radius === 'xs' }"
  />
</template>
