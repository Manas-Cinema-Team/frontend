<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import MovieCard from '@/components/MovieCard.vue'
import {
  comingSoonMovies,
  featuredMovies,
  nowPlayingMovies,
  popularMovies,
  popularShowtimes,
} from '@/data/cinema'

const router = useRouter()
const route = useRoute()

type Tab = 'now' | 'soon' | 'popular'
const activeTab = ref<Tab>('now')
watch(
  () => route.query.filter,
  (filter) => {
    if (filter === 'now') activeTab.value = 'now'
    else if (filter === 'soon') activeTab.value = 'soon'
    else if (filter === 'popular') activeTab.value = 'popular'
  },
  { immediate: true },
)

const displayed = computed(() => {
  if (activeTab.value === 'soon') return comingSoonMovies
  if (activeTab.value === 'popular') return popularMovies
  return nowPlayingMovies
})

const featured = computed(() => featuredMovies.slice(0, 4))

const openMovie = (id: string) => router.push(`/movies/${id}`)
const openShowtime = (movieId: string, showtimeId: string) =>
  router.push(`/movies/${movieId}/seats/${showtimeId}`)

const scrollToMovies = () => {
  document.getElementById('whats-playing')?.scrollIntoView({ behavior: 'smooth' })
}

const seatsColor = (available: number) => {
  if (available < 20) return '#ef4444'
  if (available < 60) return '#f59e0b'
  return '#22c55e'
}

const formats = [
  {
    icon: 'film' as const,
    title: 'IMAX',
    sub: 'Экран во всю стену. Кадр в кадре.',
  },
  {
    icon: 'popcorn' as const,
    title: 'Dolby Atmos',
    sub: 'Объёмный звук, бьющий прямо в грудь.',
  },
  {
    icon: 'star' as const,
    title: 'VIP-лаундж',
    sub: 'Кожаные кресла, плед и официант.',
  },
  {
    icon: 'ticket' as const,
    title: '4K · 3D',
    sub: 'Кристальная картинка в любом формате.',
  },
]
</script>

<template>
  <div>
    <!-- ─── HERO — fully movie-independent, CSS-only cinematics ─── -->
    <section class="stage relative w-full overflow-hidden" style="min-height: 100vh">
      <div class="spotlight" />

      <!-- drifting film-strip decoration -->
      <div class="film-strip" aria-hidden="true">
        <div v-for="n in 14" :key="n" class="film-cell" />
      </div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 min-h-screen flex items-center"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div class="lg:col-span-7">
            <div
              class="flex items-center gap-3 mb-6 w-fit px-4 py-2 rounded-full"
              style="
                background: rgba(245, 158, 11, 0.08);
                border: 1px solid rgba(245, 158, 11, 0.25);
              "
            >
              <span
                class="w-2 h-2 rounded-full ping-ring"
                style="background: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.9)"
              />
              <span
                style="
                  color: #f59e0b;
                  font-size: 0.78rem;
                  font-weight: 600;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                "
              >
                Сеансы идут прямо сейчас
              </span>
            </div>

            <h1
              class="display mb-5"
              style="
                color: #fff;
                font-size: clamp(3rem, 8vw, 6.25rem);
                line-height: 0.95;
                letter-spacing: 0.02em;
              "
            >
              Кино&nbsp;так, <br />
              как <span style="color: #f59e0b">задумано</span>.
            </h1>

            <p
              class="mb-8"
              style="color: #a1a1aa; font-size: 1.125rem; line-height: 1.7; max-width: 560px"
            >
              IMAX, Dolby Atmos, мягкие VIP-кресла и бар до самых титров. Бронируй место
              за пару кликов — и наслаждайся большим экраном.
            </p>

            <div class="flex flex-wrap gap-4 mb-10">
              <button class="btn-amber" @click="scrollToMovies">
                <AppIcon name="ticket" :size="20" />
                Смотреть афишу
              </button>
              <button class="btn-ghost" @click="router.push('/?filter=soon')">
                <AppIcon name="calendar" :size="18" />
                Скоро в прокате
              </button>
            </div>

            <!-- brand stats, unchanged regardless of movies -->
            <div
              class="grid grid-cols-4 gap-4 max-w-xl pt-6"
              style="border-top: 1px solid rgba(255, 255, 255, 0.08)"
            >
              <div v-for="item in [
                { v: '12', l: 'залов' },
                { v: '4K', l: 'IMAX · 3D' },
                { v: '2400+', l: 'мест' },
                { v: '24/7', l: 'онлайн-бронь' },
              ]" :key="item.l">
                <div
                  class="display"
                  style="color: #f59e0b; font-size: 1.5rem; letter-spacing: 0.04em"
                >
                  {{ item.v }}
                </div>
                <div style="color: #71717a; font-size: 0.75rem; font-weight: 500">
                  {{ item.l }}
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative "screen" panel — pure CSS, no movie assets -->
          <div class="lg:col-span-5 hidden lg:block">
            <div class="cine-screen">
              <div class="cine-screen__beam" />
              <div class="cine-screen__rim" />
              <div class="cine-screen__grid" />
              <div class="cine-screen__badge">
                <AppIcon name="film" :size="14" fill="#f59e0b" />
                <span>NOW SHOWING</span>
              </div>
              <div class="cine-screen__bar" />
              <div class="cine-screen__rows">
                <div v-for="r in 3" :key="r" class="cine-screen__row">
                  <div v-for="c in 14" :key="c" class="cine-screen__seat" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- subtle scroll cue -->
      <div
        class="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span
          style="
            color: #a1a1aa;
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          "
        >
          Scroll
        </span>
        <div class="scroll-dot" />
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, #08080e)"
      />
    </section>

    <!-- ─── FEATURED STRIP — movies inside isolated frames, not backdrops ─── -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-end justify-between gap-6 mb-8 flex-wrap">
        <div>
          <p class="eyebrow mb-2">В центре внимания</p>
          <h2
            class="display"
            style="color: #fff; font-size: clamp(1.8rem, 3.5vw, 2.6rem)"
          >
            Выбор редакции
          </h2>
        </div>
        <div class="screen-bar flex-1 max-w-[320px] ml-auto" />
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <MovieCard v-for="m in featured" :key="m.id" :movie="m" />
      </div>
    </section>

    <!-- ─── WHATS PLAYING — tabs + grid ─── -->
    <section id="whats-playing" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p class="eyebrow mb-2">На большом экране</p>
          <h2 class="display" style="color: #fff; font-size: clamp(2rem, 4vw, 3rem)">
            Что смотреть
          </h2>
        </div>

        <div
          class="flex items-center rounded-xl p-1 gap-1"
          style="
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
          "
        >
          <button
            v-for="tab in (['now', 'soon', 'popular'] as const)"
            :key="tab"
            class="px-5 py-2 rounded-lg transition-all duration-200 capitalize"
            :style="{
              background: activeTab === tab ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: activeTab === tab ? '#f59e0b' : '#a1a1aa',
              fontSize: '0.85rem',
              fontWeight: 500,
              border: activeTab === tab
                ? '1px solid rgba(245,158,11,0.25)'
                : '1px solid transparent',
            }"
            @click="activeTab = tab"
          >
            {{ tab === 'now' ? 'Сейчас' : tab === 'soon' ? 'Скоро' : 'Популярное' }}
          </button>
        </div>
      </div>

      <div
        v-if="displayed.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
      >
        <MovieCard v-for="m in displayed" :key="m.id" :movie="m" />
      </div>
      <div v-else class="surface p-12 text-center" style="color: #71717a">
        В этой категории пока пусто
      </div>
    </section>

    <!-- ─── FORMATS SHOWCASE — fully self-sufficient, icon cards ─── -->
    <section class="py-16" style="background: rgba(255, 255, 255, 0.015)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end gap-4 mb-10">
          <div>
            <p class="eyebrow mb-2">Форматы и технологии</p>
            <h2 class="display" style="color: #fff; font-size: clamp(1.8rem, 3.5vw, 2.6rem)">
              Любая сцена — максимум эффекта
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="f in formats" :key="f.title" class="format-card">
            <div class="format-card__icon">
              <AppIcon :name="f.icon" :size="22" fill="#f59e0b" />
            </div>
            <h3 class="display" style="color: #fff; font-size: 1.4rem">{{ f.title }}</h3>
            <p style="color: #a1a1aa; font-size: 0.9rem; line-height: 1.6">{{ f.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── HOT SESSIONS ─── -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end gap-4 mb-10">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="
              background: rgba(245, 158, 11, 0.15);
              border: 1px solid rgba(245, 158, 11, 0.2);
            "
          >
            <AppIcon name="trending-up" :size="20" fill="#f59e0b" />
          </div>
          <div>
            <p class="eyebrow">Успей забронировать</p>
            <h2 class="display" style="color: #fff; font-size: clamp(1.8rem, 3.5vw, 2.6rem)">
              Горячие сеансы сегодня
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="s in popularShowtimes"
            :key="s.id"
            class="flex items-center gap-5 p-5 rounded-2xl cursor-pointer group showtime-row"
            @click="openShowtime(s.movieId, s.id)"
          >
            <div class="poster-frame flex-shrink-0" style="width: 64px; height: 96px">
              <img :src="s.moviePoster" :alt="s.movieTitle" loading="lazy" />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="mb-1 truncate" style="color: #fff; font-size: 1rem; font-weight: 600">
                {{ s.movieTitle }}
              </h3>
              <div
                class="flex flex-wrap items-center gap-3 mb-3"
                style="color: #71717a; font-size: 0.8rem"
              >
                <div class="flex items-center gap-1">
                  <AppIcon name="calendar" :size="13" />
                  <span>{{ s.dateLabel }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <AppIcon name="clock" :size="13" />
                  <span>{{ s.time }}</span>
                </div>
                <span class="chip-muted">{{ s.format }}</span>
                <span class="chip-muted">{{ s.hall }}</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="h-1.5 rounded-full overflow-hidden"
                    style="width: 80px; background: rgba(255, 255, 255, 0.1)"
                  >
                    <div
                      class="h-full rounded-full"
                      :style="{
                        width: `${100 - (s.availableSeats / s.totalSeats) * 100}%`,
                        background: seatsColor(s.availableSeats),
                      }"
                    />
                  </div>
                  <span
                    :style="{
                      fontSize: '0.75rem',
                      color: seatsColor(s.availableSeats),
                      fontWeight: 500,
                    }"
                  >
                    Осталось {{ s.availableSeats }}
                  </span>
                </div>
                <span style="color: #f59e0b; font-weight: 700; font-size: 1rem">
                  от {{ s.priceStandard }} сом
                </span>
              </div>
            </div>

            <div
              class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style="
                background: rgba(245, 158, 11, 0.12);
                border: 1px solid rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                transition: transform 200ms ease;
              "
            >
              <AppIcon name="chevron-right" :size="18" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CINEMA EXPERIENCE — CSS-only ─── -->
    <section class="relative py-24 overflow-hidden stage">
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background:
            radial-gradient(ellipse 60% 55% at 25% 50%, rgba(245,158,11,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 90% 90%, rgba(168,85,247,0.08) 0%, transparent 55%);
        "
      />
      <div
        class="absolute top-1/2 right-[-10%] -translate-y-1/2 hidden lg:block"
        aria-hidden="true"
        style="width: 680px; height: 420px"
      >
        <div
          class="w-full h-full rounded-3xl"
          style="
            background:
              radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.35) 0%, transparent 60%),
              linear-gradient(180deg, #1a1a24 0%, #0b0b12 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
            position: relative;
            overflow: hidden;
          "
        >
          <div
            style="
              position: absolute;
              inset: 30px 40px auto 40px;
              height: 8px;
              background: linear-gradient(
                to right,
                transparent,
                rgba(245, 158, 11, 0.6),
                transparent
              );
              border-radius: 9999px;
              box-shadow: 0 0 24px rgba(245, 158, 11, 0.35);
            "
          />
          <div
            style="
              position: absolute;
              inset: 70px 40px 50px 40px;
              background-image:
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
              background-size: 40px 40px;
              opacity: 0.4;
            "
          />
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-xl">
          <div
            class="flex items-center gap-3 mb-6 w-fit px-4 py-2 rounded-full"
            style="
              background: rgba(245, 158, 11, 0.08);
              border: 1px solid rgba(245, 158, 11, 0.2);
            "
          >
            <AppIcon name="popcorn" :size="16" fill="#f59e0b" />
            <span
              style="
                color: #f59e0b;
                font-size: 0.8rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
              "
            >
              Премиум опыт
            </span>
          </div>

          <h2
            class="display mb-6"
            style="color: #fff; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05"
          >
            Кино так, как и задумано
          </h2>

          <p class="mb-8" style="color: #a1a1aa; font-size: 1rem; line-height: 1.7">
            IMAX-экраны, Dolby Atmos, мягкие VIP-кресла и бар, который работает до самых титров.
            Это то, как ощущается поход в кино, когда ни в чём не идут на компромисс.
          </p>

          <button class="btn-amber" @click="scrollToMovies">
            <AppIcon name="ticket" :size="20" />
            Смотреть афишу
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Drifting film strip ── */
.film-strip {
  position: absolute;
  top: 38%;
  left: -10%;
  right: -10%;
  height: 80px;
  display: flex;
  gap: 14px;
  padding: 10px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25));
  border-top: 2px solid rgba(255, 255, 255, 0.04);
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
  transform: rotate(-4deg);
  opacity: 0.35;
  pointer-events: none;
  animation: strip-drift 40s linear infinite;
}
.film-cell {
  flex: 0 0 90px;
  border-radius: 4px;
  background: linear-gradient(180deg, #1a1a24, #0b0b12);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.5);
}
@keyframes strip-drift {
  from { transform: translateX(0) rotate(-4deg); }
  to { transform: translateX(-30%) rotate(-4deg); }
}

/* ── scroll cue ── */
.scroll-dot {
  width: 2px;
  height: 28px;
  border-radius: 2px;
  background: linear-gradient(to bottom, transparent, #f59e0b, transparent);
  animation: scroll-pulse 1.8s ease-in-out infinite;
}
@keyframes scroll-pulse {
  0%, 100% { opacity: 0.25; transform: translateY(-6px); }
  50% { opacity: 1; transform: translateY(6px); }
}

/* ── Cinematic "screen" decoration, right side of hero ── */
.cine-screen {
  position: relative;
  aspect-ratio: 4 / 5;
  width: 100%;
  max-width: 440px;
  margin-left: auto;
  border-radius: 28px;
  padding: 28px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.28) 0%, transparent 55%),
    linear-gradient(180deg, #15151f 0%, #0a0a12 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  overflow: hidden;
  isolation: isolate;
}
.cine-screen::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
  pointer-events: none;
}
.cine-screen__beam {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
  width: 120%;
  aspect-ratio: 1 / 1;
  background: radial-gradient(ellipse 45% 55% at 50% 50%, rgba(245, 158, 11, 0.35) 0%, transparent 60%);
  filter: blur(6px);
  pointer-events: none;
}
.cine-screen__rim {
  position: absolute;
  inset: 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  pointer-events: none;
}
.cine-screen__grid {
  position: absolute;
  inset: 56px 28px auto 28px;
  height: 54%;
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.14) 0%, rgba(168, 85, 247, 0.08) 60%, rgba(8, 8, 14, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
.cine-screen__grid::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 32px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 32px);
}
.cine-screen__badge {
  position: absolute;
  top: 26px;
  left: 26px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(8, 8, 14, 0.75);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  backdrop-filter: blur(8px);
}
.cine-screen__bar {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 42%;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(to right, transparent, rgba(245, 158, 11, 0.7), transparent);
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.5);
}
.cine-screen__rows {
  position: absolute;
  left: 36px;
  right: 36px;
  bottom: 38px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cine-screen__row {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
.cine-screen__seat {
  flex: 1;
  height: 14px;
  border-radius: 3px 3px 5px 5px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.cine-screen__row:nth-child(1) .cine-screen__seat:nth-child(3n) {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.55), rgba(217, 119, 6, 0.3));
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
}
.cine-screen__row:nth-child(2) .cine-screen__seat:nth-child(4n) {
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.5), rgba(124, 58, 237, 0.3));
  border-color: rgba(168, 85, 247, 0.45);
}

/* ── Format cards ── */
.format-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 300ms ease, border-color 300ms ease, background 300ms ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.format-card:hover {
  transform: translateY(-3px);
  border-color: rgba(245, 158, 11, 0.25);
  background: #181822;
}
.format-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.22);
}

/* ── Showtime row hover ── */
.showtime-row {
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 300ms ease, border-color 300ms ease;
}
.showtime-row:hover {
  transform: translateY(-2px);
  border-color: rgba(245, 158, 11, 0.25);
}

@media (max-width: 640px) {
  .film-strip { display: none; }
}
</style>
