<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const hideFooter = computed(() => route.name === 'booking-success' || route.name === 'not-found')
const hideHeader = computed(() => false)
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: #08080e; color: #f5f5f5">
    <AppHeader v-if="!hideHeader" />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <AppFooter v-if="!hideFooter" />
  </div>
</template>
