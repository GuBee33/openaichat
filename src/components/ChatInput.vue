<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (e: 'send-message', value: string): void
}>()

function sendMessage() {
    prompt.value = prompt.value.trim()
    if (!prompt.value) return
    emit('send-message', prompt.value)
    prompt.value = ''
}

const prompt = ref('')
const rows = ref(1)
watch(prompt, () => {
    rows.value = (prompt.value.match(/\n/g)?.length ?? 0) + 1
})
</script>

<template>
    <footer class="relative flex">
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
            :disabled="!prompt"
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
