<script setup lang="ts">
import { computed, ref } from 'vue'

import AppIcon from '@/components/AppIcon.vue'
import MovieCard from '@/components/MovieCard.vue'
import { movies } from '@/data/cinema'
import { t } from '@/stores/i18n'

// ── Все уникальные жанры из данных ──
const allGenres = computed(() => {
  const set = new Set<string>()
  movies.forEach((m) => m.genre.forEach((g) => set.add(g)))
  return ['Все', ...Array.from(set).sort()]
})

// ── Все возрастные рейтинги ──
const allRatings = computed(() => {
  const set = new Set<string>()
  movies.forEach((m) => set.add(m.ageRating))
  return ['Все', ...Array.from(set).sort()]
})

// ── Состояние фильтров ──
const search = ref('')
const selectedGenre = ref('Все')
const selectedRating = ref('Все')
const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'duration'>('default')

const resetFilters = () => {
  search.value = ''
  selectedGenre.value = 'Все'
  selectedRating.value = 'Все'
  sortBy.value = 'default'
}

const hasActiveFilters = computed(
  () =>
    search.value !== '' ||
    selectedGenre.value !== 'Все' ||
    selectedRating.value !== 'Все' ||
    sortBy.value !== 'default',
)

// ── Фильтрация и сортировка ──
const filtered = computed(() => {
  let list = [...movies]

  // Поиск по названию
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter((m) => m.title.toLowerCase().includes(q))
  }

  // Жанр
  if (selectedGenre.value !== 'Все') {
    list = list.filter((m) => m.genre.includes(selectedGenre.value))
  }

  // Возрастной рейтинг
  if (selectedRating.value !== 'Все') {
    list = list.filter((m) => m.ageRating === selectedRating.value)
  }

  // Сортировка
  if (sortBy.value === 'duration') {
    list.sort((a, b) => a.duration - b.duration)
  }

  return list
})
</script>

<template>
  <section class="stage min-h-screen pt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Заголовок -->
      <p class="eyebrow mb-2">{{ t('afisha.eyebrow') }}</p>
      <h1 class="display mb-7 text-[clamp(2rem,4vw,3rem)] text-copy">{{ t('afisha.title') }}</h1>

      <!-- ── Панель фильтров ── -->
      <div class="mb-6 flex flex-col gap-4 rounded-2xl border border-line bg-panel px-6 py-5 shadow-[var(--shadow-card)]">

        <!-- Поиск -->
        <div class="relative flex items-center">
          <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3.5 text-dim" />
          <input
            v-model="search"
            class="w-full rounded-xl border border-line bg-surface-soft py-2.5 pl-10 pr-10 text-[0.9rem] text-copy outline-none transition placeholder:text-fade focus:border-brand"
            type="text"
            placeholder="Поиск по названию…"
            autocomplete="off"
          />
          <button v-if="search" class="absolute right-3 rounded-md bg-transparent p-1 text-dim transition hover:text-copy" @click="search = ''">
            <AppIcon name="close" :size="14" />
          </button>
        </div>

        <!-- Жанр -->
        <div class="flex flex-col gap-2">
          <label class="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-dim">Жанр</label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="g in allGenres"
              :key="g"
              class="rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition"
              :class="
                selectedGenre === g
                  ? 'border-brand/50 bg-brand/15 font-semibold text-brand'
                  : 'border-line bg-surface-soft text-muted hover:border-line-strong hover:text-copy'
              "
              @click="selectedGenre = g"
            >
              {{ g }}
            </button>
          </div>
        </div>

        <!-- Возраст + Сортировка -->
        <div class="flex flex-wrap items-end gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-dim">Возраст</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="r in allRatings"
                :key="r"
                class="rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition"
                :class="
                  selectedRating === r
                    ? 'border-brand/50 bg-brand/15 font-semibold text-brand'
                    : 'border-line bg-surface-soft text-muted hover:border-line-strong hover:text-copy'
                "
                @click="selectedRating = r"
              >
                {{ r }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-dim">Сортировка</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                class="rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition"
                :class="
                  sortBy === 'default'
                    ? 'border-brand/50 bg-brand/15 font-semibold text-brand'
                    : 'border-line bg-surface-soft text-muted hover:border-line-strong hover:text-copy'
                "
                @click="sortBy = 'default'"
              >
                По умолчанию
              </button>
              <button
                class="rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition"
                :class="
                  sortBy === 'duration'
                    ? 'border-brand/50 bg-brand/15 font-semibold text-brand'
                    : 'border-line bg-surface-soft text-muted hover:border-line-strong hover:text-copy'
                "
                @click="sortBy = 'duration'"
              >
                По длительности
              </button>
            </div>
          </div>

          <!-- Сброс -->
          <button
            v-if="hasActiveFilters"
            class="inline-flex h-fit items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-[0.78rem] font-medium text-danger transition hover:bg-danger/20"
            @click="resetFilters"
          >
            <AppIcon name="rotate-ccw" :size="13" />
            Сбросить
          </button>
        </div>
      </div>

      <!-- Результат / счётчик -->
      <div class="mb-4">
        <span class="text-[0.82rem] text-dim">
          {{ filtered.length === movies.length
            ? `${movies.length} фильмов`
            : `Найдено: ${filtered.length} из ${movies.length}` }}
        </span>
      </div>

      <!-- Сетка фильмов -->
      <div v-if="filtered.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <MovieCard v-for="m in filtered" :key="m.id" :movie="m" />
      </div>

      <!-- Ничего не найдено -->
      <div v-else class="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div class="mb-5 grid h-[72px] w-[72px] place-items-center rounded-full border border-line bg-surface-soft text-dim">
          <AppIcon name="search" :size="32" />
        </div>
        <div class="mb-1.5 text-[1.1rem] font-bold text-copy">Ничего не найдено</div>
        <div class="max-w-[280px] text-[0.85rem] text-dim">Попробуйте изменить фильтры или поисковый запрос</div>
        <button class="btn-ghost mt-4" @click="resetFilters">
          <AppIcon name="rotate-ccw" :size="14" />
          Сбросить фильтры
        </button>
      </div>

    </div>
  </section>
</template>
