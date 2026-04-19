<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { findMovieById, type SeatCategory } from '@/data/cinema'

type SeatStatus = 'available' | 'taken' | 'selected'
interface Seat {
  row: string
  col: number
  status: SeatStatus
  category: SeatCategory
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
const COLS = Array.from({ length: 14 }, (_, i) => i + 1)
const CATEGORY_MAP: Record<string, SeatCategory> = {
  A: 'standard', B: 'standard', C: 'standard',
  D: 'premium', E: 'premium', F: 'premium', G: 'premium', H: 'premium',
  I: 'vip', J: 'vip', K: 'vip',
}
const MAX_SEATS = 8

const route = useRoute()
const router = useRouter()

const movie = computed(() => findMovieById(route.params.id ?? ''))
const showtime = computed(() => {
  const id = route.params.sessionId as string
  return movie.value?.showtimes.find((s) => s.id === id) ?? movie.value?.showtimes[0]
})

// Deterministic taken seats, no movie-asset dependency
const isTaken = (row: string, col: number) => {
  const rowIdx = ROWS.indexOf(row)
  const seed = (rowIdx * 31 + col * 17) % 100
  const mid = col >= 4 && col <= 11
  if (seed < 30 && mid) return true
  if (seed < 15) return true
  return false
}

const seatKey = (row: string, col: number) => `${row}${col}`

const state = reactive({
  selected: new Set<string>(),
})

const grid = computed<Seat[][]>(() =>
  ROWS.map((row) =>
    COLS.map((col) => ({
      row,
      col,
      category: CATEGORY_MAP[row] ?? 'standard',
      status: isTaken(row, col)
        ? 'taken'
        : state.selected.has(seatKey(row, col))
          ? 'selected'
          : 'available',
    })),
  ),
)

const toggleSeat = (seat: Seat) => {
  if (seat.status === 'taken') return
  const key = seatKey(seat.row, seat.col)
  if (state.selected.has(key)) {
    state.selected.delete(key)
    return
  }
  if (state.selected.size >= MAX_SEATS) return
  state.selected.add(key)
}

const priceFor = (cat: SeatCategory): number => {
  const s = showtime.value
  if (!s) return 0
  if (cat === 'vip') return s.priceVip
  if (cat === 'premium') return s.pricePremium
  return s.priceStandard
}

const selectedList = computed<Seat[]>(() =>
  [...state.selected].map((k): Seat => {
    const row = k.charAt(0)
    const col = Number(k.slice(1))
    return {
      row,
      col,
      category: CATEGORY_MAP[row] ?? 'standard',
      status: 'selected',
    }
  }).sort((a, b) => (a.row + a.col).localeCompare(b.row + String(b.col))),
)

const ticketTotal = computed(() =>
  selectedList.value.reduce((sum, s) => sum + priceFor(s.category), 0),
)
const serviceFee = computed(() => selectedList.value.length * 30)
const grandTotal = computed(() => ticketTotal.value + serviceFee.value)

const categoryLabel: Record<SeatCategory, string> = {
  standard: 'Стандарт',
  premium: 'Премиум',
  vip: 'VIP',
}

const categoryAccent: Record<SeatCategory, { fill: string; border: string; glow: string }> = {
  standard: { fill: '#166534', border: '#22c55e', glow: 'rgba(34,197,94,0.45)' },
  premium: { fill: '#6b21a8', border: '#a855f7', glow: 'rgba(168,85,247,0.45)' },
  vip: { fill: '#854d0e', border: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
}

const confirm = () => {
  if (selectedList.value.length === 0) return
  router.push({
    name: 'booking-success',
    query: {
      movie: movie.value?.id,
      session: showtime.value?.id,
      seats: [...state.selected].join(','),
      total: String(grandTotal.value),
    },
  })
}
</script>

<template>
  <div v-if="!movie || !showtime" class="max-w-7xl mx-auto px-4 py-32 text-center">
    <p class="eyebrow mb-2">Ошибка</p>
    <h1 class="display" style="color: #fff; font-size: 2rem">Сеанс не найден</h1>
    <button class="btn-amber mt-6" @click="router.push('/')">На главную</button>
  </div>

  <div v-else class="stage" style="min-height: 100vh; padding-top: 96px">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb / context row -->
      <div class="flex items-center gap-4 mb-10 flex-wrap">
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors"
          style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.09);
            color: #d4d4d8;
          "
          @click="router.back()"
        >
          <AppIcon name="chevron-left" :size="18" />
          <span style="font-size: 0.875rem; font-weight: 500">Назад</span>
        </button>

        <div
          class="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
          "
        >
          <div class="poster-frame" style="width: 36px; height: 48px">
            <img :src="movie.poster" :alt="movie.title" />
          </div>
          <div>
            <div style="color: #fff; font-size: 0.875rem; font-weight: 600">
              {{ movie.title }}
            </div>
            <div
              class="flex items-center gap-3 mt-0.5"
              style="color: #71717a; font-size: 0.75rem"
            >
              <span class="flex items-center gap-1">
                <AppIcon name="calendar" :size="11" /> {{ showtime.dateLabel }}
              </span>
              <span class="flex items-center gap-1">
                <AppIcon name="clock" :size="11" /> {{ showtime.time }}
              </span>
              <span class="chip-muted">{{ showtime.format }}</span>
              <span class="chip-muted">{{ showtime.hall }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- ── Seat map ── -->
        <div class="xl:col-span-3">
          <div class="text-center mb-10">
            <div class="relative inline-block w-full max-w-xl mx-auto">
              <div class="screen-bar mx-auto" />
              <p
                class="mt-3"
                style="
                  color: #52525b;
                  font-size: 0.72rem;
                  letter-spacing: 0.2em;
                  text-transform: uppercase;
                  font-weight: 500;
                "
              >
                ЭКРАН
              </p>
            </div>
          </div>

          <div class="seat-map">
            <div
              v-for="(row, rIdx) in grid"
              :key="ROWS[rIdx]"
              class="seat-row"
            >
              <span class="seat-rowlabel">{{ ROWS[rIdx] }}</span>
              <div class="seat-cells">
                <template v-for="(seat, cIdx) in row" :key="`${seat.row}-${seat.col}`">
                  <!-- aisle -->
                  <span v-if="cIdx === 7" class="seat-aisle" />
                  <button
                    type="button"
                    class="seat"
                    :class="[
                      `seat--${seat.status}`,
                      `seat--${seat.category}`,
                    ]"
                    :disabled="seat.status === 'taken'"
                    :aria-label="`Место ${seat.row}${seat.col}, ${categoryLabel[seat.category]}`"
                    @click="toggleSeat(seat)"
                  >
                    {{ seat.col }}
                  </button>
                </template>
              </div>
              <span class="seat-rowlabel">{{ ROWS[rIdx] }}</span>
            </div>
          </div>

          <!-- Legend -->
          <div
            class="mt-10 flex flex-wrap items-center justify-center gap-6 p-5 rounded-2xl"
            style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06)"
          >
            <div
              v-for="item in [
                { label: 'Свободно', cls: 'seat--available seat--standard' },
                { label: 'Выбрано', cls: 'seat--selected seat--standard' },
                { label: 'Занято', cls: 'seat--taken seat--standard' },
                { label: 'Премиум', cls: 'seat--available seat--premium' },
                { label: 'VIP', cls: 'seat--available seat--vip' },
              ]"
              :key="item.label"
              class="flex items-center gap-2"
            >
              <span class="seat seat-demo" :class="item.cls" />
              <span style="color: #a1a1aa; font-size: 0.8rem">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <!-- ── Summary ── -->
        <aside
          class="rounded-2xl p-6 h-fit"
          style="
            background: #14141c;
            border: 1px solid rgba(255, 255, 255, 0.06);
            position: sticky;
            top: 96px;
          "
        >
          <p class="eyebrow mb-1">Ваш заказ</p>
          <h2 class="display mb-5" style="color: #fff; font-size: 1.5rem">
            {{ selectedList.length }} {{ selectedList.length === 1 ? 'место' : 'места' }}
          </h2>

          <div v-if="selectedList.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="s in selectedList"
              :key="`${s.row}${s.col}`"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md"
              :style="{
                background: `${categoryAccent[s.category].glow}`,
                border: `1px solid ${categoryAccent[s.category].border}`,
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 600,
              }"
            >
              {{ s.row }}{{ s.col }}
              <button
                class="opacity-70 hover:opacity-100"
                aria-label="Убрать место"
                @click="toggleSeat({ ...s, status: 'selected' })"
              >
                <AppIcon name="close" :size="12" />
              </button>
            </span>
          </div>
          <div
            v-else
            class="p-4 rounded-xl mb-6 text-center"
            style="
              background: rgba(255, 255, 255, 0.03);
              border: 1px dashed rgba(255, 255, 255, 0.1);
              color: #71717a;
              font-size: 0.85rem;
            "
          >
            Выберите места на схеме зала
          </div>

          <dl class="space-y-3 mb-6">
            <div class="flex justify-between" style="color: #a1a1aa; font-size: 0.875rem">
              <dt>Билеты</dt>
              <dd>{{ ticketTotal }} сом</dd>
            </div>
            <div class="flex justify-between" style="color: #a1a1aa; font-size: 0.875rem">
              <dt>Сбор</dt>
              <dd>{{ serviceFee }} сом</dd>
            </div>
            <div class="divider" />
            <div
              class="flex justify-between items-baseline"
              style="font-weight: 700"
            >
              <dt style="color: #e4e4e7; font-size: 0.95rem">Итого</dt>
              <dd class="display" style="color: #f59e0b; font-size: 1.6rem">
                {{ grandTotal }} сом
              </dd>
            </div>
          </dl>

          <button
            class="btn-amber w-full"
            :disabled="selectedList.length === 0"
            @click="confirm"
          >
            <AppIcon name="ticket" :size="18" />
            Подтвердить бронь
          </button>
          <p
            class="mt-3 text-center"
            style="color: #52525b; font-size: 0.72rem; letter-spacing: 0.05em"
          >
            Максимум {{ MAX_SEATS }} мест за бронирование
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-map {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px 8px;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  overflow-x: auto;
}
.seat-row {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
  min-width: 560px;
}
.seat-rowlabel {
  width: 18px;
  color: #52525b;
  font-size: 0.72rem;
  font-weight: 600;
  text-align: center;
}
.seat-cells {
  display: flex;
  align-items: center;
  gap: 4px;
}
.seat-aisle {
  width: 16px;
}

.seat {
  width: 28px;
  height: 28px;
  border-radius: 6px 6px 8px 8px;
  font-size: 0.6rem;
  font-weight: 600;
  color: transparent;
  border: 1px solid transparent;
  background: #16161e;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}
.seat:hover:not(:disabled) {
  transform: translateY(-1px);
  color: rgba(255, 255, 255, 0.6);
}
.seat:disabled {
  cursor: not-allowed;
}

/* Status */
.seat--taken {
  background: #1c1c22 !important;
  border-color: transparent !important;
  opacity: 0.4;
}
.seat--available.seat--standard {
  background: #16161e;
  border-color: rgba(255, 255, 255, 0.1);
}
.seat--available.seat--standard:hover {
  background: #20202e;
  border-color: rgba(34, 197, 94, 0.4);
}
.seat--available.seat--premium {
  background: #150b1c;
  border-color: rgba(168, 85, 247, 0.25);
}
.seat--available.seat--premium:hover {
  background: #1e1028;
  border-color: rgba(168, 85, 247, 0.5);
}
.seat--available.seat--vip {
  background: #1c1409;
  border-color: rgba(245, 158, 11, 0.3);
}
.seat--available.seat--vip:hover {
  background: #291f0e;
  border-color: rgba(245, 158, 11, 0.6);
}

.seat--selected.seat--standard {
  background: #166534;
  border-color: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
  color: #fff;
}
.seat--selected.seat--premium {
  background: #6b21a8;
  border-color: #a855f7;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
  color: #fff;
}
.seat--selected.seat--vip {
  background: #854d0e;
  border-color: #f59e0b;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
  color: #fff;
}

.seat-demo {
  width: 18px;
  height: 18px;
  cursor: default;
}

.btn-amber:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
