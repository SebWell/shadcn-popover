<template>
  <div class="relative">
    <!-- Popover Trigger -->
    <div
      ref="triggerRef"
      @click="togglePopover"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeyDown"
      :class="cn('inline-block', content.triggerClass)"
      :tabindex="content.disabled ? -1 : 0"
    >
      <slot name="trigger">
        <button
          type="button"
          :disabled="content.disabled"
          :class="cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            'h-10 px-4 py-2'
          )"
        >
          {{ content.triggerText || 'Open Popover' }}
        </button>
      </slot>
    </div>

    <!-- Popover Content -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="contentRef"
        role="dialog"
        :aria-labelledby="headerId"
        :aria-describedby="bodyId"
        :style="popoverStyles"
        @click.stop
        @keydown="handleContentKeyDown"
        :class="cn(
          'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          placementClasses,
          content.size === 'sm' && 'w-56 p-3',
          content.size === 'lg' && 'w-80 p-6',
          content.size === 'xl' && 'w-96 p-6',
          content.contentClass
        )"
      >
        <!-- Arrow -->
        <div
          v-if="content.showArrow !== false"
          :class="cn(
            'absolute h-2 w-2 rotate-45 border bg-popover',
            arrowClasses
          )"
        ></div>

        <!-- Close Button -->
        <button
          v-if="content.showCloseButton"
          type="button"
          @click="closePopover"
          :class="cn(
            'absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:pointer-events-none'
          )"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>

        <!-- Header -->
        <div v-if="content.title || content.description" class="grid gap-2">
          <h4 
            v-if="content.title"
            :id="headerId"
            :class="cn(
              'font-medium leading-none',
              content.titleClass
            )"
          >
            {{ content.title }}
          </h4>
          <p 
            v-if="content.description"
            :class="cn(
              'text-sm text-muted-foreground',
              content.descriptionClass
            )"
          >
            {{ content.description }}
          </p>
        </div>

        <!-- Content -->
        <div 
          :id="bodyId"
          :class="cn(
            content.title || content.description ? 'mt-2' : '',
            content.bodyClass
          )"
        >
          <wwElement v-if="content.body" v-bind="content.body" />
          <slot v-else></slot>
        </div>

        <!-- Footer -->
        <div 
          v-if="content.showFooter"
          :class="cn(
            'flex items-center justify-end space-x-2 pt-4',
            content.footerClass
          )"
        >
          <wwElement v-if="content.footer" v-bind="content.footer" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'open', 'close'])

// Refs
const triggerRef = ref(null)
const contentRef = ref(null)
const isOpen = ref(props.modelValue)
const popoverStyles = ref({})
const hoverTimer = ref(null)

// Computed
const headerId = computed(() => `popover-header-${Math.random().toString(36).substr(2, 9)}`)
const bodyId = computed(() => `popover-body-${Math.random().toString(36).substr(2, 9)}`)

const placement = computed(() => props.content.placement || 'bottom')

const placementClasses = computed(() => {
  const classes = {
    top: 'data-[side=top]:slide-in-from-bottom-2',
    bottom: 'data-[side=bottom]:slide-in-from-top-2',
    left: 'data-[side=left]:slide-in-from-right-2',
    right: 'data-[side=right]:slide-in-from-left-2'
  }
  return classes[placement.value] || classes.bottom
})

const arrowClasses = computed(() => {
  const classes = {
    top: 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-0 border-l-0',
    bottom: 'top-[-4px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0',
    left: 'right-[-4px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0',
    right: 'left-[-4px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0'
  }
  return classes[placement.value] || classes.bottom
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== isOpen.value) {
    if (newValue) {
      openPopover()
    } else {
      closePopover()
    }
  }
})

// Methods
const togglePopover = () => {
  if (props.content.disabled) return
  
  if (isOpen.value) {
    closePopover()
  } else {
    openPopover()
  }
}

const openPopover = async () => {
  if (props.content.disabled) return
  
  isOpen.value = true
  emit('update:modelValue', true)
  emit('open')
  
  await nextTick()
  updatePosition()
  
  // Focus the content
  if (contentRef.value) {
    contentRef.value.focus()
  }
}

const closePopover = () => {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}

const handleMouseEnter = () => {
  if (props.content.trigger === 'hover') {
    clearTimeout(hoverTimer.value)
    openPopover()
  }
}

const handleMouseLeave = () => {
  if (props.content.trigger === 'hover') {
    hoverTimer.value = setTimeout(() => {
      closePopover()
    }, props.content.hoverDelay || 150)
  }
}

const handleKeyDown = (event) => {
  if (props.content.disabled) return
  
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    togglePopover()
  } else if (event.key === 'Escape') {
    closePopover()
  }
}

const handleContentKeyDown = (event) => {
  if (event.key === 'Escape') {
    closePopover()
    triggerRef.value?.focus()
  }
}

const updatePosition = () => {
  if (!triggerRef.value || !contentRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const offset = props.content.offset || 8
  let top, left
  
  switch (placement.value) {
    case 'top':
      top = triggerRect.top - contentRect.height - offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + window.scrollX
      break
      
    case 'bottom':
      top = triggerRect.bottom + offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + window.scrollX
      break
      
    case 'left':
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2 + window.scrollY
      left = triggerRect.left - contentRect.width - offset + window.scrollX
      break
      
    case 'right':
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2 + window.scrollY
      left = triggerRect.right + offset + window.scrollX
      break
      
    default:
      top = triggerRect.bottom + offset + window.scrollY
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + window.scrollX
  }
  
  // Adjust for viewport boundaries
  if (left < 0) {
    left = 8
  } else if (left + contentRect.width > viewportWidth) {
    left = viewportWidth - contentRect.width - 8
  }
  
  if (top < 0) {
    top = 8
  } else if (top + contentRect.height > viewportHeight + window.scrollY) {
    top = viewportHeight + window.scrollY - contentRect.height - 8
  }
  
  popoverStyles.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 50
  }
}

const handleOutsideClick = (event) => {
  if (!triggerRef.value?.contains(event.target) && !contentRef.value?.contains(event.target)) {
    closePopover()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
  clearTimeout(hoverTimer.value)
})

// Expose methods
defineExpose({
  open: openPopover,
  close: closePopover,
  toggle: togglePopover
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 