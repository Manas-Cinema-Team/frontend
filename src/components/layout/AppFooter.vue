<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppIcon from '@/components/AppIcon.vue'

const cinemaLinks = ['Сейчас в кино', 'Скоро', 'Расписание', 'Спецпоказы', 'Премьеры']
const serviceLinks = ['Онлайн-бронь', 'Подарочные карты', 'Абонементы', 'Группы', 'Корпоративы']
const infoLinks = ['О нас', 'Контакты', 'Политика', 'Условия', 'Cookies']
const socialIcons = ['instagram', 'twitter', 'youtube', 'facebook'] as const
</script>

<template>
  <footer
    style="
      background: #08080e;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: auto;
    "
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="md:col-span-1">
          <RouterLink to="/" class="flex items-center gap-3 mb-5 w-fit">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center"
              style="background: linear-gradient(135deg, #f59e0b, #d97706)"
            >
              <AppIcon name="film" :size="18" fill="#fff" />
            </div>
            <span class="display text-xl" style="letter-spacing: 0.12em">
              <span style="color: #f59e0b">CINE</span><span style="color: #f5f5f5">MAX</span>
            </span>
          </RouterLink>
          <p style="color: #71717a; font-size: 0.875rem; line-height: 1.7">
            Премиальный кинотеатр для настоящих ценителей. Ищите, бронируйте и наслаждайтесь магией большого экрана.
          </p>
          <div class="flex items-center gap-3 mt-6">
            <a
              v-for="icon in socialIcons"
              :key="icon"
              href="#"
              class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:text-amber-400"
              style="
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #71717a;
              "
            >
              <AppIcon :name="icon" :size="16" />
            </a>
          </div>
        </div>

        <div>
          <h4
            style="
              color: #e4e4e7;
              font-size: 0.75rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 1rem;
            "
          >
            Кино
          </h4>
          <ul class="space-y-3">
            <li v-for="item in cinemaLinks" :key="item">
              <RouterLink
                to="/"
                class="transition-colors duration-200 hover:text-amber-400"
                style="color: #71717a; font-size: 0.875rem"
              >
                {{ item }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style="
              color: #e4e4e7;
              font-size: 0.75rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 1rem;
            "
          >
            Услуги
          </h4>
          <ul class="space-y-3">
            <li v-for="item in serviceLinks" :key="item">
              <a
                href="#"
                class="transition-colors duration-200 hover:text-amber-400"
                style="color: #71717a; font-size: 0.875rem"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style="
              color: #e4e4e7;
              font-size: 0.75rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 1rem;
            "
          >
            Информация
          </h4>
          <ul class="space-y-3">
            <li v-for="item in infoLinks" :key="item">
              <a
                href="#"
                class="transition-colors duration-200 hover:text-amber-400"
                style="color: #71717a; font-size: 0.875rem"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        style="border-top: 1px solid rgba(255, 255, 255, 0.06)"
      >
        <p style="color: #52525b; font-size: 0.8rem">© 2026 CineMax. Все права защищены.</p>
        <p style="color: #52525b; font-size: 0.8rem">Сделано для любителей кино.</p>
      </div>
    </div>
  </footer>
</template>
