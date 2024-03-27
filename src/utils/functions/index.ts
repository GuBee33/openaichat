import { AvailableFunction } from '../../models/Interfaces'
import { getCurentDate } from './getCurrentDate'
import { getCurrentTime } from './getCurrentTime'
import { getURL } from './getURL'
import { getWorkingHoursInMonth } from './getWorkingHoursInMonth'
import { openBrowser } from './openBrowser'

export const availableFunctions: AvailableFunction[] = [
    {
        function: openBrowser,
        description: {
            name: 'openBrowser',
            description: 'A simple browser open function',
            parameters: {
                type: 'object',
                properties: {
                    url: { type: 'string' },
                },
                required: ['url'],
            },
        },
    },
    {
        function: getCurrentTime,
        description: {
            name: 'getCurrentTime',
            description: 'Get the current time in a given location',
            parameters: {
                type: 'object',
                properties: {
                    location: {
                        type: 'string',
                        description:
                            'The location name. Location names should be in a format like America/New_York, Asia/Bangkok, Europe/London',
                    },
                },
                required: ['location'],
            },
        },
    },
    {
        function: getCurentDate,
        description: {
            name: 'getCurentDate',
            description: 'Get the local date of today',
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
    },
    {
        function: getWorkingHoursInMonth,
        description: {
            name: 'getWorkingHoursInMonth',
            description: 'Get the working hours in a given year month',
            parameters: {
                type: 'object',
                properties: {
                    year: {
                        type: 'number',
                        description: 'year as a 4 digit number',
                    },
                    month: {
                        type: 'number',
                        description: 'month as a 2 digit number',
                    },
                },
                required: ['year', 'month'],
            },
        },
    },
    {
        function: getURL,
        description: {
            name: 'getURL',
            description: "Return the url of 'ess' or 'mytime'",
            parameters: {
                type: 'object',
                properties: {
                    target: {
                        type: 'string',
                        description: 'this must be ess or mytime',
                    },
                },
                required: ['target'],
            },
        },
    },
]
