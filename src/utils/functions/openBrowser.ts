export function openBrowser(url: string): string {
    window.open(url, '_blank', 'noopener')
    return url + ' opened'
}
