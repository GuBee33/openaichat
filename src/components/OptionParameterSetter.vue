<script lang="ts" setup>
const { optionName, step, min, max, tooltip } = defineProps<{
    optionName: string
    step: number
    min: number
    max: number
    tooltip?: string
}>()

const option = defineModel<number | undefined>('option', {
    required: true,
})
</script>

<template>
    <label
        class="text-xs block"
        :for="optionName"
        >{{ optionName }}</label
    >
    <div
        :id="optionName"
        class="flex align-items-center justify-content-center"
        v-tooltip="{ value: tooltip, class: 'text-xs', showDelay: 500 }"
    >
        <Slider
            v-model="option"
            :step="step"
            :min="min"
            :max="max"
            class="w-8rem mr-2"
        />
        <InputNumber
            v-model="option"
            buttonLayout="horizontal"
            :step="step"
            :min="min"
            :max="max"
            :inputStyle="{ 'width': '60px', 'font-size': '12px' }"
        ></InputNumber>
    </div>
</template>
