import Button from "@/components/Button";
import Head from "next/head";
import Link from "next/link";
import { HiOutlineMenu, HiPlay } from "react-icons/hi"
import { useState } from "react";
import ProPlayer from "pro-player";
import 'pro-player/dist/index.css'

export default function Home() {
  const [testUrl, setTestURL] = useState<string>('')
  const [testPosterURL, setTestPosterURL] = useState<string>('')
  const [isTestStaticVideo, setIsTestStaticVideo] = useState<string>('false')
  const [playVideo, setPlayVideo] = useState<boolean>(false)

  return (
    <div>
      <Head>
        <title>React Pro Player</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="w-screen h-[80px]">
        <div className="w-full h-full max-w-7xl m-auto flex items-center justify-between px-5 border-b border-b-slate-800">
          <div className="flex items-center gap-2">
            <HiPlay className="text-green-400" size={30} />
            <p className="text-green-400 font-bold text-xl">
              Pro Player
            </p>
          </div>
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-5">
              <li>
                <Link href="/" className={styles.navLink}>Features</Link>
              </li>
              <li>
                <Link href="/" className={styles.navLink}>Pricing</Link>
              </li>
            </ul>
          </nav>
          <div className="hidden lg:block">
            <Button label="Contact" />
          </div>
          <HiOutlineMenu className="lg:hidden" size={30} />
        </div>
      </header>

      <section className="py-20">
        <div className="px-5">
          <div className="text-center flex flex-col gap-5 max-w-4xl m-auto">
            <h1 className="lg:text-5xl text-3xl font-medium">Play HLS & DASH streams with our advanced web video player</h1>
            <p className="opacity-80">Test your HLS (M3U8), DASH stream urls with our player</p>
          </div>
          <div className="flex gap-3 items-center justify-center mt-10 flex-col">
            <input value={testUrl} onChange={event => setTestURL(event.target.value)} className="w-full bg-transparent bg-white outline-none border-none text-black p-2 px-3 rounded-md max-w-xl" placeholder="Video URL to test player" />
            <input value={testPosterURL} onChange={event => setTestPosterURL(event.target.value)} className="w-full bg-transparent bg-white outline-none border-none text-black p-2 px-3 rounded-md max-w-xl" placeholder="Poster image url" />
            {/* <div className="flex items-center gap-3">
              <label>Play HLS URL</label>
              <select className="text-black outline-none" onChange={event => {
                setIsTestStaticVideo(event.target.value)
              }}>
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </select>
            </div> */}
            {/* <Button label="Play" action={() => setPlayVideo(true)} /> */}
          </div>

          {/* https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8 */}
          {/* https://wallpaperaccess.com/full/2680068.jpg */}
          {/* https://c4.wallpaperflare.com/wallpaper/700/984/982/anime-attack-on-titan-armin-arlert-attack-on-titan-blonde-hd-wallpaper-preview.jpg */}

          <div className="w-full lg:max-w-[800px] my-10 mx-auto">
            <ProPlayer
              poster={testPosterURL || 'https://wallpaperaccess.com/full/2680068.jpg'}
              isStaticVideo={isTestStaticVideo === 'false' ? false : true}
              showLogs={true}
              source={testUrl}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  navLink: `hover:text-brand transition-all`
}
