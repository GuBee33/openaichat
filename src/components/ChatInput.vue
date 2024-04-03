<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBehaviorStore } from '../data/behaviorStore'
const behaviorStore = useBehaviorStore()

const emit = defineEmits<{
    (e: 'send-message', text: string,imageUrl:string): void
}>()

function sendMessage() {
    prompt.value = prompt.value.trim()
    if (!prompt.value) return
    emit('send-message', prompt.value,imageUrl.value)

    imageUrl.value = ''
    prompt.value = ''
}

const prompt = ref('')
const imageUrl = ref('')
const rows = ref(1)
watch(prompt, () => {
    rows.value = (prompt.value.match(/\n/g)?.length ?? 0) + 1
})

function handleDragOver(event: DragEvent) {
    event.preventDefault()
}

function handleDrop(event: DragEvent) {
    event.preventDefault()
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = e => {
            const base64Image = e.target?.result as string
            imageUrl.value = base64Image
        }
        reader.readAsDataURL(file)
    }
}
</script>

<template>
    <footer class="relative flex">
        <Textarea
            v-if="behaviorStore.deployment.includes('vision')"
            v-model="imageUrl"
            placeholder="Drop image here"
            style="width: 150px"
            @dragover="handleDragOver"
            @drop="handleDrop"
        >
        </Textarea>
        <Textarea
            class="message-box"
            placeholder="Type your message. Press [ctrl]+[enter] to send."
            autofocus
            v-model="prompt"
            :rows="rows"
            @keydown.ctrl.enter="sendMessage"
        ></Textarea>
        <Button
            class="btn-send"
            icon="pi pi-send"
            aria-label="send message"
            @click="sendMessage"
            :disabled="!prompt||!behaviorStore.deployment"
        >
        </Button>
    </footer>
</template>

<style>
.message-box {
    padding-right: 2em;
}
.btn-send {
    position: absolute;
    top: 0.55em;
    right: 0.55rem;
    top: 1ex;
    right: 1ex;
    width: 2em;
    height: 2em;
}
</style>
