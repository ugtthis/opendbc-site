// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server'

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0a0f0e" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta
            name="description"
            content="Explore vehicle specs and openpilot compatibility."
          />
          <meta property="og:title" content="opendbc.com" />
          <meta
            property="og:description"
            content="Explore vehicle specs and openpilot compatibility."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://opendbc.com" />
          <meta property="og:image" content="https://opendbc.com/social-share.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="opendbc.com social share image" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="opendbc.com" />
          <meta
            name="twitter:description"
            content="Explore vehicle specs and openpilot compatibility."
          />
          <meta name="twitter:image" content="https://opendbc.com/social-share.png" />
          <meta name="twitter:image:alt" content="opendbc.com social share image" />
          <title>opendbc.com</title>
          <script async src="https://plausible.io/js/pa-vfDsbF0-tA72L6Wnf0rXO.js"></script>
          <script>
            {`window.plausible = window.plausible || function() { (plausible.q = plausible.q || []).push(arguments) },
            plausible.init = plausible.init || function(i) { plausible.o = i || {} }; plausible.init();`}
          </script>
          <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap"
            rel="stylesheet"
          />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
