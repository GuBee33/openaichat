<script setup lang="ts">
// import OpenAI from 'openai'
import { OpenAI, AzureOpenAI } from 'openai'

// @ts-ignore
import { ChatCompletionCreateParamsBase, ChatCompletionMessage } from 'openai'
import { useEventBus } from '@vueuse/core'
import ChatInput from './components/ChatInput.vue'
import ChatNavigation from './components/ChatNavigation.vue'
import ChatPanel from './components/ChatPanel.vue'
import { useBehaviorStore } from './data/behaviorStore'
import { useChatStore } from './data/chatStore'
import { MAX_HISTORY, FUNCTION_CALLABLE_MODELS } from './data/defaults'
import { POST_MESSAGE_KEY } from './keys'
import { availableFunctions } from './utils/functions'

const chatStore = useChatStore()
const behaviorStore = useBehaviorStore()
let client: AzureOpenAI | OpenAI
if (import.meta.env.VITE_IS_AZURE) {
    client = new AzureOpenAI({
        endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
        apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
        apiVersion: import.meta.env.VITE_OPENAI_API_VERSION,
        dangerouslyAllowBrowser: true,
    })
} else {
    client = new OpenAI({
        apiKey: behaviorStore.apiKey,
        dangerouslyAllowBrowser: true,
    })
}

useEventBus<void>(POST_MESSAGE_KEY).on(postOpenAI)

function sendMessage(text: string, image_url: string) {
    if (!text) return
    const textContent = { type: 'text', text }
    const imageContent = {
        type: 'image_url',
        image_url: {
            url: image_url,
        },
    }
    const content =
        image_url && behaviorStore.deployment.includes('vision')
            ? [textContent, imageContent]
            : [textContent]
    const message = {
        content,
        role: 'user',
        showmd: false,
    }
    chatStore.newMessage(message)
    if (behaviorStore.deployment.includes('gpt')) {
        postOpenAI()
    } else if (behaviorStore.deployment.includes('dall-e')) {
        genImage(text)
    }
}

async function genImage(text: string) {
    const image = await client.images.generate({
        model: behaviorStore.deployment,
        prompt: text,
    })
    const textContent = { type: 'text', text: image.data[0].revised_prompt }
    const imageContent = {
        type: 'image_url',
        image_url: {
            url: image.data[0].url,
        },
    }
    const message = {
        content: [textContent, imageContent],
        role: 'assistant',
        showmd: false,
    }
    chatStore.newMessage(message)
}

async function postOpenAI() {
    try {
        const { fnName, argsString, role } = await communicateMessage()

        if (!fnName) return

        const avaFunction = availableFunctions.find(
            f => f.description.name === fnName,
        )
        if (!avaFunction) {
            chatStore.chatMessages.last!.content = `Function ${fnName} not found`
            return
        }

        const argObject = JSON.parse(argsString)
        const params = avaFunction.description.parameters
        const requiredParams = params.required
        if (requiredParams.length < Object.keys(argObject).length) {
            chatStore.chatMessages.last!.content = `Arguments (${argsString}) for function ${fnName} are not sufficient`
            return
        }

        const calledFunction = avaFunction.function
        const args = requiredParams.map(a => argObject[a])
        const functionResult = await calledFunction(...args)
        chatStore.chatMessages.last!.content = `calling function ${fnName}(${args.join(
            ', ',
        )})`
        chatStore.chatMessages.last!.role = role as 'function'
        ;(chatStore.chatMessages.last! as ChatCompletionMessage).functionCall =
            {
                name: fnName,
                arguments: argsString,
            }
        chatStore.newMessage({
            content: functionResult.toString(),
            role: 'function',
            showmd: false,
            name: fnName,
        })
        setTimeout(postOpenAI, 2000)
    } catch (error) {
        chatStore.chatMessages.pop()
        console.error(error)
    }
}

async function communicateMessage() {
    const allMessages = chatStore.chatMessages
    const messages = (
        allMessages.length > MAX_HISTORY
            ? [
                  chatStore.chatMessages[0],
                  ...allMessages.slice(
                      chatStore.chatMessages.length - MAX_HISTORY,
                  ),
              ]
            : allMessages
    ).map(msg => ({ ...msg, showmd: undefined }))

    const options =
        behaviorStore.deployment in FUNCTION_CALLABLE_MODELS
            ? chatStore.activeChat.options
            : {
                  ...chatStore.activeChat.options,
                  function_call: undefined,
                  functions: undefined,
              }
    const events = await client.chat.completions.create({
        model: behaviorStore.deployment,
        messages,
        stream: true,
        ...options,
    })

    chatStore.newMessage({
        content: '',
        role: 'assistant',
        showmd: true,
    })

    let fnName = ''
    let argsString = ''
    let role = ''
    // @ts-ignore
    for await (const event of events) {
        for (const choice of event.choices) {
            if (!choice.delta) continue

            if (choice.delta.role) {
                role += choice.delta.role
            }
            if (choice.delta.content) {
                chatStore.chatMessages.last!.content += choice.delta.content
            }
            if (choice.delta.functionCall) {
                if (choice.delta.functionCall.name) {
                    fnName += choice.delta.functionCall.name
                }
                if (choice.delta.functionCall.arguments) {
                    argsString += choice.delta.functionCall.arguments
                }
            }
        }
    }

    return {
        fnName,
        argsString,
        role,
    }
}
</script>

<template>
    <div class="h-screen flex flex-column">
        <header
            class="fixed header flex align-items-center justify-content-center"
        ></header>
        <Splitter class="splitter flex flex-grow-1 h-screen">
            <SplitterPanel
                :size="15"
                class="flex flex-column align-items-start justify-content-start p-2 overflow-y-auto min-w-min"
            >
                <h1>OpenAI ChatBot</h1>
                <ChatNavigation />
            </SplitterPanel>
            <SplitterPanel
                :size="85"
                class="-grid p-2 grid-rows-1-min"
            >
                <ChatPanel />
                <ChatInput @send-message="sendMessage"></ChatInput>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<style scoped>
.header {
    background-image: url('./assets/image.png');
    background-size: 100% 100%;
    width: 100%;
    z-index: 10;
    height: 27px;
}

.splitter {
    border: none;
    background: transparent;
}

h1 {
    font-size: 1.3rem;
}
</style>

<style lang="scss">
@use 'highlight.js/styles/default.css';
@use 'primeflex/primeflex.css';
@use 'primeicons/primeicons.css';
@use 'primevue/resources/primevue.min.css';
@use 'primevue/resources/themes/viva-dark/theme.css';

body {
    margin: 0;
    background-color: var(--surface-a);
    overflow: hidden;
}

h1 {
    color: var(--primary-50);
}

textarea {
    width: 100%;
    min-height: 5em;
    resize: vertical;
}

.default-cursor {
    cursor: default;
}

.max-w-80 {
    max-width: 80%;
}

.min-w-min {
    min-width: min-content;
}

.min-w-250px {
    min-width: 250px;
}

.delIcon {
    cursor: pointer;
    transition: all 0.2s ease-out;
    text-shadow: 0 0 0px black;

    &:hover {
        color: rgb(255, 107, 107);
        text-shadow: 0 0 10px rgb(255 0 0 / 0.5);
    }
}

.-grid {
    display: grid;
    gap: 1em;
}

.-flex {
    display: flex;
    gap: 1em;
}

.flex-column {
    flex-direction: column;
}

.grid-1 {
    grid-template-columns: 1fr;

    &-min {
        grid-template-columns: 1fr min-content;
    }
}

.grid-rows-1-min {
    grid-template-rows: 1fr min-content;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.break-spaces {
    white-space: pre-wrap;
    white-space: break-spaces;
}

.aspect-1 {
    aspect-ratio: 1;
}
</style>
