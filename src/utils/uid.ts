function* generateIDs(): Generator<number, never, void> {
    let current = Number.MIN_SAFE_INTEGER
    do {
        yield current++
    } while (true)
}

export default generateIDs()
