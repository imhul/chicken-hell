import { useState, useEffect, useRef } from "react"
import { Assets, AnimatedSprite } from "pixi.js"
// hooks
import { useBirthAnimation } from "@hooks/useBirth"
// store
import { usePersistedStore } from "@/store"
// utils
import { getTextures } from "@lib/utils"
// config
import {
    minute,
    enemyScale,
} from "@lib/config"

type Store = all.store.PersistedStore

const enemyEgg = ({ item }: all.game.EnemyEggProps) => {
    // refs
    const eggRef = useRef<all.pixi.AnimatedSprite | null>(null)
    // state
    const [textures, setTextures] = useState<all.game.TexturesCollection>(null)
    const [eggState, setEggState] = useState<all.game.EnemyEggState>("jump")
    // store
    const paused = usePersistedStore((s: Store) => s.paused)
    const gameAction = usePersistedStore((s: Store) => s.setGameAction)
    // hooks
    useBirthAnimation(
        eggRef as React.RefObject<AnimatedSprite>,
        !!textures,
        "enemy"
    )

    useEffect(() => {
        if (!textures) Assets
            .load("/assets/enemy/enemy-egg.json")
            .then((result: all.game.AtlasJSON) => {
                setTextures(getTextures(result, "enemy-egg"))
            })
    }, [textures])

    useEffect(() => {
        if (!eggRef.current || !textures) return
        if (paused) {
            eggRef.current.stop()
        } else {
            eggRef.current.play()

            if (eggState === "birth") return

            setTimeout(() => {
                if (eggRef.current === null) return
                setEggState("birth")
                eggRef.current.textures = textures["birth"]
                eggRef.current.loop = false
                eggRef.current.animationSpeed = 0.05
                eggRef.current.play()
            }, minute / 4)
        }
    }, [textures, paused, item.uid])

    return textures ? (<pixiAnimatedSprite
        textures={textures["jump"]}
        ref={eggRef}
        anchor={0.5}
        eventMode={"static"}
        x={item.position.x}
        y={item.position.y}
        scale={enemyScale}
        loop
        animationSpeed={0.2}
        label={`enemy-egg-${item.uid}`}
        onComplete={() => {
            if (eggState === "birth") {
                gameAction("updateEnemy", {
                    ...item,
                    egg: false,
                    state: "idle",
                })
            }
        }}
    />) : null
}

export default enemyEgg
