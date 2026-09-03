<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill px-9 py-4 font-sans text-base font-semibold transition-transform duration-base ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-brand text-white shadow-brand hover:-translate-y-0.5': variant === 'primary',
      'bg-neutral-button text-ink hover:bg-neutral-button-hover': variant === 'secondary',
      'bg-accent text-white shadow-danger hover:-translate-y-0.5': variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
