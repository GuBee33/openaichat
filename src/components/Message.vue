<script setup lang="ts">
import { useClipboard, useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
import { useChatStore } from '../data/chatStore'
import { CONVERTER_KEY, POST_MESSAGE_KEY } from '../keys'
import { Message } from '../models/Interfaces'

const { message, index } = defineProps<{
    message: Message
    index: number
}>()

const converter = inject(CONVERTER_KEY)!
const { copy, copied } = useClipboard()
const profileStore = useChatStore()
const { chatMessages } = storeToRefs(profileStore)
const postMessage = useEventBus<void>(POST_MESSAGE_KEY)
</script>

<template>
    <div
        v-if="message.role !== 'system'"
        class="flex"
        :class="{
            'justify-content-end': message.role === 'user',
        }"
    >
        <Fieldset
            class="max-w-80 min-w-250px relative"
            :class="message.role"
            :toggleable="true"
        >
            <template #legend>
                <span v-if="message.role === 'user'">You</span>
                <span v-else-if="message.role === 'function'">ƒunction</span>
                <img
                    v-else
                    class="img-bot"
                    src="../assets/openai.png"
                    alt=""
                />
            </template>

            <div
                class="controls -flex align-items-center justify-content-end mb-3"
            >
                <i
                    class="pi hover:text-primary-500 pi-copy cursor-pointer"
                    :class="{ 'pi-check': copied }"
                    v-tooltip="'Copy the whole message'"
                    @click="copy(message.content ?? '')"
                />
                <i
                    class="pi pi-refresh hover:text-primary-500 cursor-pointer"
                    v-tooltip="'Resend the conversation'"
                    v-if="index === chatMessages.length - 1"
                    @click="postMessage.emit()"
                ></i>
                <i
                    class="flex pi pi-trash delIcon"
                    v-tooltip="'Delete this message from the conversation'"
                    v-if="index > 1"
                    @click="chatMessages.splice(index, 1)"
                ></i>
                <InputSwitch
                    class="pb-3"
                    aria-label="render markdown toggle"
                    v-tooltip="'Switch between markdown and HTML format'"
                    v-model="message.showmd"
                />
            </div>

            <ProgressSpinner
                class="img-bot aspect-1"
                v-if="!message.content"
            />
            <div
                v-else-if="message.showmd"
                v-html="
                    (message.content && converter.makeHtml(message.content)) ||
                    ''
                "
                class="break-spaces md-block"
            ></div>
            <div
                v-else
                class="break-spaces"
                >{{ message.content }}</div
            >
        </Fieldset>
    </div>
</template>

<style lang="scss">
.img-bot {
    height: 30px;
}

div.md-block {
    white-space: normal;
    p {
        margin: 0;
    }
    pre {
        margin-top: 0;
    }
    img {
        width: 100%;
    }
}

fieldset {
    border: none;

    &.user {
        background-color: var(--indigo-600);
        .p-fieldset-legend {
            border: 1px solid var(--surface-200);
            background-color: var(--surface-e);
            position: relative;
            right: -100%;
            transform: translateX(-100%);
            & > a {
                padding: 0.7em 1em;
            }
        }
        .controls {
            flex-direction: row-reverse;
        }
    }

    &:not(.user) {
        background-color: var(--gray-700);
        .p-fieldset-legend {
            background-color: var(--surface-e);
            & > a {
                padding: 0.5em 1em;
            }
        }
    }

    &.assistant {
        .p-fieldset-legend {
            background-color: white;
            & > a {
                color: var(--surface-d);
                padding: 0.5em 0.5em 0.5em 1em;
            }
        }
    }
}
</style>
