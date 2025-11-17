import { useEffect, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Viewport } from "pixi-viewport"
// store
import { usePersistedStore } from "@/store"
// hooks
import { useSFX } from "@hooks/useSFX"
import { useGameLoop } from "@hooks/useGameLoop"
// components
import Hero from "@components/game/hero"
import Enemies from "@/components/game/enemies"
import Camera from "@components/game/camera"
import Maggots from "@components/game/maggots"
import Objects from "@components/game/objects"
import Ground from "@components/game/ground"
import Bullets from "@components/game/bullets"

type Store = all.store.PersistedStore

const Game = () => {
    // refs
    const viewportRef = useRef<Viewport | null>(null)
    // store
    const ambientSFXStarted = usePersistedStore((s: Store) => s.ambientSFXStarted)
    const fireSFXStarted = usePersistedStore((s: Store) => s.fireSFXStarted)
    const resetAudio = usePersistedStore((s: Store) => s.resetAudio)
    const gameSize = usePersistedStore((s: Store) => s.gameSize)
    const paused = usePersistedStore((s: Store) => s.paused)
    const scene = usePersistedStore((s: Store) => s.scene)
    // hooks
    const { app } = useApplication()
    globalThis.__PIXI_APP__ = app
    useGameLoop({ ref: viewportRef })
    const startSFX = useSFX()

    useEffect(() => {
        fireSFXStarted && resetAudio()
        !ambientSFXStarted && startSFX("ambient")
    }, [paused])

    const resize = () => {
        if (!viewportRef.current) return
        const width = window.innerWidth
        const height = window.innerHeight
        viewportRef.current.resize(width, height)
    }

    useEffect(() => {
        window.addEventListener("resize", resize)
        resize()

        return () => {
            window.removeEventListener("resize", resize)
        }
    }, [])

    const renderGame = () => {
        switch (scene) {
            case 1:
                return viewportRef ? (<>
                    <Ground size={gameSize} />
                    <Maggots width={gameSize.width} height={gameSize.height} />
                    <Enemies ref={viewportRef} />
                    <Bullets ref={viewportRef} />
                    <Hero ref={viewportRef} />
                    <Objects size={gameSize} />
                    {/* <PixiFire
                            width={50}
                            height={500}
                        /> */}
                </>) : null
            default:
                return null
        }
    }

    return (
        <>
            {(app.renderer && gameSize)
                ? (<Camera
                    ref={viewportRef}
                    events={app.renderer.events}
                    gameSize={gameSize}
                    label="camera"
                >
                    {renderGame()}
                </Camera>) : null
            }
        </>
    )
}

export default Game
