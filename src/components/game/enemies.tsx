import { useState, useEffect } from "react"
// hooks
import { useSFX } from "@hooks/useSFX"
// store
import { usePersistedStore } from "@/store"
// components
import EnemiesColony from "@/components/game/enemies-colony"
// utils
import { getRandomInt } from "@lib/utils"
// config
import { minute, initialColonyModel, maxColoniesPerChunk } from "@lib/config"

type Store = all.store.PersistedStore

const Enemies = ({ ref }: all.game.EnemiesProps) => {
    const [colonies, setColonies] = useState<all.game.ColonyEntity[]>([])
    // store
    const isDev = usePersistedStore((s: Store) => s.isDev)
    const paused = usePersistedStore((s: Store) => s.paused)
    const enemies = usePersistedStore((s: Store) => s.enemies)
    const enemiesList = usePersistedStore((s: Store) => s.colonies)
    const fireSFXStarted = usePersistedStore((s: Store) => s.fireSFXStarted)
    // hooks
    const startSFX = useSFX()

    useEffect(() => {
        if (paused) return
        if (!fireSFXStarted && enemies > 0) {
            startSFX("fire")
            startSFX("baseSpawn")
        }
    }, [enemies, paused, fireSFXStarted])

    useEffect(() => {
        if (paused) return
        if (colonies.length === 0) {
            const enemiesListKeys = enemiesList ? Object.keys(enemiesList) : []

            if (enemiesListKeys.length > 0) {
                setColonies(
                    enemiesListKeys.map((key, index) => ({
                        id: index + 1,
                        uid: key,
                    }))
                )
            } else {
                setColonies([initialColonyModel])
            }
        } else if (colonies.length !== 0 && colonies.length < maxColoniesPerChunk) {
            const dev = isDev()
            const enemiesColoniesSpawnMatrix: Record<number, number> = {
                2: dev ? (minute / 4) : getRandomInt(minute, minute * 2, null, false),
                3: dev ? (minute / 4) : getRandomInt(minute * 3, minute * 5, null, false),
                4: dev ? (minute / 4) : getRandomInt(minute * 7, minute * 10, null, false),
                5: dev ? (minute / 4) : getRandomInt(minute * 13, minute * 17, null, false),
            }
            const nextCount = colonies.length + 1
            const pauseToNextBirth = enemiesColoniesSpawnMatrix[nextCount]

            if (pauseToNextBirth) {
                const timer = setTimeout(() => {
                    setColonies((prev) => [
                        ...prev,
                        { id: prev.length + 1, uid: crypto.randomUUID() },
                    ])
                    startSFX("baseSpawn")
                }, pauseToNextBirth)
                return () => clearTimeout(timer)
            }
        }
    }, [paused, colonies])

    return (
        <pixiContainer sortableChildren={true} label="enemy-manager">
            {colonies.map((colony) => (
                <EnemiesColony colony={colony} key={colony.uid} ref={ref} />
            ))}
        </pixiContainer>
    )
}

export default Enemies
