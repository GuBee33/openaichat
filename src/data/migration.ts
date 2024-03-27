import { Message, SystemMessage, Conversation } from '../models/Interfaces'
import { DEFAULT_SYSTEM_MESSAGES, DEFAULT_OPTIONS } from './defaults'

export const STORAGE_VERSION = 4
const installedStorageVersion = Number(
    localStorage.version ??
        ((localStorage.conversations || localStorage.customSystemMessages) &&
            1) ??
        0,
)

if (installedStorageVersion && installedStorageVersion !== STORAGE_VERSION) {
    try {
        migrate(installedStorageVersion, STORAGE_VERSION)
    } catch (_e) {
        localStorage.clear()
        localStorage.version = STORAGE_VERSION
    }
} else {
    localStorage.version = STORAGE_VERSION
}

export function migrate(from: number, to: number) {
    switch (from) {
        // @ts-expect-error
        case 1:
            migrate1To2()
            if (to === 1) break

        case 2:
        // @ts-expect-error
        case 3:
            migrate2ToOptions()
            if (to === 3) break

        case STORAGE_VERSION:
        default:
            localStorage.version = to.toString()
            break
    }
}

function migrate1To2() {
    const customSysMsgs: SystemMessage[] | null = JSON.parse(
        localStorage.getItem('customSystemMessages')!,
    )
    if (customSysMsgs) {
        localStorage.setItem(
            'systemMessages',
            JSON.stringify([
                ...DEFAULT_SYSTEM_MESSAGES,
                customSysMsgs.map(msg => ({
                    ...msg,
                    code: [msg.code[1], msg.code[0]],
                    options: DEFAULT_OPTIONS,
                })),
            ]),
        )
        localStorage.removeItem('customSystemMessages')
    }

    const conversations: Record<string, Message[]> = JSON.parse(
        localStorage.getItem('conversations')!,
    )
    if (conversations) {
        localStorage.setItem(
            'conversations',
            JSON.stringify(
                Object.entries(conversations).map(
                    ([name, [hello, system, ...rest]]) => ({
                        name,
                        code: [system, hello, ...rest],
                        options: DEFAULT_OPTIONS,
                    }),
                ),
            ),
        )
    }
}
function migrate2ToOptions() {
    const newConverstaions: Conversation[] = JSON.parse(
        localStorage.getItem('conversations')!,
    )
    if (newConverstaions) {
        newConverstaions.forEach(conversation => {
            conversation['options'] ??= DEFAULT_OPTIONS
        })
        localStorage.setItem('conversations', JSON.stringify(newConverstaions))
    }
}
