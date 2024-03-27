import type { Converter } from 'showdown'
import { InjectionKey } from 'vue'

export const CONVERTER_KEY: InjectionKey<Converter> = Symbol('converter')
