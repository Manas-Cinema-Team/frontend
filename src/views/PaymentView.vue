<script setup lang="ts">
import { computed, ref } from 'vue'
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
import { clearCart } from '@/stores/cart'
import { t } from '@/stores/i18n'

const route = useRoute()
const router = useRouter()

const session = computed(() => findSession(route.query.session as string | undefined))
const movie   = computed(() => session.value ? findMovie(session.value.movieId) : undefined)
const hall    = computed(() => session.value ? findHall(session.value.hallId) : undefined)

const seats = computed(() => {
  const raw = route.query.seats
  const str = typeof raw === 'string' ? raw : ''
  return str ? str.split(',').filter(Boolean) : []
})
const total = computed(() => {
  const raw = route.query.total
  return typeof raw === 'string' ? Number(raw) : 0
})

// ── Форма оплаты ──────────────────────────────────────────────────────
const payMethod = ref<'card' | 'qr'>('card')

const cardNumber = ref('')
const cardName   = ref('')
const cardExpiry = ref('')
const cardCvv    = ref('')

const isProcessing = ref(false)
const errors = ref<Record<string, string>>({})

// Форматирование номера карты
const formatCard = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}
const onCardInput = (e: Event) => {
  cardNumber.value = formatCard((e.target as HTMLInputElement).value)
}

// Форматирование срока
const formatExpiry = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}
const onExpiryInput = (e: Event) => {
  cardExpiry.value = formatExpiry((e.target as HTMLInputElement).value)
}

const validate = () => {
  const e: Record<string, string> = {}
  if (payMethod.value === 'card') {
    if (cardNumber.value.replace(/\s/g, '').length < 16) e.cardNumber = 'Введите 16 цифр карты'
    if (!cardName.value.trim()) e.cardName = 'Введите имя держателя'
    if (cardExpiry.value.length < 5) e.cardExpiry = 'Введите срок (ММ/ГГ)'
    if (cardCvv.value.length < 3) e.cardCvv = 'Введите CVV'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

const pay = async () => {
  if (!validate()) return
  isProcessing.value = true

  // Симуляция обработки платежа
  await new Promise((res) => setTimeout(res, 1800))

  isProcessing.value = false
  clearCart()

  router.push({
    name: 'booking-success',
    query: {
      session: route.query.session,
      seats: route.query.seats,
      total: route.query.total,
    },
  })
}

// Определяем тип карты по номеру
const cardType = computed(() => {
  const n = cardNumber.value.replace(/\s/g, '')
  if (n.startsWith('4')) return 'visa'
  if (n.startsWith('5') || n.startsWith('2')) return 'mastercard'
  if (n.startsWith('9')) return 'mir'
  return null
})

const panelClass = 'rounded-2xl border border-line bg-panel px-6 py-5'
const panelLabelClass = 'mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-dim'
const inputBaseClass = 'w-full rounded-xl border bg-surface-soft px-4 py-2.5 text-[0.9rem] text-copy outline-none transition placeholder:text-fade'

const fieldClass = (name: string) => [
  inputBaseClass,
  errors.value[name] ? 'border-danger' : 'border-line focus:border-brand',
]

const payMethodClass = (active: boolean) =>
  active
    ? 'border-brand/50 bg-brand/15 text-brand'
    : 'border-line bg-surface-soft text-muted hover:border-line-strong hover:text-copy'
</script>

<template>
  <section class="stage min-h-screen pt-24">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Шапка -->
      <button class="mb-6 inline-flex items-center gap-2 bg-transparent text-[0.85rem] text-dim transition hover:text-copy" @click="router.back()">
        <AppIcon name="arrow-left" :size="15" />
        Назад к выбору мест
      </button>

      <h1 class="display mb-8 text-[clamp(1.75rem,4vw,2.5rem)] text-copy">Оплата билетов</h1>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

        <!-- ── Левая: форма оплаты ── -->
        <div>

          <!-- Метод оплаты -->
          <div :class="panelClass" class="mb-4">
            <div :class="panelLabelClass">Способ оплаты</div>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                class="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[0.85rem] font-medium transition"
                :class="payMethodClass(payMethod === 'card')"
                @click="payMethod = 'card'"
              >
                <AppIcon name="credit-card" :size="18" />
                Банковская карта
              </button>
              <button
                class="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[0.85rem] font-medium transition"
                :class="payMethodClass(payMethod === 'qr')"
                @click="payMethod = 'qr'"
              >
                <AppIcon name="smartphone" :size="18" />
                QR / Мобильный
              </button>
            </div>
          </div>

          <!-- Форма карты -->
          <div v-if="payMethod === 'card'" :class="panelClass" class="mb-4">
            <div :class="panelLabelClass">Данные карты</div>

            <!-- Визуализация карты -->
            <div class="relative mb-5 flex min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl border border-brand/20 bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_100%)] px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div class="absolute -right-[30px] -top-[30px] h-[130px] w-[130px] rounded-full bg-brand/10" />
              <div class="h-7 w-[38px] rounded-[5px] border border-white/20 bg-[linear-gradient(135deg,#d4a017,#f5c542)]" />
              <div class="my-3 font-mono text-[1.25rem] tracking-[0.2em] text-white/90">
                {{ cardNumber || '•••• •••• •••• ••••' }}
              </div>
              <div class="flex items-end gap-8">
                <div>
                  <div class="mb-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/45">Держатель</div>
                  <div class="text-[0.85rem] font-medium tracking-[0.05em] text-white/90">{{ cardName || 'FULL NAME' }}</div>
                </div>
                <div>
                  <div class="mb-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/45">Срок</div>
                  <div class="text-[0.85rem] font-medium tracking-[0.05em] text-white/90">{{ cardExpiry || 'MM/YY' }}</div>
                </div>
                <div class="ml-auto">
                  <span v-if="cardType === 'visa'" class="text-base font-black italic tracking-[0.05em] text-[#1a73e8]">VISA</span>
                  <span v-else-if="cardType === 'mastercard'" class="text-base font-black tracking-[0.05em] text-[#eb001b]">MC</span>
                  <span v-else-if="cardType === 'mir'" class="text-base font-black tracking-[0.05em] text-[#00a651]">МИР</span>
                </div>
              </div>
            </div>

            <!-- Поля -->
            <div class="grid gap-3.5 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[0.72rem] font-semibold tracking-[0.05em] text-dim">Номер карты</label>
                <input
                  :value="cardNumber"
                  :class="fieldClass('cardNumber')"
                  placeholder="0000 0000 0000 0000"
                  inputmode="numeric"
                  maxlength="19"
                  @input="onCardInput"
                />
                <span v-if="errors.cardNumber" class="text-[0.72rem] text-danger">{{ errors.cardNumber }}</span>
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[0.72rem] font-semibold tracking-[0.05em] text-dim">Имя держателя</label>
                <input
                  v-model="cardName"
                  :class="fieldClass('cardName')"
                  placeholder="IVAN IVANOV"
                  @input="cardName = (cardName).toUpperCase()"
                />
                <span v-if="errors.cardName" class="text-[0.72rem] text-danger">{{ errors.cardName }}</span>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.72rem] font-semibold tracking-[0.05em] text-dim">Срок действия</label>
                <input
                  :value="cardExpiry"
                  :class="fieldClass('cardExpiry')"
                  placeholder="MM/YY"
                  inputmode="numeric"
                  maxlength="5"
                  @input="onExpiryInput"
                />
                <span v-if="errors.cardExpiry" class="text-[0.72rem] text-danger">{{ errors.cardExpiry }}</span>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.72rem] font-semibold tracking-[0.05em] text-dim">CVV</label>
                <input
                  v-model="cardCvv"
                  :class="fieldClass('cardCvv')"
                  placeholder="•••"
                  inputmode="numeric"
                  maxlength="3"
                  type="password"
                />
                <span v-if="errors.cardCvv" class="text-[0.72rem] text-danger">{{ errors.cardCvv }}</span>
              </div>
            </div>
          </div>

          <!-- QR оплата -->
          <div v-else :class="panelClass" class="mb-4">
            <div :class="panelLabelClass">Оплата по QR-коду</div>
            <div class="mb-4 flex flex-col items-start gap-5 sm:flex-row">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CINEMA-PAYMENT-DEMO&bgcolor=1a1a2e&color=f59e0b&margin=10"
                alt="QR для оплаты"
                class="h-[110px] w-[110px] shrink-0 rounded-[0.6rem] border-2 border-brand/30"
              />
              <div>
                <div class="mb-1.5 text-[0.95rem] font-bold text-copy">Отсканируйте QR-код</div>
                <div class="mb-3 text-[0.82rem] leading-[1.5] text-dim">Откройте приложение банка и отсканируйте код для оплаты {{ formatPrice(total) }}</div>
                <div class="flex flex-wrap gap-1.5">
                  <span class="rounded-full border border-line bg-surface-soft px-2.5 py-1 text-[0.72rem] font-semibold text-muted">Mbank</span>
                  <span class="rounded-full border border-line bg-surface-soft px-2.5 py-1 text-[0.72rem] font-semibold text-muted">O!Деньги</span>
                  <span class="rounded-full border border-line bg-surface-soft px-2.5 py-1 text-[0.72rem] font-semibold text-muted">ЭлКарт</span>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2 rounded-xl border border-brand/20 bg-brand/10 px-4 py-3 text-[0.8rem] text-dim">
              <AppIcon name="info" :size="14" />
              После оплаты нажмите кнопку «Подтвердить оплату» ниже
            </div>
          </div>

          <!-- Безопасность -->
          <div class="flex items-center gap-2 py-2 text-[0.75rem] text-fade">
            <AppIcon name="shield" :size="14" />
            Платёж защищён 256-bit SSL шифрованием
          </div>
        </div>

        <!-- ── Правая: итог заказа ── -->
        <div class="sticky top-24 h-fit rounded-[1.2rem] border border-line bg-panel p-6 shadow-[var(--shadow-card)] lg:order-none">
          <div class="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-dim">Ваш заказ</div>

          <!-- Фильм -->
          <div class="mb-3">
            <div class="text-base font-bold text-copy">{{ movie?.title }}</div>
            <div class="mt-1 flex flex-wrap gap-2 text-[0.72rem] text-dim">
              <span v-if="hall" class="inline-flex items-center gap-1"><AppIcon name="map-pin" :size="11" /> {{ hall.name }}</span>
              <span v-if="session" class="inline-flex items-center gap-1">
                  <AppIcon name="calendar" :size="11" />
                  {{ formatDateLabel(session.startDateTime.slice(0, 10)) }}
                </span>
              <span v-if="session" class="inline-flex items-center gap-1">
                  <AppIcon name="clock" :size="11" />
                  {{ formatTime(session.startDateTime) }}
                </span>
            </div>
          </div>

          <div class="my-3.5 h-px bg-line" />

          <!-- Места -->
          <div class="mb-2 text-[0.72rem] text-dim">Места ({{ seats.length }})</div>
          <div class="mb-2 flex flex-wrap gap-1.5">
            <span v-for="seat in seats" :key="seat" class="rounded-[0.3rem] border border-brand/30 bg-brand/15 px-2 py-1 text-[0.78rem] font-bold text-brand">{{ seat }}</span>
          </div>

          <div class="my-3.5 h-px bg-line" />

          <!-- Итог -->
          <div class="mb-1.5 flex items-center justify-between text-[0.85rem] text-muted">
            <span>Билеты × {{ seats.length }}</span>
            <span>{{ formatPrice(total) }}</span>
          </div>
          <div class="mb-1.5 flex items-center justify-between text-[0.8rem] text-fade">
            <span>Сервисный сбор</span>
            <span>0 сом</span>
          </div>
          <div class="my-3.5 h-px bg-line" />
          <div class="flex items-center justify-between text-base font-bold text-copy">
            <span>Итого</span>
            <span class="display text-[1.5rem] text-brand">{{ formatPrice(total) }}</span>
          </div>

          <!-- Кнопка оплаты -->
          <button
            class="btn-amber mt-5 flex w-full items-center gap-2.5 py-3.5 text-base"
            :disabled="isProcessing"
            @click="pay"
          >
            <span v-if="isProcessing" class="h-[18px] w-[18px] rounded-full border-2 border-zinc-900/30 border-t-zinc-900 [animation:spin_0.7s_linear_infinite]" />
            <AppIcon v-else name="lock" :size="16" />
            {{ isProcessing ? 'Обработка...' : `Оплатить ${formatPrice(total)}` }}
          </button>

          <p class="mt-3 text-center text-[0.68rem] leading-[1.5] text-fade">
            Нажимая «Оплатить», вы соглашаетесь с условиями использования сервиса
          </p>
        </div>

      </div>
    </div>
  </section>
</template>
