import { createMemo, createSignal, Show, type Component } from 'solid-js'
import AccordionContainer from '~/components/AccordionContainer'
import PlayVideoSvg from '~/lib/icons/play-video.svg?raw'
import PauseSvg from '~/lib/icons/pause.svg?raw'
import VolumeOnSvg from '~/lib/icons/volume-on.svg?raw'
import VolumeOffSvg from '~/lib/icons/volume-off.svg?raw'
import { cn } from '~/lib/utils'

type YoutubeVidPlayerProps = {
  videoUrl: string
  title?: string
  sectionId?: string
}

const parseYouTubeUrl = (url: string | null): { videoId: string; timestamp?: number } | null => {
  if (!url) return null

  const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([\w-]+)/)
  if (!idMatch) return null

  const timeMatch = url.match(/[?&](?:t|start)=(\d+)/)
  const timestamp = timeMatch ? Number(timeMatch[1]) : undefined

  return { videoId: idMatch[1], timestamp }
}

const getYouTubeEmbedUrl = (videoId: string, timestamp?: number): string => {
  const params = new URLSearchParams({
    enablejsapi: '1',
    controls: '1',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    playsinline: '1',
    fs: '0',
    mute: '1',
  })

  if (timestamp) params.set('start', String(timestamp))

  return `https://www.youtube.com/embed/${videoId}?${params}`
}

const YoutubeVidPlayer: Component<YoutubeVidPlayerProps> = (props) => {
  const videoData = createMemo(() => parseYouTubeUrl(props.videoUrl))
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
    <Show when={videoData()}>
      {(data) => (
        <AccordionContainer
          title={props.title ?? 'User Video'}
          id={props.sectionId ?? 'user-video'}
          disableDefaultPadding={true}
        >
          <div class="relative w-full aspect-video">
            <iframe
              ref={iframeRef}
              id={`youtube-player-${data().videoId}`}
              src={getYouTubeEmbedUrl(data().videoId, data().timestamp)}
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

