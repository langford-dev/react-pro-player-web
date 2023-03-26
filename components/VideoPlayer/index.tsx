import Hls from "hls.js"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { BiInfoSquare, BiLoader, BiPause, BiPlay } from "react-icons/bi"
import { MdFullscreen, MdOutlineForward10, MdReplay10 } from "react-icons/md"

interface IPlayer {
    source: string // url of video
    poster?: string // video poster
    showLogs?: boolean // show logs in console
    isStaticVideo: boolean, // whether or not video source passed is for a static video or HLS/DASH
}

interface THTMLVideoElement extends HTMLVideoElement {
    hls: any
}

const VideoPlayer: FC<IPlayer> = ({ source, showLogs, isStaticVideo, poster }) => {
    const videoRef = useRef<THTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [showControls, setShowControls] = useState<boolean>(true)
    const [currentTime, setCurrentTime] = useState<string>('00:00')
    const [currentTimeInt, setCurrentTimeInt] = useState<number>(0)
    const [durationInt, setDurationInt] = useState<number>(0)
    const [duration, setDuration] = useState<string>('00:00')
    const [logMessage, setLogMessage] = useState<string>('00:00')
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
    const [selectedQuality, setSelectedQuality] = useState<number>(0)
    const [qualities, setQualities] = useState<number[]>([])

    useEffect(() => {
        onPlayerLoad()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source, isStaticVideo])

    useEffect(() => {
        listenForMouseMoveOverVideoElement()
    }, [])

    useEffect(() => {
        toggleShowVideoControls()
    }, [showControls])

    const SUPPORTED_MIME_TYPES = [
        "application/vnd.apple.mpegurl"
    ]

    function onPlayerLoad() {
        if (!source) {
            setLogMessage('video source not provided')
            return
        } else setLogMessage('')

        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        setLoading(true)

        if (isStaticVideo) {
            listenForVideoPlayerEvents()
        } else { // set up player for HLS URL
            if (Hls.isSupported()) {
                const hls = new Hls()

                showLogMessage("hls supported", 'LOG')

                video.hls = hls

                hls.loadSource(source)
                hls.attachMedia(video)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setQualities(hls.levels.map((level: any) => level.height))
                    setSelectedQuality(hls.levels.length - 1)
                    listenForVideoPlayerEvents()
                })
            } else if (video.canPlayType(SUPPORTED_MIME_TYPES[0])) {
                video.src = source
                listenForVideoPlayerEvents()
            }
        }
    }

    const handleQualityChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newQuality = parseInt(event.target.value)
        const video = videoRef.current

        setSelectedQuality(newQuality)

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls

            if (hls && hls.levels[newQuality]) {
                hls.currentLevel = newQuality
            }
        }
    }

    function listenForVideoPlayerEvents() {
        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        showLogMessage('loading metadata...', 'LOG')

        video.addEventListener('loadedmetadata', () => {
            setIsPlaying(video.paused)
            setDuration(formatTime(video.duration))
            setDurationInt(video.duration)
            setLoading(false)
        })

        video.addEventListener("timeupdate", () => {
            setCurrentTime(formatTime(video.currentTime))
            setCurrentTimeInt(video.currentTime)
        })

        video.addEventListener("ended", () => {
            setIsPlaying(false)
        })
    }

    function showLogMessage(logMessage_: string, logType?: string) {
        if (showLogs === true) {
            if (logType === "ERROR") console.error(logMessage_)
            if (logType === "WARN") console.warn(logMessage_)
            else console.log(logMessage_)
        }
    }

    function listenForMouseMoveOverVideoElement() {
        const videoPlayerElement = document.querySelector('.playerVideo')

        if (!videoPlayerElement) return

        videoPlayerElement.addEventListener('mousemove', () => {
            setShowControls(true)
        })
    }

    function toggleShowVideoControls() {
        const timeoutId = setTimeout(() => {
            setShowControls(false)
        }, 5000)

        return () => { clearTimeout(timeoutId) }
    }

    function formatTime(seconds: number) {
        const hours = Number((Math.floor(seconds / 3600)).toFixed(0))
        const minutes = Number(Math.floor((seconds - hours * 3600) / 60).toFixed(0))
        const remainingSeconds = Number((seconds - hours * 3600 - minutes * 60).toFixed(0))

        return (
            (hours > 0 ? hours + ":" : "") +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds)
        )
    }

    const handlePlayPause = () => {
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        if (isPlaying) video.pause()
        else video.play()
        setIsPlaying(!isPlaying)
    }

    const handleForwardRewind = (actionType: string) => {
        const video = videoRef.current

        if (!video) {
            showLogMessage("video element not mounted on DOM", 'ERROR')
            return
        }

        if (actionType === "FORWARD") video.currentTime += 10
        if (actionType === "REWIND") video.currentTime -= 10
    }

    const toggleFullScreen = () => {
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        if (isFullScreen) document.exitFullscreen()
        else video.requestFullscreen()
        setIsFullScreen(!isFullScreen)
    }

    const handleProgress = (event: any) => {
        const seekTime = event.target.value
        const video = videoRef.current

        if (!video) {
            showLogMessage('video element not mounted on DOM', 'ERROR')
            return
        }

        video.currentTime = seekTime
        setCurrentTimeInt(seekTime)
        setCurrentTime(formatTime(seekTime))
    }

    const onVideoElementHover = () => {
        setShowControls(true)
    }

    return (
        <>
            <div className="playerContainer">
                {logMessage && <div className="playerContainerOverlay">
                    <div className="playerLogMessageContainerOverlay">
                        <div><BiInfoSquare size={30} /></div>
                        <p>{logMessage}</p>
                    </div>
                </div>}

                {loading && <div className="playerContainerOverlay">
                    <div className="playerContainerOverlaySpinner"><BiLoader size={30} /></div>
                </div>}

                <span>
                    <video poster={poster} onMouseEnter={onVideoElementHover} ref={videoRef} autoPlay className="playerVideo" src={source}>
                        Your browser does not support the video tag.
                    </video>

                    {showControls && <div className="playerControls">
                        <div className="playerControlIcons">
                            <button><MdFullscreen onClick={toggleFullScreen} size={30} /></button>
                            <span onClick={handlePlayPause}>
                                {isPlaying
                                    ? <button><BiPause size={30} /></button>
                                    : <button><BiPlay size={30} /></button>}
                            </span>
                            <button><MdReplay10 onClick={() => handleForwardRewind("REWIND")} size={30} /></button>
                            <button><MdOutlineForward10 onClick={() => handleForwardRewind("FORWARD")} size={30} /></button>
                        </div>

                        <input type="range" min="0" max={durationInt} value={currentTimeInt} onChange={handleProgress} className="playerProgressRange" />

                        <div className="playerDuration">
                            <span className="current-time">{currentTime}</span>
                            <span>/</span>
                            <span className="duration">{duration}</span>
                        </div>

                        {!isStaticVideo && qualities.length > 0 && (
                            <select value={selectedQuality} onChange={handleQualityChange} className="playerQualitySelector">
                                {qualities.map((quality, index) => (
                                    <option key={index} value={index}>
                                        {quality}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>}
                </span>
            </div>
        </>
    )
}

export default VideoPlayer