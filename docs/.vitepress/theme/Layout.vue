<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed } from 'vue'

const { Layout: DefaultLayout } = DefaultTheme
const { page, frontmatter } = useData()

const isHome = computed(() => frontmatter.value.layout === 'home')
const isTech = computed(() => page.value.relativePath.startsWith('tech/'))
const isPoetry = computed(() => page.value.relativePath.startsWith('poetry/'))

const pageClass = computed(() => {
  if (isHome.value) return 'page-home'
  if (isTech.value) return 'page-tech'
  if (isPoetry.value) return 'page-poetry'
  return ''
})
</script>

<template>
  <div :class="pageClass">
    <DefaultLayout />
  </div>
</template>
