import { useEffect } from "react"
import readme from "@root/README.md?raw"
// store
import { usePersistedStore } from "@/store"
// hooks
import { useSFX } from "@hooks/useSFX"
// components
import { Rewind } from 'lucide-react'
import FireCanvas from "@components/ux/fire"
import ReactMarkdown from "react-markdown"
// utils
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import "github-markdown-css/github-markdown.css"
// import { invoke } from '@tauri-apps/api/core'

type Store = all.store.PersistedStore

const Home = () => {
    // store
    const resetAudio = usePersistedStore((s: Store) => s.resetAudio)
    const fireSFXStarted = usePersistedStore((s: Store) => s.fireSFXStarted)
    const ambientSFXStarted = usePersistedStore((s: Store) => s.ambientSFXStarted)
    // hooks
    const startSFX = useSFX()

    useEffect(() => {
        if (fireSFXStarted || ambientSFXStarted) resetAudio()
        startSFX("fire")
    }, [])

    return (
        <div
            className="relative"
        // onClick={() => {
        //     invoke('greet', { name: 'Chicken' }).then((msg) => {
        //         console.log(msg)
        //     })
        // }}
        >
            <div className="home-bg z-1 fixed min-h-screen w-full" />
            <div className="home-logo fixed z-3 right-[3%] top-[100px]">
                <img src="/assets/chicken-hell-logo.png" alt="Chicken Hell Logo" width={420} />
            </div>
            <div className="to-bottom absolute z-5 flex items-center justify-center w-full" title="Scroll to bottom">
                <a href="#bottom-content">
                    <Rewind className="rotate-270" size={80} />
                </a>
            </div>
            <div className="sm:p-10 z-4 relative">
                <div className="flex flex-col p-10 mt-20 markdown-body" id="bottom-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {readme}
                    </ReactMarkdown>
                </div>
            </div>
            <FireCanvas />
        </div>
    )
}

export default Home
