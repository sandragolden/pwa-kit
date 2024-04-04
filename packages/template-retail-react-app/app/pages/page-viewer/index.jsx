/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */


import {
    Carousel,
    MobileGrid1r1c,
    MobileGrid2r1c,
    MobileGrid2r2c,
    MobileGrid2r3c,
    MobileGrid3r1c,
    MobileGrid3r2c
} from '../../page-designer/layouts'
import React from 'react'
import {useParams} from 'react-router-dom'
import {Box} from '@salesforce/retail-react-app/app/components/shared/ui'
import {usePage} from '@salesforce/commerce-sdk-react'
import * as Components from '@salesforce/retail-react-app/app/components/shared/ui'
import {Page} from '@salesforce/commerce-sdk-react/components'
import {ImageTile, ImageWithText} from '@salesforce/retail-react-app/app/page-designer/assets'

import {HTTPError, HTTPNotFound} from '@salesforce/pwa-kit-react-sdk/ssr/universal/errors'

const PAGEDESIGNER_TO_COMPONENT = {
    'commerce_assets.photoTile': ImageTile,
    'commerce_assets.imageAndText': ImageWithText,
    'commerce_layouts.carousel': Carousel,
    'commerce_layouts.mobileGrid1r1c': MobileGrid1r1c,
    'commerce_layouts.mobileGrid2r1c': MobileGrid2r1c,
    'commerce_layouts.mobileGrid2r2c': MobileGrid2r2c,
    'commerce_layouts.mobileGrid2r3c': MobileGrid2r3c,
    'commerce_layouts.mobileGrid3r1c': MobileGrid3r1c,
    'commerce_layouts.mobileGrid3r2c': MobileGrid3r2c,
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
