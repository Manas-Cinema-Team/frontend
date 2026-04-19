<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
</script>

<template>
  <section class="stage relative overflow-hidden" style="min-height: 100vh; padding-top: 96px">
    <div class="spotlight" />

    <!-- Drifting film strip decoration — pure CSS, no posters -->
    <div class="strip-404" aria-hidden="true">
      <div v-for="n in 18" :key="n" class="strip-404__cell" />
    </div>

    <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p class="eyebrow mb-4">Плёнка оборвалась</p>

      <h1
        class="display leading-none"
        style="
          color: #fff;
          font-size: clamp(6rem, 18vw, 14rem);
          letter-spacing: 0.04em;
          line-height: 0.9;
        "
      >
        4<span style="color: #f59e0b">0</span>4
      </h1>

      <p
        class="mt-6 max-w-lg mx-auto"
        style="color: #a1a1aa; font-size: 1.05rem; line-height: 1.6"
      >
        Этот сеанс не найден. Возможно, страница снята с проката или ссылка устарела.
        Вернитесь к афише и выберите другой фильм.
      </p>

      <div class="flex flex-wrap gap-3 justify-center mt-8">
        <RouterLink to="/" class="btn-amber">
          <AppIcon name="film" :size="18" />
          На главную
        </RouterLink>
        <button class="btn-ghost" type="button" @click="router.back()">
          <AppIcon name="chevron-left" :size="16" />
          Назад
        </button>
      </div>

      <div
        class="mt-14 inline-flex items-center gap-2 px-4 py-2 rounded-full"
        style="
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.22);
          color: #f59e0b;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        "
      >
        <AppIcon name="popcorn" :size="14" fill="#f59e0b" />
        Попкорн всё ещё свежий
      </div>
    </div>
  </section>
</template>

<style scoped>
.strip-404 {
  position: absolute;
  top: 42%;
  left: -10%;
  right: -10%;
  display: flex;
  gap: 14px;
  padding: 12px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
  border-top: 2px solid rgba(255, 255, 255, 0.04);
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
  transform: rotate(-5deg);
  opacity: 0.3;
  pointer-events: none;
  animation: strip-drift 50s linear infinite;
}
.strip-404__cell {
  flex: 0 0 96px;
  height: 68px;
  border-radius: 5px;
  background: linear-gradient(180deg, #1a1a24, #0b0b12);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
@keyframes strip-drift {
  from { transform: translateX(0) rotate(-5deg); }
  to { transform: translateX(-30%) rotate(-5deg); }
}
</style>
