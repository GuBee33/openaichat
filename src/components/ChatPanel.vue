<script setup lang="ts">
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useChatStore } from '../data/chatStore'
import { MAX_HISTORY } from '../data/defaults'
import { NEW_MESSAGE } from '../keys'
import Message from './Message.vue'


const newMessageEvent = useEventBus<void>(NEW_MESSAGE)
const chatStore = useChatStore()
const { chatMessages: messages} = storeToRefs(chatStore)

const root = ref(null! as HTMLDivElement)
watch(messages, scrollToBottom)
newMessageEvent.on(scrollToBottom)

function scrollToBottom() {
    setTimeout(() =>
        root.value.scrollTo({
            top: root.value.scrollHeight,
            behavior: 'smooth',
        }),
    )
}
</script>

<template>
    <div
        ref="root"
        class="-flex flex-column overflow-y-auto pr-2 pt-2"
    >
        <Message
            v-for="(message, index) in messages"
            :class="{ 'grayed-out': index < messages.length - MAX_HISTORY + 1 }"
            :key="index"
            :message="message"
            :index="index"
        />
    </div>
</template>

<style>
.grayed-out {
    filter: brightness(0.7) grayscale(0.9);
}
</style>
