<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, Ref, watch } from 'vue'
import { useBehaviorStore } from '../data/behaviorStore'
import { useChatStore } from '../data/chatStore'
import { DEFAULT_OPTIONS, MODELTYPE_LIST } from '../data/defaults'
import { SystemMessage,Deployments } from '../models/Interfaces'
import BehaviorCreation from './BehaviorCreation.vue'
import OptionParameterSetter from './OptionParameterSetter.vue'
import OpenAI from 'openai'

const behaviorStore = useBehaviorStore()
const openaiKey = behaviorStore.apiKey
const chatStore = useChatStore()
const { currentBehavior, systemMessages, deployment, apiKey } =
    storeToRefs(behaviorStore)
const { conversations, activeChat } = storeToRefs(chatStore)

const chatNameFocused = ref(false)
const newChatName = ref('')

async function getAvailableModels(): Promise<Deployments[]> {
    const client = new OpenAI({
        apiKey: openaiKey, // This is the default and can be omitted
        dangerouslyAllowBrowser: true,
    })
    const models = await client.models.list()
    const availableModels: Deployments[] | PromiseLike<Deployments[]> = []
    MODELTYPE_LIST.forEach(modelType => {
        const gptModels = models.data.filter(model =>
            model.id.startsWith(modelType),
        )

        if (gptModels.length > 0) {
            const modelVersions = gptModels.map(model => {
                const version = new Date(
                    model.created * 1000,
                ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })

                return {
                    deployment: model.id,
                    version: model.id + ' (' + version + ')',
                }
            })

            availableModels.push({
                modelType: modelType + ' Models',
                modelVersions,
            })
        }
    })
    return availableModels
}

const ALL_MODELS: Ref<Deployments[]> = ref([])
;(async () => {
    ALL_MODELS.value = await getAvailableModels()

})()
const AVAILABLE_MODELS: Ref<Deployments[]> = ref([])
;(async () => {
    AVAILABLE_MODELS.value = await getAvailableModels()
    updateAvailableModels()
})()

function updateAvailableModels(){
    AVAILABLE_MODELS.value=activeChat.value.code.some(item => {
    if (Array.isArray(item.content)) {
        return item.content.some(
            (contentItem: { type: string }) => contentItem.type === 'image_url',
        )
    }
    return false
})
    ? ALL_MODELS.value.map(modelType => ({
    modelType: modelType.modelType,
    modelVersions: modelType.modelVersions.filter(version => version.deployment.includes('vision')||version.deployment.includes('dall-e'))
  })).filter(modelType => modelType.modelVersions.length > 0)
    : ALL_MODELS.value
    if(!AVAILABLE_MODELS.value.reduce((acc, modelType) => {
    const deployments = modelType.modelVersions.map(version => version.deployment);
    return acc.concat(deployments);
  }, [] as string[]).includes(deployment.value)){
    deployment.value=''
    }
}
watch(activeChat,updateAvailableModels)

function deleteBehavior(behavior: SystemMessage) {
    alert(
        behaviorStore.deleteBehavior(behavior)
            ? `Deleting behavior "${behavior.name}".\nThe chats using it are intact.`
            : `Could not delete behavior "${behavior.name}"!`,
    )
}

function addChat() {
    if (!newChatName.value) return

    chatStore.addChat(newChatName.value, DEFAULT_OPTIONS)
    newChatName.value = ''
    chatNameFocused.value = false
}
</script>

<template>
    <div class="flex flex-column w-full">
        <div>
            <span class="text-xs block default-cursor"
                >Insert you openai API key</span
            >
            <InputText
                v-model="apiKey"
                type="password"
                placeholder="Put here your API-key"
            ></InputText>
            <div
                class="w-full"
                v-tooltip="
                    'Select a deployment based on given model type/version'
                "
            >
                <span class="text-xs block default-cursor">Selected model</span>
                {{ deployment }}
                <Dropdown
                    class="w-full"
                    v-model="deployment"
                    :options="AVAILABLE_MODELS"
                    scrollHeight="250px"
                    optionGroupLabel="modelType"
                    optionGroupChildren="modelVersions"
                    optionLabel="version"
                    optionValue="deployment"
                />
            </div>
            <div class="w-full mt-2">
                <Fieldset
                    :toggleable="true"
                    collapsed
                    legend="Advanced Options"
                    class="text-xs options-fieldset"
                >
                    <OptionParameterSetter
                        v-model:option="
                            chatStore.activeChat.options.temperature
                        "
                        option-name="Temperature"
                        :step="0.01"
                        :min="0"
                        :max="1"
                        tooltip="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.
"
                    ></OptionParameterSetter>
                    <OptionParameterSetter
                        v-model:option="chatStore.activeChat.options.top_p"
                        option-name="topP"
                        :step="0.01"
                        :min="0"
                        :max="1"
                        tooltip="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both."
                    ></OptionParameterSetter>
                    <OptionParameterSetter
                        v-model:option="
                            chatStore.activeChat.options.frequency_penalty
                        "
                        option-name="frequencyPenalty"
                        :step="0.01"
                        :min="0"
                        :max="2"
                        tooltip="Reduce the chance of repeating a token proportionally based on how often it has appeared in the text so far. This decreases the likelihood of repeating the exact same text in a response."
                    ></OptionParameterSetter>
                    <OptionParameterSetter
                        v-model:option="
                            chatStore.activeChat.options.presence_penalty
                        "
                        option-name="presencePenalty"
                        :step="0.01"
                        :min="0"
                        :max="2"
                        tooltip="Reduce the chance of repeating any token that has appeared in the text at all so far. This increases the likelihood of introducing new topics in a response."
                    ></OptionParameterSetter>
                    <OptionParameterSetter
                        v-model:option="chatStore.activeChat.options.max_tokens"
                        option-name="Max Response Tokens"
                        :step="1"
                        :min="1"
                        :max="4000"
                        tooltip="Set a limit on the number of tokens per model response. The API supports a maximum of MaxTokensPlaceholderDoNotTranslate tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text."
                    ></OptionParameterSetter>
                </Fieldset>
            </div>
        </div>
        <Divider />
        <div>
            <div class="w-full">
                <label
                    class="text-xs block"
                    for="createChat"
                    >Add a new chat</label
                >
                <div class="-grid grid-1-min">
                    <InputText
                        id="createChat"
                        v-tooltip="'Type a name for your new chat'"
                        class="p-inputtext-sm"
                        v-model="newChatName"
                        type="text"
                        placeholder="New chat name"
                        @keydown.enter="addChat"
                        @focusin="chatNameFocused = true"
                    />
                    <Button
                        class="aspect-1"
                        size="small"
                        icon="pi pi-plus"
                        aria-label="submit new chat"
                        :disabled="!newChatName"
                        @click="addChat"
                    ></Button>
                </div>
                <div v-if="newChatName !== '' || chatNameFocused">
                    <br />
                    <span class="text-xs block default-cursor"
                        >Behavior Selector</span
                    >
                    <Dropdown
                        class="w-full mb-3"
                        v-model="currentBehavior"
                        :options="systemMessages"
                        :optionLabel="m => m.name"
                        floatlabel
                    >
                        <template #option="slotProps">
                            <div class="flex text-xs justify-content-between">
                                {{ slotProps.option.name }}
                                <i
                                    v-if="systemMessages.length > 1"
                                    class="pi pi-trash delIcon pl-1"
                                    @click.stop="
                                        deleteBehavior(slotProps.option)
                                    "
                                ></i>
                            </div>
                        </template>
                    </Dropdown>
                    <br v-if="newChatName" />
                    <BehaviorCreation />
                </div>
            </div>
            <Divider />
            <Listbox
                :options="conversations"
                :model-value="activeChat"
                optionLabel="name"
                class="w-full"
            >
                <template #option="slotProps">
                    <div
                        class="-grid grid-1-min"
                        @click="activeChat = slotProps.option"
                    >
                        <div
                            class="flex-grow-1 text-ellipsis"
                            v-tooltip="
                                slotProps.option.code[1]?.content.substring(
                                    0,
                                    80,
                                ) ?? '' + '...'
                            "
                            >{{ slotProps.option.name }}</div
                        >
                        <div class="-flex align-items-center">
                            <span
                                v-tooltip="slotProps.option.code[0].content"
                                class="text-xs text-ellipsis"
                                >{{
                                    slotProps.option.code[0].content
                                        .split(' ')
                                        .slice(0, 3)
                                        .join(' ') + '...'
                                }}</span
                            >
                            <i
                                class="text-sm flex pi pi-trash delIcon"
                                v-tooltip="'Delete this conversation'"
                                @click.stop="
                                    chatStore.deleteChat(slotProps.option.id)
                                "
                            ></i>
                        </div>
                    </div>
                </template>
            </Listbox>
        </div>
    </div>
</template>

<style lang="scss">
.options-fieldset .p-fieldset-legend {
    border: 1px solid var(--surface-200);
}
</style>
