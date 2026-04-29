<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'
import { register } from '@/stores/auth'
import { t } from '@/stores/i18n'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')

const submit = (e: Event) => {
  e.preventDefault()
  error.value = ''
  if (password.value.length < 6) {
    error.value = t('auth.errorShort')
    return
  }
  if (password.value !== confirm.value) {
    error.value = t('auth.errorMismatch')
    return
  }
  register(email.value)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(redirect)
}
</script>

<template>
  <section class="stage flex min-h-screen items-center justify-center px-4 pb-16 pt-[120px]">
    <div class="w-full max-w-[420px] rounded-2xl border border-line bg-panel p-8 shadow-[var(--shadow-card)]">
      <p class="eyebrow mb-2">{{ t('auth.register') }}</p>
      <h1 class="display mb-6 text-[1.8rem] text-copy">
        {{ t('auth.signUpTitle') }}
      </h1>

      <form class="flex flex-col gap-4" @submit="submit">
        <label class="flex flex-col gap-1.5">
          <span class="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-dim">{{ t('auth.email') }}</span>
          <div class="flex items-center gap-2.5 rounded-xl border border-line bg-surface-soft px-4 py-3 text-dim transition focus-within:border-brand/45 focus-within:bg-brand/5">
            <AppIcon name="mail" :size="16" />
            <input
              v-model="email"
              type="email"
              required
              placeholder="name@example.com"
              autocomplete="email"
              class="flex-1 border-0 bg-transparent text-[0.95rem] text-copy outline-none placeholder:text-fade"
            />
          </div>
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-dim">{{ t('auth.password') }}</span>
          <div class="flex items-center gap-2.5 rounded-xl border border-line bg-surface-soft px-4 py-3 text-dim transition focus-within:border-brand/45 focus-within:bg-brand/5">
            <AppIcon name="lock" :size="16" />
            <input
              v-model="password"
              type="password"
              required
              :placeholder="t('auth.passwordMin')"
              autocomplete="new-password"
              class="flex-1 border-0 bg-transparent text-[0.95rem] text-copy outline-none placeholder:text-fade"
            />
          </div>
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-dim">{{ t('auth.passwordConfirm') }}</span>
          <div class="flex items-center gap-2.5 rounded-xl border border-line bg-surface-soft px-4 py-3 text-dim transition focus-within:border-brand/45 focus-within:bg-brand/5">
            <AppIcon name="lock" :size="16" />
            <input
              v-model="confirm"
              type="password"
              required
              :placeholder="t('auth.passwordConfirm')"
              autocomplete="new-password"
              class="flex-1 border-0 bg-transparent text-[0.95rem] text-copy outline-none placeholder:text-fade"
            />
          </div>
        </label>

        <p v-if="error" class="text-[0.82rem] text-danger">{{ error }}</p>

        <button class="btn-amber w-full mt-2" type="submit">
          <AppIcon name="ticket" :size="16" />
          {{ t('auth.signUpSubmit') }}
        </button>
      </form>

      <p class="mt-6 text-center text-[0.85rem] text-dim">
        {{ t('auth.hasAccount') }}
        <RouterLink to="/login" class="font-semibold text-brand">{{ t('auth.goLogin') }}</RouterLink>
      </p>
    </div>
  </section>
</template>
