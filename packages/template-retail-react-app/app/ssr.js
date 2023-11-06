/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
'use strict'

import path from 'path'
import {getRuntime} from 'pwa-kit-runtime/ssr/server/express'
import {getConfig} from 'pwa-kit-runtime/utils/ssr-config'
import helmet from 'helmet'

const options = {
    // The build directory (an absolute path)
    buildDir: path.resolve(process.cwd(), 'build'),

    // The cache time for SSR'd pages (defaults to 600 seconds)
    defaultCacheTimeSeconds: 600,

    // The contents of the config file for the current environment
    mobify: getConfig(),

    // The port that the local dev server listens on
    port: 3000,

    // The protocol on which the development Express app listens.
    // Note that http://localhost is treated as a secure context for development,
    // except by Safari.
    protocol: 'http'
}

const runtime = getRuntime()

const getRuntimeAdmin = () => {
    return [
        'localhost:*',
        '*.mobify-staging.com',
        '*.mobify-storefront-staging.com',
        '*.mobify-storefront.com'
    ]
}

const {handler} = runtime.createHandler(options, (app) => {
    // Set HTTP security headers
    app.use(
        helmet({
            // pwa-kit-runtime ensures that the Content-Security-Policy header always contains the
            // directives required for PWA Kit to function. Add custom directives here.
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'img-src': [
                        '*.commercecloud.salesforce.com',
                        '*.cdn.content.amplience.net',
                        'cdn.media.amplience.net',
                        '*.staging.bigcontent.io',
                        'i8.amplience.net',
                        '*.stylitics.com'
                    ],
                    'script-src': [
                        'storage.googleapis.com',
                        '*.cdn.content.amplience.net',
                        'cdn.media.amplience.net',
                        '*.staging.bigcontent.io',
                        '*.brightcove.net',
                        '*.stylitics.com',
                        "'unsafe-inline'",
                        ...getRuntimeAdmin()
                    ],
                    'connect-src': [
                        "'unsafe-eval'",
                        'api.cquotient.com',
                        '*.cdn.content.amplience.net',
                        'cdn.media.amplience.net',
                        'cdn.static.amplience.net',
                        '*.staging.bigcontent.io',
                        '*.stylitics.com',
                        ...getRuntimeAdmin()
                    ],
                    'default-src': [
                        "'self'",
                        "'unsafe-eval'",
                        '*.cdn.content.amplience.net',
                        'cdn.media.amplience.net',
                        'cdn.static.amplience.net',
                        '*.staging.bigcontent.io',
                        '*.brightcove.net',
                        '*.stylitics.com',
                        'data:',
                        ...getRuntimeAdmin()
                    ],
                    'frame-ancestors': ["'self'", '*.amplience.net', ...getRuntimeAdmin()]
                }
            }
        })
    )

    // Convert %2F to '/' in path coming from category node visualisation
    app.get('*%2F*', async (req, res) => {
        const [path, query] = req.url.split('?')
        res.redirect(`${path.replace(/%2F/, '/')}?${query}`)
    })

    // If you gave something with a // in the first instance, put in the default locale
    app.get('//*', async (req, res) => {
        const [path, query] = req.url.split('?')
        // TODO: calculate the default locale instead of hard coding to en-US
        res.redirect(`${path.replace(/^\/\//, '/en-US/')}?${query}`)
    })

    // Handle the redirect from SLAS as to avoid error
    app.get('/callback?*', (req, res) => {
        // This endpoint does nothing and is not expected to change
        // Thus we cache it for a year to maximize performance
        res.set('Cache-Control', `max-age=31536000`)
        res.send()
    })
    app.get('/robots.txt', runtime.serveStaticFile('static/robots.txt'))
    app.get('/favicon.ico', runtime.serveStaticFile('static/ico/favicon.ico'))

    app.get('/worker.js(.map)?', runtime.serveServiceWorker)
    app.get('*', runtime.render)
})
// SSR requires that we export a single handler function called 'get', that
// supports AWS use of the server that we created above.
export const get = handler
