import { useState, useEffect, useRef } from "react"
import { Assets } from "pixi.js"
// store
import { usePersistedStore } from "@/store"
// utils
import { getTextures } from "@lib/utils"
// config
import {
    runState,
    heroSize,
    idleState,
    angryState,
    enemyScale,
    lvlupState,
    bulletSpeed,
    bulletDamage,
    defaultChunkSize,
    initialEnemyModel,
    maxBulletDistance,
    maxDistanceFromEnemyBase,
} from "@lib/config"

type Store = all.store.PersistedStore

const enemyEgg = ({ item, state }: all.game.EnemyEggProps) => {
    // refs
    const eggRef = useRef<all.pixi.AnimatedSprite | null>(null)
    // state
    const [textures, setTextures] = useState<all.game.TexturesCollection>(null)
    const [pos, setPos] = useState<all.game.Position>({ x: 0, y: 0 })
    // store
    const paused = usePersistedStore((s: Store) => s.paused)

    useEffect(() => {
        if (!textures) Assets
            .load("/assets/enemy/enemy-egg.json")
            .then((result: all.game.AtlasJSON) => {
                // console.info("Enemy egg textures loaded: ", result)
                setTextures(getTextures(result, "enemy-egg"))
            })
    }, [textures])

    useEffect(() => {
        if (eggRef.current && textures) {
            if (paused) {
                eggRef.current.stop()
            } else {
                eggRef.current.play()
            }
        }
    }, [textures, paused, item.uid])

    useEffect(() => {
        setPos({ x: item.position.x, y: item.position.y })
    }, [item.uid])

    return textures ? (<pixiAnimatedSprite
        textures={textures[state]}
        ref={eggRef}
        anchor={0.5}
        x={pos.x}
        y={pos.y}
        scale={enemyScale}
        animationSpeed={0.1}
    />) : null
}

export default enemyEgg
