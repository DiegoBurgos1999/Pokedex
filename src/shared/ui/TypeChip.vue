<script setup lang="ts">
import { computed } from 'vue'

import { getTypeTheme, type PokemonType } from '@/features/pokemon/model/pokemonTypeTheme'
import { getTypeIcon } from '@/features/pokemon/model/typeIcons'
import { TYPE_NAME_ES } from '@/features/pokemon/model/typeCopy'

const props = withDefaults(defineProps<{ type: PokemonType; size?: 'sm' | 'md' }>(), {
  size: 'sm',
})

const theme = computed(() => getTypeTheme(props.type))
const icon = computed(() => getTypeIcon(props.type, theme.value.base))
const label = computed(() => TYPE_NAME_ES[props.type])
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-pill py-1 pr-3 pl-1 font-semibold text-white"
    :class="size === 'sm' ? 'text-sm' : 'text-chip py-1.5 pr-4'"
    :style="{ backgroundColor: theme.base }"
  >
    <span
      class="flex shrink-0 items-center justify-center rounded-full bg-white"
      :class="size === 'sm' ? 'h-5 w-5' : 'h-[22px] w-[22px]'"
    >
      <span
        v-if="icon"
        class="block bg-contain bg-center bg-no-repeat"
        :class="icon.isRaster ? 'h-3.5 w-3' : 'h-3.5 w-3.5'"
        :style="{ backgroundImage: icon.backgroundImage }"
      />
      <span
        v-else
        class="block h-2.5 w-2.5 rounded-full"
        :style="{ backgroundColor: theme.base }"
      />
    </span>
    {{ label }}
  </span>
</template>
