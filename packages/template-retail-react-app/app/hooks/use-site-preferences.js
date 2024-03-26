/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import useMultiSite from '@salesforce/retail-react-app/app/hooks/use-multi-site'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {useAccessToken} from '@salesforce/commerce-sdk-react'
import {useQuery} from '@tanstack/react-query'

/**
 *
 * @param {String} action - the action path: empty ('') for site prefs by ID or "groups" for site prefs by group ID
 * @param {Array} ids - array of site preference or group IDs
 * @returns {UseQueryResult<{}|*, unknown>}
 */
const useSitePreferences = ({action = '', ids}) => {
    const {
        app: {commerceAPI}
    } = getConfig()
    const {
        parameters: {organizationId}
    } = commerceAPI
    const appOrigin = getAppOrigin()

    const {site} = useMultiSite()
    const {getTokenWhenReady} = useAccessToken()

    const actionCleaned = action.replace(/^\/|\/$/g, '')
    const allowedActions = ['groups'];
    const actionPath = allowedActions.includes(actionCleaned) ? `${actionCleaned}/`  : ''

    const idPath = ids && ids.length ? `(${ids.join()})` : '()'

    return useQuery({
        queryKey: ['custom', 'site-preferences', actionPath, idPath],
        queryFn: async () => {
            const urlParams = new URLSearchParams()
            urlParams.append('siteId', site.id)
            const token = await getTokenWhenReady()
            const endpoint = `${appOrigin}/${commerceAPI.proxyPath.replace(
                /^\/|\/$/g,
                ''
            )}/custom/site-preferences/v1/organizations/${organizationId}/${actionPath}${idPath}?${urlParams.toString()}`
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Could not retrieve site preferences: ${response.status}`)
            }
            const data = await response.json()
            return data.results
        }
    })
}

export default useSitePreferences
