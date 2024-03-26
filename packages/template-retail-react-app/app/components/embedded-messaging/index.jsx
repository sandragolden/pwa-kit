/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

/**
 * Use the Embedded Messaging component to add Messaging for Web to your storefront
 */
const EmbeddedMessaging = ({isEnabled, codeSnippet}) => {
    useEffect(() => {
        if (!window || !document || !codeSnippet || !isEnabled) {
            return
        }

        // Extract the URL of the script
        const urlRegex = /src='(.*?)'/i
        const urlMatch = codeSnippet.match(urlRegex)
        const srcUrl = urlMatch && urlMatch.length > 1 ? urlMatch[1] : null

        // Extract the onload function name
        const onloadRegex = /onload='(.*?)'/i
        const onloadMatch = codeSnippet.match(onloadRegex)
        const onloadFunctionName =
            onloadMatch && onloadMatch.length > 1 ? onloadMatch[1].replace('()', '') : null

        // Extract the function using the onload function name
        const functionRegex = new RegExp(
            `function ${onloadFunctionName}\\(\\) \\{[\\s\\S]*?\\};`,
            'i'
        )
        const functionMatch = codeSnippet.match(functionRegex)
        const functionBody = functionMatch ? functionMatch[0] : null

        const script = document.createElement('script')
        const code = document.createElement('script')

        if (srcUrl && functionBody && onloadFunctionName) {
            script.src = srcUrl
            code.innerHTML = functionBody
            script.onload = () => {
                document.body.appendChild(code)
                if (typeof window[onloadFunctionName] === 'function') {
                    window[onloadFunctionName]()
                }
            }
            document.body.appendChild(script)
        }

        return () => {
            script && document.body.removeChild(script)
            code && document.body.removeChild(code)
        }
    }, [])

    return <></>
}

EmbeddedMessaging.propTypes = {
    isEnabled: PropTypes.bool,
    codeSnippet: PropTypes.string
}

export default EmbeddedMessaging
