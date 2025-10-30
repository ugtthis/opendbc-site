import { createMemo, createSignal, Show, type Component } from 'solid-js'
import AccordionContainer from '~/components/AccordionContainer'
import PlayVideoSvg from '~/lib/icons/play-video.svg?raw'
import PauseSvg from '~/lib/icons/pause.svg?raw'
import VolumeOnSvg from '~/lib/icons/volume-on.svg?raw'
import VolumeOffSvg from '~/lib/icons/volume-off.svg?raw'
import { cn } from '~/lib/utils'

type YoutubeVidPlayerProps = {
  videoUrl: string
}

const getYouTubeVideoId = (url: string | null): string | null => {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([\w-]+)/)
  return match ? match[1] : null
}

const getYouTubeEmbedUrl = (videoId: string): string => {
  const params = new URLSearchParams({
    enablejsapi: '1',      // Enable JS API for postMessage control
    controls: '1',         // Show native controls
    modestbranding: '1',   // Minimize YouTube branding
    rel: '0',              // No related videos from other channels
    iv_load_policy: '3',   // Disable annotations
    playsinline: '1',      // Play inline on mobile
    fs: '0',               // Hide fullscreen button
    mute: '1',             // Start muted by default
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

const YoutubeVidPlayer: Component<YoutubeVidPlayerProps> = (props) => {
  const videoId = createMemo(() => getYouTubeVideoId(props.videoUrl))
  const [isPlaying, setIsPlaying] = createSignal(false)
  const [isMuted, setIsMuted] = createSignal(true) // Start muted
  let iframeRef: HTMLIFrameElement | undefined

  const sendCommand = (command: string) => {
    if (iframeRef?.contentWindow) {
      iframeRef.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      )
    }
  }

  const togglePlay = () => {
    sendCommand(isPlaying() ? 'pauseVideo' : 'playVideo')
    setIsPlaying(!isPlaying())
  }

  const toggleMute = () => {
    sendCommand(isMuted() ? 'unMute' : 'mute')
    setIsMuted(!isMuted())
  }

  return (
    <Show when={videoId()}>
      {(id) => (
        <AccordionContainer
          title="User Video"
          id="user-video"
          disableDefaultPadding={true}
        >
          <div class="relative w-full aspect-video">
            <iframe
              ref={iframeRef}
              id={`youtube-player-${id()}`}
              src={getYouTubeEmbedUrl(id())}
              class="w-full h-full"
              title="YouTube video player"
            />
          </div>

          <div class="flex bg-gray-100 divide-x divide-black shadow-[inset_0_8px_12px_-8px_rgba(0,0,0,0.8)]">
            <button
              type="button"
              onClick={togglePlay}
              class={cn(
                'flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm',
                'hover:bg-gray-400 hover:text-white hover:shadow-[inset_0_0_0_4px_rgba(0,0,0,0.3)]',
                'cursor-pointer transition-all'
              )}
            >
              <div class="w-6 h-6" innerHTML={isPlaying() ? PauseSvg : PlayVideoSvg} />
              {isPlaying() ? 'PAUSE' : 'PLAY'}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              class={cn(
                'flex flex-1 items-center justify-center px-4 py-4 text-sm',
                'hover:bg-gray-400 hover:text-white hover:shadow-[inset_0_0_0_4px_rgba(0,0,0,0.3)]',
                'cursor-pointer transition-all'
              )}
              aria-label={isMuted() ? 'Unmute' : 'Mute'}
            >
              <div class="w-6 h-6" innerHTML={isMuted() ? VolumeOffSvg : VolumeOnSvg} />
            </button>
          </div>
        </AccordionContainer>
      )}
    </Show>
  )
}

export default YoutubeVidPlayer

