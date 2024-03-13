/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {useParams} from 'react-router-dom'
import {Box} from '@salesforce/retail-react-app/app/components/shared/ui'
import {usePage} from '@salesforce/commerce-sdk-react'
import * as Components from '@salesforce/retail-react-app/app/components/shared/ui'
import {Page} from '@salesforce/commerce-sdk-react/components'
import {ImageTile} from '@salesforce/retail-react-app/app/page-designer/assets'

import {HTTPError, HTTPNotFound} from '@salesforce/pwa-kit-react-sdk/ssr/universal/errors'

const PAGEDESIGNER_TO_COMPONENT = {
    'commerce_assets.photoTile': ImageTile,
    'headless.einsteinAssisted': Components
}

const PageViewer = () => {
    const {pageId} = useParams()
    const {data: page, error} = usePage({parameters: {pageId}})

    if (error) {
        let ErrorClass = error.response?.status === 404 ? HTTPNotFound : HTTPError
        throw new ErrorClass(error.response?.statusText)
    }

    return (
        <Box layerStyle={'page'}>
            <Page
                page={page}
                components={PAGEDESIGNER_TO_COMPONENT}
                jsxParserComponents={Components}
            />
        </Box>
    )
}

PageViewer.displayName = 'PageViewer'

export default PageViewer
