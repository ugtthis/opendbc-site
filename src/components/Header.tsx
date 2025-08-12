import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

const Header: Component = () => {
  return (
    <header
      role="banner"
      class={`
        flex justify-center items-center h-24
        bg-gradient-to-r border-black from-[#132410] to-[#396c2f] border-b-[3px] shadow-[0_4px_3px_rgba(0,0,0,0.4)]
      `}
    >
      <A href="/">
        <img src="/opendbc-logo.png" alt="opendbc logo" class="h-auto w-[200px]" loading="eager" decoding="async" fetchpriority="high" />
      </A>
    </header>
  )
}

export default Header
