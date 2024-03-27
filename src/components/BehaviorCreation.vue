<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBehaviorStore } from '../data/behaviorStore'
import { SystemMessage } from '../models/Interfaces'

const behaviorStore = useBehaviorStore()
const accordionIndex = ref(100)
const newBehaviorName = ref('')

let descriptionMessageModified = false
let descriptionMessage = ''
const behaviorDescriptionMessage = computed({
    get: () =>
        descriptionMessageModified
            ? descriptionMessage
            : (descriptionMessage = `I am an Azure OpenAI ChatGPT, designed to emulate a ${
                  newBehaviorName.value || '________'
              }. While providing responses, I will take into account our last 20 messages for a more accurate and contextual understanding`),
    set(newValue) {
        descriptionMessageModified = true
        descriptionMessage = newValue
    },
})

let systemMessageModified = false
let systemMessage = ''
const behaviorSystemMessage = computed({
    get: () =>
        systemMessageModified
            ? systemMessage
            : (systemMessage = `you are a(n) ${
                  newBehaviorName.value || '_______'
              }`),
    set(newValue) {
        systemMessageModified = true
        systemMessage = newValue
    },
})

const newSystemMessage = computed<SystemMessage>(() => ({
    name: newBehaviorName.value,
    code: [
        {
            role: 'system',
            content: behaviorSystemMessage.value,
        },
        {
            content: behaviorDescriptionMessage.value,
            role: 'assistant',
            showmd: false,
        },
    ],
}))

function add() {
    if (!behaviorStore.addBehavior(newSystemMessage.value)) {
        alert(
            `There's already a behavior named "${newSystemMessage.value.name}"! Select another one!`,
        )
        return
    }

    behaviorStore.currentBehavior = newSystemMessage.value
    newBehaviorName.value = ''
    behaviorDescriptionMessage.value = ''
    behaviorSystemMessage.value = ''
    accordionIndex.value = 99
    systemMessageModified = false
    descriptionMessageModified = false
}
</script>

<template>
    <Accordion v-model:activeIndex="accordionIndex">
        <AccordionTab
            :contentClass="'-grid'"
            header="Create a New Behavior"
        >
            <div class="-grid">
                <div>
                    <label
                        class="text-xs block"
                        for="name"
                        >Behavior name</label
                    >
                    <InputText
                        id="name"
                        class="p-inputtext-sm w-full"
                        v-model="newBehaviorName"
                        type="text"
                        placeholder="New behavior name"
                    />
                </div>
                <div>
                    <label
                        class="text-xs block"
                        for="system"
                        >System message</label
                    >
                    <Textarea
                        id="system"
                        v-tooltip="
                            'Type whatever you want as system message, this is just help'
                        "
                        v-model="behaviorSystemMessage"
                        rows="3"
                        cols="26"
                    ></Textarea>
                </div>
                <div>
                    <label
                        class="text-xs block"
                        for="description"
                        >Description message</label
                    >
                    <Textarea
                        id="description"
                        v-tooltip="
                            'Type whatever you want as description message, this is just help'
                        "
                        v-model="behaviorDescriptionMessage"
                    ></Textarea>
                </div>
                <Button
                    size="small"
                    @click="add"
                    label="Add Behavior"
                    :disabled="
                        newBehaviorName === '' ||
                        behaviorDescriptionMessage === '' ||
                        behaviorSystemMessage === ''
                    "
                ></Button>
            </div>
        </AccordionTab>
    </Accordion>
</template>
