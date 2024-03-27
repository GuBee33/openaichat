export function getMonthStats(y: number, m: number) {
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0)
    const pad = (start.getDay() - 1 + 7) % 7
    const length = end.getDate()
    return {
        start,
        end,
        length,
        weekendDays:
            Math.floor((length + pad) / 7) * 2 -
            Number(pad === 6) +
            Number(end.getDay() === 6),
    }
}
