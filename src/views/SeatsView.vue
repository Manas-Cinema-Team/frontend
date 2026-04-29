<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import {
  findHall,
  findMovie,
  findSession,
  formatDateLabel,
  formatPrice,
  formatTime,
} from '@/data/cinema'
import { t, tPlural } from '@/stores/i18n'

const route = useRoute()
const router = useRouter()

const sessionId = computed(() =>
  Array.isArray(route.params.sessionId)
    ? route.params.sessionId[0]
    : route.params.sessionId,
)
const session = computed(() => findSession(sessionId.value))
const movie = computed(() => (session.value ? findMovie(session.value.movieId) : undefined))
const hall = computed(() => (session.value ? findHall(session.value.hallId) : undefined))

// ТЗ 6.6: HTTP-полллинг синхронизирует available / held / booked.
const seedTaken = (row: string, col: number, rowIdx: number): 'booked' | 'held' | null => {
  const seed = (rowIdx * 31 + col * 17 + (sessionId.value ?? '').length * 11) % 100
  if (seed < 10) return 'booked'
  if (seed < 16) return 'held'
  return null
}

const remoteStatus = reactive<Record<string, 'booked' | 'held'>>({})
const selected = ref<Set<string>>(new Set())

const buildRemote = () => {
  if (!hall.value) return
  const schema = hall.value.schema
  schema.rows.forEach((row, rowIdx) => {
    for (let col = 1; col <= schema.seatsPerRow; col++) {
      const key = `${row}${col}`
      const status = seedTaken(row, col, rowIdx)
      if (status) remoteStatus[key] = status
    }
  })
}

let pollTimer: ReturnType<typeof setInterval> | null = null

const pollTick = () => {
  if (!hall.value) return
  const schema = hall.value.schema
  const free: string[] = []
  schema.seats.forEach((s) => {
    if (s.disabled) return
    const key = `${s.row}${s.number}`
    if (!remoteStatus[key] && !selected.value.has(key)) free.push(key)
  })
  if (free.length === 0) return
  const pick = free[Math.floor(Math.random() * free.length)]
  if (!pick) return
  remoteStatus[pick] = Math.random() < 0.5 ? 'held' : 'booked'
}

// ТЗ 6.5: 10-минутный таймер удержания брони.
const HOLD_SECONDS = 10 * 60
const secondsLeft = ref(HOLD_SECONDS)
let holdTimer: ReturnType<typeof setInterval> | null = null

const timerLabel = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

onMounted(() => {
  buildRemote()
  holdTimer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value -= 1
    else if (holdTimer) {
      clearInterval(holdTimer)
      selected.value.clear()
    }
  }, 1000)
  pollTimer = setInterval(pollTick, 7000)
})

onUnmounted(() => {
  if (holdTimer) clearInterval(holdTimer)
  if (pollTimer) clearInterval(pollTimer)
})

const MAX_SEATS = 8

type DisplayStatus = 'available' | 'held' | 'booked' | 'selected' | 'disabled'

const seatStatus = (row: string, col: number): DisplayStatus => {
  const key = `${row}${col}`
  const seat = hall.value?.schema.seats.find((s) => s.row === row && s.number === col)
  if (seat?.disabled) return 'disabled'
  if (selected.value.has(key)) return 'selected'
  return remoteStatus[key] ?? 'available'
}

const toggle = (row: string, col: number) => {
  const key = `${row}${col}`
  const status = seatStatus(row, col)
  if (status === 'held' || status === 'booked' || status === 'disabled') return
  const next = new Set(selected.value)
  if (next.has(key)) next.delete(key)
  else {
    if (next.size >= MAX_SEATS) return
    next.add(key)
  }
  selected.value = next
}

const selectedList = computed(() =>
  [...selected.value]
    .map((k) => {
      const row = k.charAt(0)
      const col = Number(k.slice(1))
      return { row, col, key: k }
    })
    .sort((a, b) => a.key.localeCompare(b.key)),
)

const total = computed(() =>
  selectedList.value.length * (session.value?.price ?? 0),
)

const buildSeatClass = (status: DisplayStatus, demo = false) => {
  const base = demo
    ? 'relative h-[18px] w-[18px] rounded-t-[4px] rounded-b-[6px] border'
    : 'relative grid h-7 w-7 place-items-center rounded-t-[5px] rounded-b-[8px] border text-[0.6rem] font-semibold transition duration-150'

  if (status === 'available') {
    return `${base} border-line-strong bg-panel text-transparent ${demo ? 'pointer-events-none' : 'cursor-pointer hover:-translate-y-px hover:border-success hover:text-muted'}`
  }

  if (status === 'selected') {
    return `${base} border-brand-dark bg-brand text-zinc-900 shadow-[0_0_10px_rgba(245,158,11,0.5)] ${demo ? 'pointer-events-none' : 'cursor-pointer'}`
  }

  if (status === 'held') {
    return `${base} cursor-not-allowed border-brand/45 bg-brand/20 text-transparent opacity-75`
  }

  if (status === 'booked') {
    return `${base} cursor-not-allowed border-danger/50 bg-danger/20 text-transparent before:absolute before:inset-x-1 before:top-1/2 before:h-px before:-translate-y-1/2 before:rotate-45 before:bg-danger before:content-[''] after:absolute after:inset-x-1 after:top-1/2 after:h-px after:-translate-y-1/2 after:-rotate-45 after:bg-danger after:content-['']`
  }

  return `${base} cursor-default border-transparent bg-transparent text-transparent opacity-15`
}

const seatClass = (row: string, col: number) => buildSeatClass(seatStatus(row, col))
const legendSeatClass = (status: Exclude<DisplayStatus, 'disabled'>) => buildSeatClass(status, true)

const confirm = () => {
  if (selectedList.value.length === 0 || !session.value) return
  router.push({
    name: 'payment',
    query: {
      session: session.value.id,
      seats: [...selected.value].join(','),
      total: String(total.value),
    },
  })
}
</script>

<template>
  <div v-if="!session || !movie || !hall" class="stage flex min-h-screen items-center justify-center">
    <div class="text-center text-dim">
      {{ t('seats.notFound') }}
      <button class="btn-amber mt-6" @click="router.push('/schedule')">{{ t('seats.toSchedule') }}</button>
    </div>
  </div>

  <section v-else class="stage min-h-screen pt-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            class="mb-3 inline-flex items-center gap-2 bg-transparent text-[0.85rem] text-dim transition hover:text-copy"
            @click="router.back()"
          >
            <AppIcon name="chevron-left" :size="16" />
            {{ t('common.back') }}
          </button>
          <h1 class="display text-[clamp(1.5rem,3vw,2rem)] text-copy">
            {{ movie.title }}
          </h1>
          <div class="mt-1 flex flex-wrap gap-3 text-[0.85rem] text-muted">
            <span class="flex items-center gap-1">
              <AppIcon name="calendar" :size="12" />
              {{ formatDateLabel(session.startDateTime.slice(0, 10)) }}
            </span>
            <span class="flex items-center gap-1">
              <AppIcon name="clock" :size="12" />
              {{ formatTime(session.startDateTime) }}
            </span>
            <span>{{ hall.name }}</span>
          </div>
        </div>

        <div
          class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[0.82rem] font-semibold"
          :class="secondsLeft < 60 ? 'border border-danger/40 bg-danger/10 text-danger' : 'border border-brand/35 bg-brand/10 text-brand'"
        >
          <AppIcon name="clock" :size="14" />
          <span>{{ t('seats.holdTimer', { time: timerLabel }) }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div class="xl:col-span-3">
          <div class="text-center mb-8">
            <div class="mx-auto h-2 max-w-[560px] rounded-full bg-[linear-gradient(to_right,transparent,rgba(245,158,11,0.7),transparent)] shadow-[0_0_20px_rgba(245,158,11,0.35),0_0_60px_rgba(245,158,11,0.12)]" />
            <p class="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-fade">{{ t('seats.screen') }}</p>
          </div>

          <div class="flex flex-col gap-1.5 overflow-x-auto rounded-xl border border-line bg-surface-soft px-2 py-5">
            <div
              v-for="row in hall.schema.rows"
              :key="row"
              class="flex min-w-[480px] items-center justify-center gap-3"
            >
              <span class="w-[18px] text-center text-[0.72rem] font-semibold text-fade">{{ row }}</span>
              <div class="flex items-center gap-1">
                <template v-for="col in hall.schema.seatsPerRow" :key="`${row}-${col}`">
                  <span
                    v-if="col === Math.ceil(hall.schema.seatsPerRow / 2) + 1"
                    class="w-4"
                  />
                  <button
                    type="button"
                    :class="seatClass(row, col)"
                    :disabled="['held', 'booked', 'disabled'].includes(seatStatus(row, col))"
                    :aria-label="t('seats.seatLabel', { seat: `${row}${col}` })"
                    @click="toggle(row, col)"
                  >
                    {{ col }}
                  </button>
                </template>
              </div>
              <span class="w-[18px] text-center text-[0.72rem] font-semibold text-fade">{{ row }}</span>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-5 rounded-xl border border-line bg-surface-soft p-4">
            <div class="flex items-center gap-2 text-[0.78rem] text-muted">
              <span :class="legendSeatClass('available')" />
              <span>{{ t('seats.legendAvailable') }}</span>
            </div>
            <div class="flex items-center gap-2 text-[0.78rem] text-muted">
              <span :class="legendSeatClass('selected')" />
              <span>{{ t('seats.legendSelected') }}</span>
            </div>
            <div class="flex items-center gap-2 text-[0.78rem] text-muted">
              <span :class="legendSeatClass('held')" />
              <span>{{ t('seats.legendHeld') }}</span>
            </div>
            <div class="flex items-center gap-2 text-[0.78rem] text-muted">
              <span :class="legendSeatClass('booked')" />
              <span>{{ t('seats.legendBooked') }}</span>
            </div>
          </div>
        </div>

        <aside class="sticky top-24 h-fit rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow-card)]">
          <p class="eyebrow mb-1">{{ t('seats.orderEyebrow') }}</p>
          <h2 class="display mb-4 text-[1.3rem] text-copy">
            {{ selectedList.length }} {{ tPlural(selectedList.length, 'seats') }}
          </h2>

          <div v-if="selectedList.length > 0" class="flex flex-wrap gap-2 mb-5">
            <span
              v-for="s in selectedList"
              :key="s.key"
              class="inline-flex items-center gap-1.5 rounded-md border border-brand-dark bg-brand px-2 py-1 text-[0.78rem] font-semibold text-zinc-900"
            >
              {{ s.row }}{{ s.col }}
              <button class="cursor-pointer bg-transparent p-0 text-inherit opacity-75 transition hover:opacity-100" :aria-label="t('common.remove')" @click="toggle(s.row, s.col)">
                <AppIcon name="close" :size="11" />
              </button>
            </span>
          </div>
          <div v-else class="rounded-[0.6rem] border border-dashed border-line-strong bg-surface-soft px-4 py-3.5 text-center text-[0.82rem] text-dim">
            {{ t('seats.empty') }}
          </div>

          <div class="my-4 h-px bg-line" />

          <div class="mb-1 flex justify-between text-[0.85rem] text-muted">
            <span>{{ t('seats.price') }}</span>
            <span>{{ formatPrice(session.price) }}</span>
          </div>
          <div class="mb-5 flex justify-between font-bold">
            <span class="text-copy">{{ t('seats.total') }}</span>
            <span class="display text-[1.4rem] text-brand">
              {{ formatPrice(total) }}
            </span>
          </div>

          <button
            class="btn-amber w-full"
            :disabled="selectedList.length === 0"
            @click="confirm"
          >
            <AppIcon name="ticket" :size="16" />
            {{ t('seats.confirm') }}
          </button>
          <p class="mt-2 text-center text-[0.72rem] text-fade">
            {{ t('seats.max', { n: MAX_SEATS }) }}
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>
