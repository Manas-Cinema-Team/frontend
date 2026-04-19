<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { findMovieById } from '@/data/cinema'

const route = useRoute()

const movie = computed(() => findMovieById((route.query.movie as string) ?? ''))
const showtime = computed(() => {
  const sid = route.query.session as string | undefined
  return movie.value?.showtimes.find((s) => s.id === sid)
})
const seats = computed(() => {
  const raw = route.query.seats as string | undefined
  return raw ? raw.split(',').filter(Boolean) : []
})
const total = computed(() => (route.query.total as string) ?? '0')

const bookingCode = `CNM-${Math.random().toString(36).slice(2, 7).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`
</script>

<template>
  <section class="stage relative overflow-hidden" style="min-height: 100vh; padding-top: 120px">
    <div class="spotlight" />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div class="text-center mb-10">
        <div class="success-mark">
          <span class="ping-ring success-mark__ring" />
          <AppIcon name="check" :size="36" fill="#18181b" />
        </div>
        <p class="eyebrow mt-8 mb-3">Бронирование подтверждено</p>
        <h1
          class="display"
          style="color: #fff; font-size: clamp(2.25rem, 5vw, 3.5rem); line-height: 1.05"
        >
          Билеты ждут вас<br /><span style="color: #f59e0b">у входа в зал</span>
        </h1>
        <p
          class="mt-5 max-w-xl mx-auto"
          style="color: #a1a1aa; font-size: 1rem; line-height: 1.6"
        >
          Копия брони отправлена на почту. Покажите QR-код или номер брони на стойке — и можете
          идти смотреть кино.
        </p>
      </div>

      <!-- Ticket card, CSS-only, no poster backdrop -->
      <div class="ticket">
        <div class="ticket__stub">
          <div class="ticket__barcode" aria-hidden="true">
            <span v-for="n in 28" :key="n" :style="{ flex: (n % 3 ? 1 : 2) }" />
          </div>
          <div class="text-center" style="font-family: var(--font-display); letter-spacing: 0.2em">
            <div style="color: #52525b; font-size: 0.65rem">BOOKING</div>
            <div style="color: #f59e0b; font-size: 1.3rem">{{ bookingCode }}</div>
          </div>
        </div>

        <div class="ticket__body">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center"
              style="background: linear-gradient(135deg, #f59e0b, #d97706)"
            >
              <AppIcon name="film" :size="16" fill="#fff" />
            </div>
            <span
              style="
                font-family: var(--font-display);
                letter-spacing: 0.14em;
                color: #f5f5f5;
                font-size: 1.05rem;
              "
            >
              <span style="color: #f59e0b">CINE</span>MAX
            </span>
          </div>

          <h2
            class="display mb-1"
            style="color: #fff; font-size: clamp(1.6rem, 3vw, 2.1rem)"
          >
            {{ movie?.title ?? 'Ваш сеанс' }}
          </h2>
          <div class="flex flex-wrap items-center gap-2 mb-6">
            <span v-if="showtime" class="chip-muted">{{ showtime.format }}</span>
            <span v-if="showtime" class="chip-muted">{{ showtime.hall }}</span>
            <span v-if="movie" class="chip-muted">{{ movie.ageRating }}</span>
          </div>

          <dl class="ticket__grid">
            <div>
              <dt>Дата</dt>
              <dd>{{ showtime?.dateLabel ?? '—' }}</dd>
            </div>
            <div>
              <dt>Время</dt>
              <dd>{{ showtime?.time ?? '—' }}</dd>
            </div>
            <div>
              <dt>Места</dt>
              <dd>{{ seats.length ? seats.join(', ') : '—' }}</dd>
            </div>
            <div>
              <dt>Сумма</dt>
              <dd style="color: #f59e0b; font-weight: 700">{{ total }} сом</dd>
            </div>
          </dl>

          <div class="ticket__divider" />

          <div class="flex flex-col sm:flex-row gap-3">
            <RouterLink to="/" class="btn-amber flex-1 justify-center">
              <AppIcon name="ticket" :size="18" />
              На главную
            </RouterLink>
            <button class="btn-ghost flex-1 justify-center" type="button">
              <AppIcon name="calendar" :size="16" />
              Добавить в календарь
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 mt-8" style="color: #52525b; font-size: 0.8rem">
        <AppIcon name="clock" :size="14" />
        Приходите за 15 минут до начала сеанса
      </div>
    </div>
  </section>
</template>

<style scoped>
.success-mark {
  position: relative;
  width: 84px;
  height: 84px;
  margin: 0 auto;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 48px rgba(245, 158, 11, 0.45);
}
.success-mark__ring {
  position: absolute;
  inset: -8px;
  border-radius: 9999px;
  border: 2px solid rgba(245, 158, 11, 0.5);
}

.ticket {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55);
}
@media (min-width: 720px) {
  .ticket { grid-template-columns: 220px 1fr; }
}
.ticket__stub {
  position: relative;
  padding: 1.75rem 1.25rem;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.22), transparent 60%),
    linear-gradient(180deg, #1a1a24 0%, #0b0b12 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  border-right: 2px dashed rgba(255, 255, 255, 0.12);
}
.ticket__stub::before,
.ticket__stub::after {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  right: -12px;
  border-radius: 9999px;
  background: #08080e;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.ticket__stub::before { top: -12px; }
.ticket__stub::after { bottom: -12px; }

.ticket__barcode {
  display: flex;
  gap: 2px;
  width: 100%;
  height: 90px;
  align-items: stretch;
}
.ticket__barcode span {
  background: rgba(245, 245, 245, 0.9);
  border-radius: 1px;
}
.ticket__barcode span:nth-child(3n) { background: #f59e0b; }
.ticket__barcode span:nth-child(5n) { background: rgba(255, 255, 255, 0.25); }

.ticket__body {
  padding: clamp(1.75rem, 3vw, 2.5rem);
}
.ticket__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}
.ticket__grid dt {
  color: #71717a;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}
.ticket__grid dd {
  color: #f5f5f5;
  font-size: 1rem;
  font-weight: 600;
}
.ticket__divider {
  height: 1px;
  margin: 1.5rem 0;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
}
</style>
