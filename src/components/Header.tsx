import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

const Header: Component = () => {
  return (
    <header
      role="banner"
      class={`flex h-24 items-center justify-center bg-gradient-to-r from-[#132410] to-[#396c2f]
        border-b-[3px] border-black shadow-[0_4px_3px_rgba(0,0,0,0.4)]`}
    >
      <A href="/">
        <img src="/opendbc-logo.png" alt="opendbc logo" class="h-auto w-[200px]" loading="eager" decoding="async" fetchpriority="high" />
      </A>
    </header>
  )
}

export default Header
