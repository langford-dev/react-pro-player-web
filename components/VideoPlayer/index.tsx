import { FC, useEffect, useRef, useState } from "react"
import { BiInfoSquare, BiLoader, BiPause, BiPlay } from "react-icons/bi"
import { MdFullscreen, MdOutlineForward10, MdReplay10 } from "react-icons/md"

interface IPlayer {
    source: string
}

const VideoPlayer: FC<IPlayer> = ({ source }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
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

    console.log('source', !!source)

    useEffect(() => {
        if (!source) {
            setLogMessage("video source not provided")
            return
        } else setLogMessage('')

        const video = videoRef.current

        if (!video) {
            console.log("video element not mounted on DOM")
            return
        }

        console.log('loading metadata...')

        video.addEventListener('loadedmetadata', (metadata) => {
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

        // return () => {
        //     video.removeEventListener("loadedmetadata", () => { })
        //     video.removeEventListener("timeupdate", () => { })
        //     video.removeEventListener("ended", () => { })
        // }
    }, [source])

    useEffect(() => {
        listenForMouseMoveOverVideoElement()
    }, [])

    useEffect(() => {
        toggleShowVideoControls()
    }, [showControls])

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
        }, 2000)

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
            console.log("video element not mounted on DOM")
            return
        }

        if (isPlaying) video.pause()
        else video.play()
        setIsPlaying(!isPlaying)
    }

    const handleForwardRewind = (actionType: string) => {
        const video = videoRef.current

        if (!video) {
            console.log("video element not mounted on DOM")
            return
        }

        if (actionType === "FORWARD") video.currentTime += 10
        if (actionType === "REWIND") video.currentTime -= 10
    }

    const toggleFullScreen = () => {
        const video = videoRef.current

        if (!video) {
            return
        }

        if (isFullScreen) document.exitFullscreen()
        else video.requestFullscreen()
        setIsFullScreen(!isFullScreen)
    }

    const handleProgress = (event: any) => {
        const video = videoRef.current
        const seekTime = event.target.value

        if (!video) {
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
                    <div><BiInfoSquare size={30} /></div>
                    <p>{logMessage}</p>
                </div>}

                {loading && <div className="playerContainerOverlay">
                    <div className="playerContainerOverlaySpinner"><BiLoader size={30} /></div>
                </div>}

                <span>
                    <video onMouseEnter={onVideoElementHover} ref={videoRef} autoPlay className="playerVideo" src={source}>
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

                        <select className="playerQualitySelector">
                            <option value="240p">240p</option>
                            <option value="360p">360p</option>
                            <option value="480p">480p</option>
                            <option value="720p">720p</option>
                        </select>
                    </div>}
                </span>
            </div>
        </>
    )
}

export default VideoPlayer