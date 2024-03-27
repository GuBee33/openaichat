import { getMonthStats } from './getMonthStats'
import { getPublicHolidays } from './getPublicHolidays'

export async function getWorkingHoursInMonth(
    year: number,
    month: number,
): Promise<number> {
    const { length, weekendDays, start, end } = getMonthStats(year, month)
    const workdaysWithHolidays = length - weekendDays
    const workingHoursWithHolidays = workdaysWithHolidays * 8
    const holidays = await getPublicHolidays(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0],
    )

    return holidays.reduce((wh, h) => {
        const day = new Date(h.startDate).getDay()
        return wh - Number(day !== 0 && day !== 6) * 8
    }, workingHoursWithHolidays)
}
