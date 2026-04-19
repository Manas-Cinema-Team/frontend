<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

const navLinks = [
  { label: 'Фильмы', to: '/' },
  { label: 'Сейчас', to: '/?filter=now' },
  { label: 'Скоро', to: '/?filter=soon' },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50"
    :style="{
      background: scrolled
        ? 'rgba(8,8,14,0.92)'
        : 'linear-gradient(to bottom, rgba(8,8,14,0.85) 0%, transparent 100%)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'background 400ms ease, border-color 400ms ease, backdrop-filter 400ms ease',
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style="background: linear-gradient(135deg, #f59e0b, #d97706)"
          >
            <AppIcon name="film" :size="20" fill="#fff" />
          </div>
          <span class="display text-2xl" style="letter-spacing: 0.12em">
            <span style="color: #f59e0b">CINE</span><span style="color: #f5f5f5">MAX</span>
          </span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="transition-colors duration-200"
            style="
              font-size: 0.875rem;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              font-weight: 500;
              color: #d4d4d8;
            "
            active-class="!text-amber-400"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="hidden md:flex items-center gap-3">
          <RouterLink
            to="/login"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200"
            style="
              border: 1px solid rgba(255, 255, 255, 0.12);
              color: #d4d4d8;
              font-size: 0.875rem;
              font-weight: 500;
            "
          >
            <AppIcon name="user" :size="16" />
            Вход
          </RouterLink>
          <RouterLink
            to="/register"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200"
            style="
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: #18181b;
              font-size: 0.875rem;
              font-weight: 600;
            "
          >
            <AppIcon name="ticket" :size="16" />
            Регистрация
          </RouterLink>
        </div>

        <button
          class="md:hidden p-2 transition-colors"
          style="color: #d4d4d8"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="24" />
        </button>
      </div>
    </div>

    <div
      v-if="menuOpen"
      class="md:hidden"
      style="
        background: rgba(8, 8, 14, 0.97);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      "
    >
      <div class="px-4 py-6 flex flex-col gap-4">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="py-2 transition-colors"
          style="font-size: 1rem; font-weight: 500; color: #d4d4d8"
        >
          {{ link.label }}
        </RouterLink>
        <div
          class="flex flex-col gap-3 pt-4"
          style="border-top: 1px solid rgba(255, 255, 255, 0.08)"
        >
          <RouterLink
            to="/login"
            class="w-full text-center py-3 rounded-xl"
            style="border: 1px solid rgba(255, 255, 255, 0.12); color: #d4d4d8; font-weight: 500"
          >
            Вход
          </RouterLink>
          <RouterLink
            to="/register"
            class="w-full text-center py-3 rounded-xl"
            style="
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: #18181b;
              font-weight: 600;
            "
          >
            Регистрация
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
