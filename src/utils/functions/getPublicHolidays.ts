export async function getPublicHolidays(validFrom: string, validTo: string) {
    try {
        const response = await fetch(
            `https://openholidaysapi.org/PublicHolidays?countryIsoCode=HU&languageIsoCode=EN&validFrom=${validFrom}&validTo=${validTo}`,
        )
        const data: {
            id: string
            startDate: `${number}-${number}-${number}`
            endDate: `${number}-${number}-${number}`
            type: 'Public'
            name: [
                {
                    language: 'EN'
                    text: string
                },
            ]
            nationwide: true
        }[] = await response.json()

        return data
    } catch (error) {
        console.error('Error retrieving public holidays:', error)
        return []
    }
}
