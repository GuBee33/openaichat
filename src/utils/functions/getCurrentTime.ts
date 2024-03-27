import { tz } from 'moment-timezone'

export function getCurrentTime(location: string): string {
    try {
        const now = tz(location)

        if (!now.isValid()) {
            return 'Invalid timezone'
        }
        const current_time = now.format('hh:mm:ss A')

        return current_time
    } catch (error) {
        console.error(error)
        return "Sorry, I couldn't find the timezone for " + location
    }
}
