import {
    SystemMessage,
} from '../models/Interfaces'
// @ts-ignore
import {ChatCompletionCreateParamsBase} from 'openai'

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
                content: `I am an Azure OpenAI ChatGPT, designed to emulate a developer.`,
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
                content: `I am an Azure OpenAI ChatGPT, designed to emulate an engineer.`,
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
                content: `I am an Azure OpenAI ChatGPT, designed to emulate a project manager.`,
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
                content: `I am an Azure OpenAI ChatGPT, designed to emulate an assistant.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
    {
        name: 'Cpp converter',
        code: [
            {
                role: 'system',
                content:
                    'You will convert the given cpp code to C# with the following rules. Remove the m_ at the start of the variable names! Start the method name with a uppercase letter! Instead of getter and setter calls, handle it as a property with the same name!  Use expression body for this and use it in future conversions also if the body is only 1 line! Use switch expression whenever possible!',
            },
            {
                content: `I am an Azure OpenAI ChatGPT, designed to emulate a developer. I will convert the cpp code you provide to C#.`,
                role: 'assistant',
                showmd: true,
            },
        ],
    },
]

export const AVAILABLE_MODELS = [
    {
        modelType: 'GPT 3.5 Turbo',
        modelVersions: [
            {
                deployment: 'gpt-35-turbo',
                version: 'Model version: 0301',
            },
            {
                deployment: 'gpt-35-turbo-16k',
                version: 'Model version: 16k 0613',
            },
        ],
    },
    {
        modelType: 'GPT 4',
        modelVersions: [
            { deployment: 'gpt-4', version: 'Model version: 0314' },
        ],
    },
]

export const GPT3_WITH_FUNCTIONS = 'gpt-35-turbo-16k' as const

export const DEFAULT_OPTIONS: ChatCompletionCreateParamsBase = {
    temperature: 0.5,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800,
    functions: availableFunctions.map(f => f.description),
    function_call: 'auto',
}
