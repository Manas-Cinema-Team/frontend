<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { formatDuration, type Movie } from '@/data/cinema'

const props = defineProps<{
  movie: Movie
}>()

const router = useRouter()
const open = () => router.push(`/movies/${props.movie.id}`)

const posterFailed = ref(false)
</script>

<template>
  <div
    class="group relative rounded-2xl overflow-hidden cursor-pointer"
    style="
      background: #14141c;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
      transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
    "
    @click="open"
    @mouseenter="(e) => {
      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.25)'
    }"
    @mouseleave="(e) => {
      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
    }"
  >
    <div class="relative overflow-hidden poster-fade card-poster" style="aspect-ratio: 2 / 3">
      <!-- self-sufficient fallback: shows even if image 404s -->
      <div v-if="posterFailed" class="card-poster__fallback">
        <div class="card-poster__fallback-grid" />
        <AppIcon name="film" :size="36" fill="rgba(245,158,11,0.4)" />
        <span class="display" style="color: #f5f5f5; font-size: 1.2rem; letter-spacing: 0.06em">
          {{ movie.title }}
        </span>
      </div>
      <img
        v-else
        :src="movie.poster"
        :alt="movie.title"
        loading="lazy"
        class="w-full h-full object-cover"
        style="transition: transform 500ms ease"
        @error="posterFailed = true"
      />

      <div class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <div
          class="px-2.5 py-1 rounded-lg"
          style="
            background: rgba(8, 8, 14, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #e4e4e7;
            font-size: 0.72rem;
            font-weight: 600;
          "
        >
          {{ movie.ageRating }}
        </div>
        <div
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg"
          style="background: rgba(8, 8, 14, 0.8); backdrop-filter: blur(8px)"
        >
          <AppIcon name="star" :size="12" fill="#f59e0b" />
          <span style="color: #f59e0b; font-size: 0.75rem; font-weight: 700">
            {{ movie.imdbRating.toFixed(1) }}
          </span>
        </div>
      </div>

      <div
        class="absolute inset-x-0 bottom-0 p-4 flex items-end justify-center opacity-0 group-hover:opacity-100 z-10"
        style="transition: opacity 300ms ease"
      >
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style="
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #18181b;
            font-weight: 600;
            font-size: 0.85rem;
          "
          @click.stop="open"
        >
          <AppIcon name="ticket" :size="15" />
          Купить билет
        </button>
      </div>
    </div>

    <div class="p-4">
      <h3
        class="mb-1.5 truncate"
        style="color: #fff; font-size: 1rem; font-weight: 600"
      >
        {{ movie.title }}
      </h3>
      <div class="flex items-center justify-between gap-2">
        <div
          class="flex items-center gap-1.5 min-w-0"
          style="color: #a1a1aa; font-size: 0.8rem"
        >
          <AppIcon name="clock" :size="13" />
          <span class="whitespace-nowrap">{{ formatDuration(movie.duration) }}</span>
          <span style="color: rgba(255, 255, 255, 0.2)">·</span>
          <span class="truncate">{{ movie.genres[0] }}</span>
        </div>
        <span
          v-if="movie.status === 'now'"
          class="flex-shrink-0 px-2 py-0.5 rounded-md"
          style="
            background: rgba(245, 158, 11, 0.12);
            color: #f59e0b;
            font-size: 0.68rem;
            font-weight: 600;
            border: 1px solid rgba(245, 158, 11, 0.2);
          "
        >
          Сейчас
        </span>
        <span
          v-else
          class="flex-shrink-0 px-2 py-0.5 rounded-md"
          style="
            background: rgba(168, 85, 247, 0.12);
            color: #c4b5fd;
            font-size: 0.68rem;
            font-weight: 600;
            border: 1px solid rgba(168, 85, 247, 0.2);
          "
        >
          Скоро
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-poster__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.18), transparent 60%),
    linear-gradient(180deg, #1a1a24 0%, #0b0b12 100%);
}
.card-poster__fallback-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.6;
}
</style>
