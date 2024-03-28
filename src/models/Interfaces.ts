// @ts-ignore
import  {ChatCompletionMessage,ChatCompletion,ChatCompletionContentPart} from 'openai'


export type Message = ChatCompletionMessage & {
    showmd?: boolean
} & { content?: string|ChatCompletionContentPart }

export interface SystemMessage {
    name: string
    code: Message[]
}

export type Conversation = SystemMessage & {
    id: symbol
    options: ChatCompletion
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
