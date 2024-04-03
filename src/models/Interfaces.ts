// @ts-ignore
import  {ChatCompletionMessage,ChatCompletion,ChatCompletionContentPart} from 'openai'


export type Message = ChatCompletionMessage & {
    showmd?: boolean
} & { content?: string|ChatCompletionContentPart }

export interface SystemMessage {
    name: string
    code: Message[]
}

export type Models = {
    deployment: string,
    version: string
}

export type Deployments = {
    modelType: string,
    modelVersions: Models[]
}

export type Conversation = SystemMessage & {
    id: symbol
    options: ChatCompletion,
    type: "gpt"|"dall-e",
    images?: string[]
}


export interface AvailableFunction {
    function: Function
    description: {
        name: string
        description: string
        parameters: {
            type: string
            properties: {
                [key: string]: {
                    type: string
                    description?: string
                }
            }
            required: string[]
        }
    }
    isAsync?: boolean
}
