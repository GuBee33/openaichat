import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SystemMessage } from '../models/Interfaces'
import { DEFAULT_SYSTEM_MESSAGES } from './defaults'

export const useBehaviorStore = defineStore('behavior', () => {
    const systemMessages = useLocalStorage<SystemMessage[]>('systemMessages', [
        ...DEFAULT_SYSTEM_MESSAGES,
    ])
    const deployment = ref('gpt-4-turbo-preview')
    const apiKey = useLocalStorage<string>('apiKey','')
    const currentBehavior = ref(systemMessages.value.first!)

    function addBehavior(behavior: SystemMessage): boolean {
        if (systemMessages.value.some(b => b.name === behavior.name)) {
            return false
        }
        systemMessages.value.push(behavior)
        return true
    }

    function deleteBehavior(behavior: SystemMessage): boolean {
        if (systemMessages.value.length === 1) return false

        const behaviorIndex = systemMessages.value.findIndex(
            b => b === behavior,
        )
        if (behaviorIndex === -1) return false

        systemMessages.value.splice(behaviorIndex, 1)
        currentBehavior.value = systemMessages.value.first!
        return true
    }

    const currentInitialMessages = computed(() => currentBehavior.value.code)

    return {
        deployment,
        systemMessages,
        currentBehavior,
        addBehavior,
        deleteBehavior,
        currentInitialMessages,
        apiKey,
    }
})
