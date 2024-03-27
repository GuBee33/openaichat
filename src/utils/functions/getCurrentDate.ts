export function getCurentDate() {
    const today = new Date()
    return today.toISOString().split('T')[0]
}
