import { useRef } from "react"
import { Application, useExtend } from "@pixi/react"
// store
import { usePersistedStore } from "@/store"
// components
import Game from "@components/game/game"
import DevChart from "@components/ux/dev-chart"
import PauseModal from "@components/ux/pause-modal"
import ProgressBar from "@components/ux/progress-bar"
import InitialScene from "@components/ux/initial-scene"
import {
    AnimatedSprite,
    TilingSprite,
    Container,
    Graphics,
    Sprite,
} from "pixi.js"
// config
import { maxEnemyProgress } from "@lib/config"

type Store = all.store.PersistedStore

export const Output = () => {
    // refs
    const parentRef = useRef<HTMLDivElement>(null)
    // store
    const paused = usePersistedStore((s: Store) => s.paused)
    const isGameInit = usePersistedStore((s: Store) => s.init)
    const enemies = usePersistedStore((s: Store) => s.enemies)
    const showCharts = usePersistedStore((s: Store) => s.showCharts)
    const preferences = usePersistedStore((s: Store) => s.preferences)
    const showEnemyProgress = usePersistedStore((s: Store) => s.showEnemyProgress)

    useExtend({
        AnimatedSprite,
        TilingSprite,
        Container,
        Graphics,
        Sprite,
    })

    return (
        <div ref={parentRef} className="game-container">
            {isGameInit ? (<>
                {showEnemyProgress && (<ProgressBar min={0} max={maxEnemyProgress} current={enemies} />)}
                {showCharts && (<DevChart currentValue={enemies} />)}
                <Application resizeTo={parentRef} antialias={preferences.antialias} autoDensity={true} >
                    <Game />
                </Application>
                <PauseModal open={paused} />
            </>) : (<InitialScene />)}
        </div>
    )
}
