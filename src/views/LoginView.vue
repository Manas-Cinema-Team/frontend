<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const showPass = ref(false)

const submit = (e: Event) => {
  e.preventDefault()
  router.push('/')
}
</script>

<template>
  <section class="stage relative overflow-hidden" style="min-height: 100vh; padding-top: 96px">
    <div class="spotlight" />
    <div class="auth-shell">
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

          <p class="eyebrow mb-2">С возвращением</p>
          <h1
            class="display"
            style="color: #fff; font-size: clamp(2rem, 4vw, 2.75rem); line-height: 1.05"
          >
            Войдите и продолжите бронировать
          </h1>
          <p class="mt-4" style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.6">
            Ваши любимые фильмы, сохранённые места и история заказов — всё в одном аккаунте.
          </p>
        </div>

        <form class="auth-form" @submit="submit">
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
                :type="showPass ? 'text' : 'password'"
                required
                placeholder="Введите пароль"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="field__toggle"
                :aria-label="showPass ? 'Скрыть пароль' : 'Показать пароль'"
                @click="showPass = !showPass"
              >
                {{ showPass ? 'Скрыть' : 'Показать' }}
              </button>
            </div>
          </label>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer" style="color: #a1a1aa; font-size: 0.85rem">
              <input v-model="remember" type="checkbox" class="auth-check" />
              Запомнить меня
            </label>
            <a
              href="#"
              style="color: #f59e0b; font-size: 0.85rem; font-weight: 600"
            >
              Забыли пароль?
            </a>
          </div>

          <button class="btn-amber w-full" type="submit">
            <AppIcon name="ticket" :size="18" />
            Войти
          </button>
        </form>

        <div class="auth-divider"><span>или</span></div>

        <div class="grid grid-cols-2 gap-3">
          <button type="button" class="btn-ghost">Google</button>
          <button type="button" class="btn-ghost">Apple</button>
        </div>

        <p class="mt-8 text-center" style="color: #71717a; font-size: 0.9rem">
          Нет аккаунта?
          <RouterLink to="/register" style="color: #f59e0b; font-weight: 600">
            Зарегистрироваться
          </RouterLink>
        </p>
      </div>

      <!-- Decorative, CSS-only cinematic panel -->
      <aside class="auth-side">
        <div class="auth-side__beam" />
        <div class="auth-side__grid" />
        <div class="auth-side__badge">
          <AppIcon name="star" :size="12" fill="#f59e0b" />
          <span>PREMIUM</span>
        </div>
        <div class="auth-side__content">
          <h2
            class="display"
            style="color: #fff; font-size: clamp(1.8rem, 3vw, 2.4rem); line-height: 1.1"
          >
            Каждый сеанс — как первый раз в кино.
          </h2>
          <p style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.6; margin-top: 1rem">
            Эксклюзивные премьеры, программа лояльности и лучшие места в зале — доступны в личном кабинете.
          </p>

          <ul class="auth-side__list">
            <li><AppIcon name="check" :size="14" fill="#f59e0b" /> Бронирование в один клик</li>
            <li><AppIcon name="check" :size="14" fill="#f59e0b" /> Баллы и персональные скидки</li>
            <li><AppIcon name="check" :size="14" fill="#f59e0b" /> История и электронные билеты</li>
          </ul>
        </div>
      </aside>
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
  .auth-shell { grid-template-columns: 1.05fr 0.95fr; gap: 3rem; }
}
.auth-card {
  background: #14141c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.25rem;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.auth-head { margin-bottom: 2rem; }

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
.field__toggle {
  background: transparent;
  border: none;
  color: #71717a;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
}
.field__toggle:hover { color: #f59e0b; }

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

.auth-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.75rem 0 1.25rem;
  color: #52525b;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.auth-side {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  min-height: 480px;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  background:
    radial-gradient(ellipse at 50% -20%, rgba(245, 158, 11, 0.3) 0%, transparent 60%),
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
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245, 158, 11, 0.28) 0%, transparent 60%);
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
  .auth-side { min-height: 320px; }
}
</style>
