export {}

declare global {
    interface Array<T> {
        last: T | undefined
        first: T | undefined
    }
}

Object.defineProperty(Array.prototype, 'last', {
    get() {
        return this[this.length - 1]
    },
})
Object.defineProperty(Array.prototype, 'first', {
    get() {
        return this[0]
    },
})
