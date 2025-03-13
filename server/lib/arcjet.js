
import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";


// init arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects your app from common attacks, examples: SQL injections, XSS, CSRF attacks
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            // block all bots except search enginers
            allow: [
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),

        // rate limiting
        tokenBucket({     // inside of server.js, we use "requested" to specify how many tokens each request consumes
            mode: "LIVE",
            refillRate: 5,   // how many tokens we receive at the end of the interval
            interval: 10,   // stands for 10 seconds
            capacity: 10   // stands for maximum of 10 tokens (so it doesn't keep refilling every 10 seconds forever, it stops when there are 10 tokens remaining)
        })
    ]
})



