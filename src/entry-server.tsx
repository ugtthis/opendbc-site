// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server'

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" />
          <meta property="og:title" content="opendbc.com" />
          <meta property="og:image" content="https://opendbc.com/opendbc-social-share.png" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content="https://opendbc.com/opendbc-social-share.png" />
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
