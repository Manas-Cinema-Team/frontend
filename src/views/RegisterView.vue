<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPass = ref('')
const agreed = ref(false)

const passStrength = computed(() => {
  const p = password.value
  if (p.length === 0) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const strengthLabel = computed(
  () => ['', 'Слабый', 'Средний', 'Хороший', 'Надёжный'][passStrength.value],
)
const strengthColor = computed(
  () => ['transparent', '#ef4444', '#f59e0b', '#eab308', '#22c55e'][passStrength.value],
)

const submit = (e: Event) => {
  e.preventDefault()
  if (!agreed.value) return
  if (password.value !== confirmPass.value) return
  router.push('/')
}
</script>

<template>
  <section class="stage relative overflow-hidden" style="min-height: 100vh; padding-top: 96px">
    <div class="spotlight" />
    <div class="auth-shell">
      <!-- Decorative CSS panel on the left -->
      <aside class="auth-side">
        <div class="auth-side__beam" />
        <div class="auth-side__grid" />
        <div class="auth-side__badge">
          <AppIcon name="ticket" :size="12" fill="#f59e0b" />
          <span>JOIN CINEMAX</span>
        </div>
        <div class="auth-side__content">
          <h2
            class="display"
            style="color: #fff; font-size: clamp(1.8rem, 3vw, 2.4rem); line-height: 1.1"
          >
            Возьмите лучшие места заранее.
          </h2>
          <p style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.6; margin-top: 1rem">
            Регистрация займёт 20 секунд. Получите 500 приветственных баллов и эксклюзивный доступ
            к премьерам.
          </p>
          <ul class="auth-side__list">
            <li><AppIcon name="star" :size="14" fill="#f59e0b" /> 500 баллов за регистрацию</li>
            <li><AppIcon name="star" :size="14" fill="#f59e0b" /> Ранние показы и приглашения</li>
            <li><AppIcon name="star" :size="14" fill="#f59e0b" /> Кэшбэк на попкорн и напитки</li>
          </ul>
        </div>
      </aside>

      <div class="auth-card">
        <div class="auth-head">
          <RouterLink
            to="/"
            class="flex items-center gap-3 mb-8 w-fit"
            style="font-family: var(--font-display); letter-spacing: 0.12em"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background: linear-gradient(135deg, #f59e0b, #d97706)"
            >
              <AppIcon name="film" :size="18" fill="#fff" />
            </div>
            <span style="font-size: 1.35rem">
              <span style="color: #f59e0b">CINE</span><span style="color: #f5f5f5">MAX</span>
            </span>
          </RouterLink>

          <p class="eyebrow mb-2">Регистрация</p>
          <h1
            class="display"
            style="color: #fff; font-size: clamp(2rem, 4vw, 2.75rem); line-height: 1.05"
          >
            Создайте аккаунт за минуту
          </h1>
        </div>

        <form class="auth-form" @submit="submit">
          <label class="field">
            <span class="field__label">Ваше имя</span>
            <div class="field__control">
              <AppIcon name="user" :size="16" />
              <input
                v-model="name"
                type="text"
                required
                placeholder="Как к вам обращаться?"
                autocomplete="name"
              />
            </div>
          </label>

          <label class="field">
            <span class="field__label">Email</span>
            <div class="field__control">
              <AppIcon name="user" :size="16" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="name@example.com"
                autocomplete="email"
              />
            </div>
          </label>

          <label class="field">
            <span class="field__label">Пароль</span>
            <div class="field__control">
              <AppIcon name="ticket" :size="16" />
              <input
                v-model="password"
                type="password"
                required
                placeholder="Минимум 8 символов"
                autocomplete="new-password"
              />
            </div>
            <div class="strength">
              <div class="strength__track">
                <div
                  class="strength__bar"
                  :style="{
                    width: `${(passStrength / 4) * 100}%`,
                    background: strengthColor,
                  }"
                />
              </div>
              <span
                :style="{ color: strengthColor || '#52525b', fontSize: '0.72rem', fontWeight: 600 }"
              >
                {{ strengthLabel || 'Сила пароля' }}
              </span>
            </div>
          </label>

          <label class="field">
            <span class="field__label">Повторите пароль</span>
            <div class="field__control">
              <AppIcon name="ticket" :size="16" />
              <input
                v-model="confirmPass"
                type="password"
                required
                placeholder="Повторите пароль"
                autocomplete="new-password"
              />
            </div>
          </label>

          <label
            class="flex items-start gap-2 cursor-pointer"
            style="color: #a1a1aa; font-size: 0.85rem; line-height: 1.5"
          >
            <input v-model="agreed" type="checkbox" class="auth-check mt-0.5" />
            <span>
              Я согласен с
              <a href="#" style="color: #f59e0b">условиями использования</a> и
              <a href="#" style="color: #f59e0b">политикой конфиденциальности</a>.
            </span>
          </label>

          <button class="btn-amber w-full" type="submit" :disabled="!agreed">
            <AppIcon name="ticket" :size="18" />
            Создать аккаунт
          </button>
        </form>

        <p class="mt-6 text-center" style="color: #71717a; font-size: 0.9rem">
          Уже есть аккаунт?
          <RouterLink to="/login" style="color: #f59e0b; font-weight: 600">Войти</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: stretch;
}
@media (min-width: 960px) {
  .auth-shell { grid-template-columns: 0.95fr 1.05fr; gap: 3rem; }
}
.auth-card {
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.25rem;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.auth-head { margin-bottom: 1.75rem; }

.auth-form { display: flex; flex-direction: column; gap: 1rem; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field__label { color: #a1a1aa; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
.field__control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #71717a;
  transition: border-color 180ms ease, background 180ms ease;
}
.field__control:focus-within {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.04);
}
.field__control input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.95rem;
}
.field__control input::placeholder { color: #52525b; }

.strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.4rem;
}
.strength__track {
  flex: 1;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.strength__bar {
  height: 100%;
  border-radius: inherit;
  transition: width 180ms ease, background 180ms ease;
}

.auth-check {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  cursor: pointer;
  transition: all 180ms ease;
  flex-shrink: 0;
}
.auth-check:checked {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-color: #f59e0b;
}
.auth-check:checked::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #18181b;
  font-size: 11px;
  font-weight: 900;
}

.auth-side {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  min-height: 520px;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  background:
    radial-gradient(ellipse at 50% -20%, rgba(168, 85, 247, 0.28) 0%, transparent 60%),
    linear-gradient(180deg, #1a1a24 0%, #0b0b12 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.auth-side__grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.55;
}
.auth-side__beam {
  position: absolute;
  top: -20%; left: 50%;
  width: 120%;
  aspect-ratio: 1 / 1;
  transform: translateX(-50%);
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245, 158, 11, 0.22) 0%, transparent 60%);
  filter: blur(8px);
  pointer-events: none;
}
.auth-side__badge {
  position: absolute;
  top: 1.5rem; left: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(8, 8, 14, 0.7);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #f59e0b;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  backdrop-filter: blur(8px);
}
.auth-side__content { position: relative; }
.auth-side__list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: #d4d4d8;
  font-size: 0.9rem;
}
.auth-side__list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

@media (max-width: 960px) {
  .auth-side { min-height: 280px; order: 2; }
}
</style>
