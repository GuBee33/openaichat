const usefulLinks = {
    ess: 'https://ph1.wdisp.bosch.com/sap/bc/webdynpro/sap/hress_a_time_persel?sap-wd-configId=ZHRESS_AC_TIM_PERIODSEL_OVP_XX#',
    mytime: 'https://rb-wam.bosch.com/mcr-apigateway-pro-mt/igpm_mcr_mytime_fe/',
}

export function getURL(target: string): string {
    const links: Record<string, string> = usefulLinks
    return links[target] ?? "Url can't be found"
}
