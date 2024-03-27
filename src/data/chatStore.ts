import { useEventBus, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { NEW_MESSAGE } from '../keys'
import {
    Conversation,
    Message,
} from '../models/Interfaces'
// @ts-ignore
import {ChatCompletionCreateParamsBase} from 'openai'
import { useBehaviorStore } from './behaviorStore'
import { DEFAULT_OPTIONS } from './defaults'

export const useChatStore = defineStore('chat', () => {
    const behaviorStore = useBehaviorStore()
    const newMessageEvent = useEventBus<void>(NEW_MESSAGE)

    const conversations = useLocalStorage<Conversation[]>('conversations', [
        {
            name: 'Original Chat',
            id: Symbol('chat-id'),
            code: [...behaviorStore.currentInitialMessages],
            options: DEFAULT_OPTIONS,
        },
    ])

    const activeChat = ref<Conversation>(conversations.value.first!)

    watch(
        conversations,
        () => {
            conversations.value.forEach(v => (v.id = Symbol('chat-id')))
            if (!conversations.value.includes(activeChat.value)) {
                activeChat.value = conversations.value.last!
            }
        },
        { immediate: true },
    )

    function addChat(name: string, options: ChatCompletionCreateParamsBase) {
        const newChat = {
            name,
            id: Symbol('chat-id'),
            code: [...behaviorStore.currentInitialMessages],
            options,
        }
        conversations.value.unshift(newChat)
        activeChat.value = newChat
    }

    function deleteChat(id: any) {
        const index = conversations.value.findIndex(c => c.id === id)
        conversations.value.splice(index, 1)

        if (conversations.value.length === 0) {
            addChat('Original Chat', DEFAULT_OPTIONS)
        }
        activeChat.value = conversations.value.last!
    }

    const chatMessages = computed(() => activeChat.value.code)
    function newMessage(msg: Message) {
        if (activeChat.value !== conversations.value.first) {
            const index = conversations.value.findIndex(
                c => c === activeChat.value,
            )
            conversations.value.splice(index, 1)
            conversations.value.unshift(activeChat.value)
        }
        chatMessages.value.push(msg)
        newMessageEvent.emit()
    }

    return {
        conversations,
        activeChat,
        addChat,
        deleteChat,
        chatMessages,
        newMessage,
    }
})
