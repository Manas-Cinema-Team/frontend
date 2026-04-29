<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import {
  findHall,
  findMovie,
  findSession,
  formatDateLabel,
  formatPrice,
  formatTime,
} from '@/data/cinema'
import { saveTicket } from '@/stores/bookings'
import { t } from '@/stores/i18n'

const route = useRoute()

const session = computed(() => findSession(route.query.session as string | undefined))
const movie = computed(() => session.value ? findMovie(session.value.movieId) : undefined)
const hall = computed(() => session.value ? findHall(session.value.hallId) : undefined)

const seats = computed(() => {
  const raw = route.query.seats
  const str = typeof raw === 'string' ? raw : ''
  return str ? str.split(',').filter(Boolean) : []
})
const total = computed(() => {
  const raw = route.query.total
  return typeof raw === 'string' ? Number(raw) : 0
})

const bookingCode = `CNM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
const qrDataUrl = ref<string>('')
const saved = ref(false)
const perforationClass = "relative mx-6 h-px bg-[repeating-linear-gradient(90deg,var(--line-strong)_0,var(--line-strong)_8px,transparent_8px,transparent_14px)] before:absolute before:-left-8 before:top-1/2 before:h-5 before:w-5 before:-translate-y-1/2 before:rounded-full before:border before:border-line before:bg-canvas before:content-[''] after:absolute after:-right-8 after:top-1/2 after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:border after:border-line after:bg-canvas after:content-['']"

// Генерация QR через публичный API (без зависимостей)
const generateQR = async () => {
  const text = encodeURIComponent(`CINEMA:${bookingCode}:${session.value?.id ?? ''}:${seats.value.join(',')}`)
  qrDataUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${text}&bgcolor=18181b&color=f59e0b&margin=10`
}

// Сохраняем билет в store один раз при монтировании
onMounted(async () => {
  await generateQR()
  if (!saved.value && session.value && movie.value && hall.value) {
    saveTicket({
      bookingCode,
      movieId: movie.value.id,
      movieTitle: movie.value.title,
      moviePoster: movie.value.posterUrl,
      sessionId: session.value.id,
      hallName: hall.value.name,
      date: session.value.startDateTime.slice(0, 10),
      time: formatTime(session.value.startDateTime),
      seats: seats.value,
      total: total.value,
    })
    saved.value = true
  }
})

const printTicket = () => window.print()
</script>

<template>
  <section class="stage no-print-bg min-h-screen pt-[120px]">
    <div class="max-w-xl mx-auto px-4 pb-16">

      <!-- Шапка успеха -->
      <div class="text-center mb-8 print-hidden">
        <div class="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-brand shadow-[0_0_0_10px_rgba(245,158,11,0.12)]">
          <AppIcon name="check" :size="30" fill="#18181b" />
        </div>
        <p class="eyebrow mt-6 mb-2">{{ t('success.eyebrow') }}</p>
        <h1 class="display text-[clamp(1.75rem,4vw,2.5rem)] text-copy">{{ t('success.title') }}</h1>
      </div>

      <!-- Билет -->
      <div
        id="print-ticket"
        class="relative overflow-hidden rounded-[1.2rem] border border-line bg-panel shadow-[0_8px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(245,158,11,0.1)] print:rounded-none print:border-2 print:border-black print:bg-white print:shadow-none"
      >

        <!-- Перфорация верх -->
        <div :class="perforationClass" />

        <!-- Шапка билета -->
        <div class="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_60%)] px-7 py-6 pb-5 print:bg-white">
          <div>
            <div class="mb-2 text-[0.75rem] font-extrabold tracking-[0.2em] text-brand print:text-black">🎬 CINEMA</div>
            <div class="mb-1 text-[0.6rem] tracking-[0.2em] text-fade print:text-black">BOOKING CODE</div>
            <div class="display text-[1.4rem] tracking-[0.15em] text-brand print:text-black">{{ bookingCode }}</div>
          </div>
          <!-- QR -->
          <div class="shrink-0">
            <img
              v-if="qrDataUrl"
              :src="qrDataUrl"
              alt="QR-код билета"
              class="h-[90px] w-[90px] rounded-lg border-2 border-brand/30 print:border-black"
            />
            <div v-else class="grid h-[90px] w-[90px] place-items-center rounded-lg border border-line bg-surface-soft text-dim print:border-black print:bg-white print:text-black">
              <AppIcon name="loader" :size="24" />
            </div>
          </div>
        </div>

        <!-- Основной контент -->
        <div class="px-7 py-5 pb-6">
          <h2 class="display mb-1 text-[1.5rem] text-copy print:text-black">
            {{ movie?.title ?? t('success.session') }}
          </h2>
          <p v-if="hall" class="mb-5 flex items-center gap-1.5 text-[0.82rem] text-dim print:text-black">
            <AppIcon name="map-pin" :size="13" />
            {{ hall.name }}
          </p>

          <dl class="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt class="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-fade print:text-black">{{ t('success.date') }}</dt>
              <dd class="text-[0.95rem] font-semibold text-copy print:text-black">{{ session ? formatDateLabel(session.startDateTime.slice(0, 10)) : '—' }}</dd>
            </div>
            <div>
              <dt class="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-fade print:text-black">{{ t('success.time') }}</dt>
              <dd class="display text-[1.5rem] text-copy print:text-black">{{ session ? formatTime(session.startDateTime) : '—' }}</dd>
            </div>
            <div class="col-span-2">
              <dt class="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-fade print:text-black">{{ t('success.seats') }}</dt>
              <dd>
                <div class="mt-0.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="seat in seats"
                    :key="seat"
                    class="rounded-md border border-brand/35 bg-brand/15 px-2.5 py-1 text-[0.82rem] font-bold text-brand print:border-black print:bg-zinc-100 print:text-black"
                  >
                    {{ seat }}
                  </span>
                </div>
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-fade print:text-black">{{ t('success.sum') }}</dt>
              <dd class="display text-[1.6rem] text-brand print:text-black">{{ formatPrice(total) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Перфорация низ -->
        <div :class="perforationClass" />

        <!-- Подвал -->
        <div class="flex items-center justify-between border-t border-line bg-surface-soft px-7 py-3 print:border-black print:bg-white">
          <span class="text-[0.72rem] text-dim print:text-black">Предъявите QR-код на входе</span>
          <span class="text-[0.68rem] text-fade print:text-black">Действителен только на дату сеанса</span>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="mt-5 flex flex-wrap gap-3 print-hidden">
        <button class="btn-ghost" @click="printTicket">
          <AppIcon name="printer" :size="16" />
          Распечатать
        </button>
        <RouterLink to="/profile" class="btn-ghost">
          <AppIcon name="ticket" :size="16" />
          Мои билеты
        </RouterLink>
        <RouterLink to="/" class="btn-amber">
          <AppIcon name="film" :size="16" />
          {{ t('common.home') }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
