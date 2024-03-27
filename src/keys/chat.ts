import { EventBusKey } from '@vueuse/core'

export const POST_MESSAGE_KEY: EventBusKey<void> = Symbol('post-message')
export const NEW_MESSAGE: EventBusKey<void> = Symbol('new-message')
