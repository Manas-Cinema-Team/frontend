<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { t } from '@/stores/i18n'

const router = useRouter()
</script>

<template>
  <section class="stage flex min-h-screen items-center justify-center px-4 pb-4 pt-24">
    <div class="text-center max-w-md">
      <h1 class="display text-[clamp(4.5rem,14vw,9rem)] leading-none tracking-[0.04em] text-copy">
        4<span class="text-brand">0</span>4
      </h1>

      <p class="mb-8 mt-4 text-base leading-7 text-dim">
        {{ t('notfound.text') }}
      </p>

      <div class="flex gap-3 justify-center">
        <RouterLink to="/" class="btn-amber">
          <AppIcon name="home" :size="16" />
          {{ t('common.home') }}
        </RouterLink>
        <button class="btn-ghost" type="button" @click="router.back()">
          <AppIcon name="chevron-left" :size="16" />
          {{ t('common.back') }}
        </button>
      </div>
    </div>
  </section>
</template>
