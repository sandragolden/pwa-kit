/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
module.exports = {
    default: {
        hub: 'sfccpm01'
    },
    envs: [
        {
            name: 'production',
            hub: 'sfccpm01',
            vse: 'z4x2qptwzsz01brbyg1o5sp3v.staging.bigcontent.io',
            timeMachine: 'gvzrfgnzc'
        }
    ],
    visualisations: [
        {
            name: 'localhost',
            default: true,
            url: 'http://localhost:3000'
        },
        {
            name: 'staging',
            default: false,
            url: 'https://p-test-sandra.mobify-storefront-staging.com'
        },
        {
            name: 'production',
            default: false,
            url: 'https://sgolden-amplience-poc.mobify-storefront.com'
        }
    ]
}
