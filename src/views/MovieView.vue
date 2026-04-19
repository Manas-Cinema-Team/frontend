<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import {
  availableDates,
  findMovieById,
  formatDuration,
  type Showtime,
} from '@/data/cinema'

const route = useRoute()
const router = useRouter()
const movie = computed(() => findMovieById(route.params.id as string))

const selectedDateIdx = ref(0)
const hoveredId = ref<string | null>(null)

const showtimesForDate = computed(() => {
  if (!movie.value) return []
  const d = availableDates[selectedDateIdx.value]!
  return movie.value.showtimes.filter((s) => s.date === d.date)
})

const openSeats = (s: Showtime) => {
  if (!movie.value) return
  router.push(`/movies/${movie.value.id}/seats/${s.id}`)
}

const taken = (s: Showtime) => s.totalSeats - s.availableSeats
const percentTaken = (s: Showtime) => Math.round((taken(s) / s.totalSeats) * 100)
</script>

<template>
  <div v-if="!movie" class="min-h-screen stage-radial flex items-center justify-center">
    <div class="text-center" style="color: #71717a">
      Фильм не найден.
      <button class="btn-amber mt-6" @click="router.push('/')">На главную</button>
    </div>
  </div>

  <div v-else>
    <!-- HERO — CSS stage, framed poster, no external backdrop -->
    <section class="relative stage" style="min-height: 75vh; padding-top: 6rem">
      <div class="spotlight" />

      <div class="absolute top-24 left-4 sm:left-8 z-10">
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style="
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #d4d4d8;
            font-size: 0.875rem;
            font-weight: 500;
          "
          @click="router.back()"
        >
          <AppIcon name="arrow-left" :size="18" />
          Назад
        </button>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div class="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
            <div class="poster-frame relative" style="width: 100%; max-width: 280px; aspect-ratio: 2 / 3">
              <img :src="movie.poster" :alt="movie.title" />
              <div
                class="absolute -inset-3 -z-10 rounded-3xl"
                style="
                  background:
                    radial-gradient(ellipse at 20% 10%, rgba(245,158,11,0.28), transparent 60%),
                    radial-gradient(ellipse at 80% 90%, rgba(168,85,247,0.18), transparent 60%);
                  filter: blur(24px);
                "
              />
            </div>
          </div>

          <div class="md:col-span-8 lg:col-span-9">
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="g in movie.genres" :key="g" class="chip">{{ g }}</span>
            </div>

            <h1
              class="display mb-3"
              style="
                color: #fff;
                font-size: clamp(2.5rem, 6vw, 4.5rem);
                line-height: 1;
                letter-spacing: 0.02em;
              "
            >
              {{ movie.title }}
            </h1>
            <p class="italic mb-5" style="color: #a1a1aa; font-size: 1rem">
              {{ movie.tagline }}
            </p>

            <div class="flex flex-wrap items-center gap-5">
              <div class="flex items-center gap-1.5">
                <AppIcon name="star" :size="18" fill="#f59e0b" />
                <span style="color: #f59e0b; font-size: 1.2rem; font-weight: 700">
                  {{ movie.imdbRating.toFixed(1) }}
                </span>
                <span style="color: #71717a; font-size: 0.85rem">/10</span>
              </div>
              <div class="flex items-center gap-1.5" style="color: #a1a1aa">
                <AppIcon name="clock" :size="16" />
                <span style="font-size: 0.9rem">{{ formatDuration(movie.duration) }}</span>
              </div>
              <div
                class="px-3 py-1 rounded-lg"
                style="
                  background: rgba(255, 255, 255, 0.07);
                  border: 1px solid rgba(255, 255, 255, 0.12);
                  color: #e4e4e7;
                  font-size: 0.85rem;
                  font-weight: 600;
                "
              >
                {{ movie.ageRating }}
              </div>
              <span style="color: #71717a; font-size: 0.9rem">{{ movie.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DETAILS + SHOWTIMES -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-1 space-y-8">
          <div>
            <h3
              style="
                font-size: 0.75rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                font-weight: 600;
                color: #a1a1aa;
                margin-bottom: 0.9rem;
              "
            >
              Описание
            </h3>
            <p style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.7">
              {{ movie.description }}
            </p>
          </div>

          <div class="surface p-5">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                style="background: rgba(245, 158, 11, 0.12)"
              >
                <AppIcon name="film" :size="16" fill="#f59e0b" />
              </div>
              <span
                style="
                  color: #a1a1aa;
                  font-size: 0.78rem;
                  font-weight: 600;
                  letter-spacing: 0.1em;
                  text-transform: uppercase;
                "
              >
                Режиссёр
              </span>
            </div>
            <p style="color: #fff; font-size: 1rem; font-weight: 600">{{ movie.director }}</p>
          </div>

          <div class="surface p-5">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                style="background: rgba(245, 158, 11, 0.12)"
              >
                <AppIcon name="users" :size="16" fill="#f59e0b" />
              </div>
              <span
                style="
                  color: #a1a1aa;
                  font-size: 0.78rem;
                  font-weight: 600;
                  letter-spacing: 0.1em;
                  text-transform: uppercase;
                "
              >
                В ролях
              </span>
            </div>
            <div class="space-y-2">
              <div v-for="actor in movie.cast" :key="actor" class="flex items-center gap-2">
                <div
                  class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style="background: #f59e0b"
                />
                <span style="color: #d4d4d8; font-size: 0.9rem">{{ actor }}</span>
              </div>
            </div>
          </div>

          <button class="btn-ghost w-full">
            <AppIcon name="play" :size="18" fill="currentColor" />
            Смотреть трейлер
          </button>
        </div>

        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="
                background: rgba(245, 158, 11, 0.12);
                border: 1px solid rgba(245, 158, 11, 0.2);
              "
            >
              <AppIcon name="calendar" :size="16" fill="#f59e0b" />
            </div>
            <h2
              class="display"
              style="color: #fff; font-size: 1.8rem; letter-spacing: 0.05em"
            >
              Выбор сеанса
            </h2>
          </div>

          <div
            v-if="movie.status === 'soon'"
            class="surface p-12 text-center"
          >
            <div class="flex justify-center mb-4" style="color: #3f3f46">
              <AppIcon name="calendar" :size="40" />
            </div>
            <h3
              style="color: #d4d4d8; font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem"
            >
              Премьера {{ movie.releaseDate }}
            </h3>
            <p style="color: #52525b; font-size: 0.9rem">
              Билеты пока недоступны. Загляните позже.
            </p>
          </div>

          <template v-else>
            <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
              <button
                v-for="(d, i) in availableDates"
                :key="d.date"
                class="flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-200"
                :style="{
                  background:
                    selectedDateIdx === i
                      ? 'rgba(245,158,11,0.15)'
                      : 'rgba(255,255,255,0.04)',
                  border:
                    selectedDateIdx === i
                      ? '1px solid rgba(245,158,11,0.35)'
                      : '1px solid rgba(255,255,255,0.07)',
                  color: selectedDateIdx === i ? '#f59e0b' : '#71717a',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }"
                @click="selectedDateIdx = i"
              >
                {{ d.label }}
              </button>
            </div>

            <div
              v-if="showtimesForDate.length === 0"
              class="surface p-12 text-center"
            >
              <div class="flex justify-center mb-4" style="color: #3f3f46">
                <AppIcon name="clock" :size="40" />
              </div>
              <p style="color: #71717a; font-size: 0.95rem">
                На эту дату сеансов нет.
              </p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="s in showtimesForDate"
                :key="s.id"
                class="p-5 rounded-2xl cursor-pointer"
                :style="{
                  background:
                    hoveredId === s.id ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                  border:
                    hoveredId === s.id
                      ? '1px solid rgba(245,158,11,0.3)'
                      : '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 200ms ease',
                }"
                @click="openSeats(s)"
                @mouseenter="hoveredId = s.id"
                @mouseleave="hoveredId = null"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-baseline gap-2 mb-1">
                      <span
                        class="display"
                        style="
                          color: #fff;
                          font-size: 1.6rem;
                          letter-spacing: 0.04em;
                        "
                      >
                        {{ s.time }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="chip-muted">{{ s.format }}</span>
                      <span style="color: #52525b; font-size: 0.8rem">{{ s.hall }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div style="color: #f59e0b; font-size: 1.1rem; font-weight: 700">
                      от {{ s.priceStandard }} сом
                    </div>
                    <div style="color: #52525b; font-size: 0.75rem">за билет</div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex justify-between items-center mb-1.5">
                    <span style="color: #71717a; font-size: 0.75rem">
                      Мест свободно
                    </span>
                    <span
                      :style="{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: s.availableSeats < 20 ? '#ef4444' : '#a1a1aa',
                      }"
                    >
                      {{ s.availableSeats }} / {{ s.totalSeats }}
                    </span>
                  </div>
                  <div
                    class="h-1.5 rounded-full overflow-hidden"
                    style="background: rgba(255, 255, 255, 0.08)"
                  >
                    <div
                      class="h-full rounded-full"
                      :style="{
                        width: `${percentTaken(s)}%`,
                        background:
                          s.availableSeats < 20
                            ? 'linear-gradient(to right, #b91c1c, #ef4444)'
                            : 'linear-gradient(to right, #d97706, #f59e0b)',
                        transition: 'width 500ms ease',
                      }"
                    />
                  </div>
                </div>

                <button
                  class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl"
                  :style="{
                    background:
                      hoveredId === s.id
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'rgba(245,158,11,0.1)',
                    color: hoveredId === s.id ? '#18181b' : '#f59e0b',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border:
                      hoveredId === s.id
                        ? '1px solid transparent'
                        : '1px solid rgba(245,158,11,0.2)',
                    transition: 'all 200ms ease',
                  }"
                >
                  <AppIcon name="ticket" :size="15" />
                  Выбрать места
                  <AppIcon name="chevron-right" :size="15" />
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
