import { SystemMessage } from '../models/Interfaces'
// @ts-ignore
import { ChatCompletionCreateParamsBase } from 'openai'

import { availableFunctions } from '../utils/functions'

export const MAX_HISTORY = 20

export const DEFAULT_SYSTEM_MESSAGES: readonly SystemMessage[] = [
    {
        name: 'Developer',
        code: [
            {
                role: 'system',
                content: 'you are a developer',
            },
            {
                content: `I am an OpenAI ChatGPT, designed to emulate a developer.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
    {
        name: 'Engineer',
        code: [
            {
                role: 'system',
                content: 'you are an engineer',
            },
            {
                content: `I am an OpenAI ChatGPT, designed to emulate an engineer.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
    {
        name: 'Project Manager',
        code: [
            {
                role: 'system',
                content: 'you are a project manager',
            },
            {
                content: `I am an OpenAI ChatGPT, designed to emulate a project manager.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
    {
        name: 'Assistant',
        code: [
            {
                role: 'system',
                content: 'you are an assistant',
            },
            {
                content: `I am an OpenAI ChatGPT, designed to emulate an assistant.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
]

export const FUNCTION_CALLABLE_MODELS = [
    'gpt-4',
    'gpt-4-turbo-preview',
    'gpt-4-0125-preview',
    'gpt-4-1106-preview',
    'gpt-4-0613',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0125',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-0613',
]

export const DEFAULT_OPTIONS: ChatCompletionCreateParamsBase = {
    temperature: 0.5,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800,
    functions: availableFunctions.map(f => f.description),
    function_call: 'auto',
}

export const MODELTYPE_LIST = ['gpt-3.5', 'gpt-4' ,'dall-e']

