import { useState, useEffect, useRef } from "react"
// store
import { usePersistedStore } from "@/store"
// components
import Enemy from "@components/game/enemy"
import EnemyEgg from "@components/game/enemy-egg"
import EnemyBase from "@/components/game/enemy-base"
// utils
import { getRandomInt } from "@lib/utils"
import Rand from "rand-seed"
// config
import {
    minute,
    defaultChunkSize,
    initialEnemyModel,
    maxEnemiesPerColony,
    maxBirthEnemyDistance,
} from "@lib/config"

type Store = all.store.PersistedStore

const EnemiesColony = ({ ref, colony }: all.game.ColonyProps) => {
    // refs
    const colonyRef = useRef<all.pixi.Container | null>(null)
    const queenRef = useRef<all.pixi.AnimatedSprite | null>(null)
    // store
    const isDev = usePersistedStore((s: Store) => s.isDev)
    const paused = usePersistedStore((s: Store) => s.paused)
    const colonies = usePersistedStore((s: Store) => s.colonies)
    const setGameAction = usePersistedStore((s: Store) => s.setGameAction)
    // state
    const [enemies, setEnemies] = useState<all.game.EnemyEntity[]>([])
    const [basePos, setBasePos] = useState<all.game.Position>({ x: 0, y: 0 })

    const getRandomPositionNearBase = (base: all.game.Position) => {
        const x = getRandomInt(
            base.x - maxBirthEnemyDistance,
            base.x + maxBirthEnemyDistance
        )
        const y = getRandomInt(
            base.y - maxBirthEnemyDistance,
            base.y + maxBirthEnemyDistance
        )
        return { x, y }
    }

    const getNewId = (colonyId: number, list: all.game.EnemyEntity[], needToUp: number) => {
        const newId = `${colonyId}-${list.length + 1 + needToUp}`
        const isNewIDExist = list.find(e => e.id === newId)
        if (isNewIDExist) {
            return getNewId(colonyId, list, needToUp + 1)
        }
        return newId
    }

    useEffect(() => {
        if (paused) return
        if (enemies.length < maxEnemiesPerColony) {
            const dev = isDev()
            const enemySpawnMatrix: Record<number, number> = {
                1: dev ? minute / 4 : getRandomInt(minute / 2, minute, null, false),
                2: dev ? minute / 4 : getRandomInt(minute / 2, minute * 1.5, null, false),
                3: dev ? minute / 4 : getRandomInt(minute, minute * 2, null, false),
                4: dev ? minute / 4 : getRandomInt(minute * 2.5, minute * 3, null, false),
                5: dev ? minute / 4 : getRandomInt(minute * 4, minute * 5, null, false),
                6: dev ? minute / 4 : getRandomInt(minute * 6, minute * 8, null, false),
                7: dev ? minute / 4 : getRandomInt(minute * 9, minute * 12, null, false),
                8: dev ? minute / 4 : getRandomInt(minute * 13, minute * 15, null, false),
                9: dev ? minute / 4 : getRandomInt(minute * 16, minute * 19, null, false),
                10: dev ? minute / 4 : getRandomInt(minute * 20, minute * 25, null, false),
            }
            const nextCount = enemies.length + 1
            const pauseToNextBirth = enemySpawnMatrix[nextCount]

            if (pauseToNextBirth) {
                const currentColony = colonies[colony.uid]
                const dirty = currentColony ? currentColony.dirty : false
                const timer = setTimeout(() => {
                    const base = {
                        x: getRandomInt(1, defaultChunkSize * 2),
                        y: getRandomInt(1, defaultChunkSize * 2),
                    }
                    // if (enemies.length === 0 && dirty) {
                    //     console.info("Spawning first enemy for dirty colony")
                    //     const newEnemy: all.game.EnemyEntity = {
                    //         ...initialEnemyModel,
                    //         id: `${colony.id}-1`,
                    //         uid: crypto.randomUUID(),
                    //         base,
                    //         colony,
                    //         position: getRandomPositionNearBase(base),
                    //     }
                    //     setBasePos(base)
                    //     setGameAction("setEnemies", { colonyUid: colony.uid, newEnemy })
                    //     return
                    // }
                    const list = currentColony?.list || []
                    const enemyBasePosition = dirty ? (list[0]?.base ?? base) : base
                    const newEnemyState = list[0] ? list[0].state : initialEnemyModel.state
                    const id = getNewId(colony.id, list, 0)
                    const isQueen = list.length === 0
                    const position = isQueen
                        ? getRandomPositionNearBase(enemyBasePosition)
                        : (queenRef.current ? {
                            x: queenRef.current.x,
                            y: queenRef.current.y
                        } : list[0].position)

                    const newEnemy: all.game.EnemyEntity = {
                        ...initialEnemyModel,
                        id,
                        colony,
                        position,
                        hp: isQueen ? initialEnemyModel.hp * 5 : initialEnemyModel.hp,
                        totalHp: isQueen ? initialEnemyModel.hp * 5 : initialEnemyModel.hp,
                        name: (isQueen ? "queen-" : "enemy-") + colony.id,
                        queen: isQueen,
                        egg: !isQueen,
                        state: newEnemyState,
                        base: enemyBasePosition,
                        uid: crypto.randomUUID(),
                        timestamp: performance.now(),
                    }
                    setGameAction("setEnemies", { colonyUid: colony.uid, newEnemy })
                }, pauseToNextBirth)

                return () => clearTimeout(timer)
            }
        }
    }, [paused, enemies, colony, setGameAction, colonies])

    useEffect(() => {
        const colonyData = colonies[colony.uid]

        if (!colonyData) {
            setEnemies([])
            setBasePos({ x: 0, y: 0 })
            return
        }

        const list = colonyData.list || []
        setEnemies(list)

        if (list.length > 0) {
            setBasePos(list[0].base)
        }
    }, [colonies, colony])

    useEffect(() => {
        if (colonyRef.current && !queenRef.current) {
            const queenSprite = colonyRef.current.getChildByLabel("queen-" + colony.id)
            queenRef.current = queenSprite as all.pixi.AnimatedSprite
            console.info("queenSprite: ", queenSprite)
        }
    }, [colonyRef, queenRef, colony, colonies, enemies])

    const colonyData = colonies[colony.uid]
    if (!colonyData) return null

    return (
        <pixiContainer ref={colonyRef} sortableChildren={true} label="enemy-colony">
            {(ref.current && (basePos.x !== 0 || basePos.y !== 0)) ? (
                <>
                    <EnemyBase
                        isDeath={!enemies.length && colonyData.dirty}
                        isBirth={!enemies.length && !colonyData.dirty}
                        pos={basePos}
                        uid={colony.uid}
                    />
                    {enemies.length > 0 &&
                        enemies.map((enemy) => {
                            return enemy.egg ?
                                (<EnemyEgg
                                    item={enemy}
                                    key={enemy.id}
                                />) : (<Enemy
                                    key={enemy.id}
                                    item={enemy}
                                    ref={ref}
                                    base={basePos}
                                    seed={new Rand(enemy.uid)}
                                />)
                        })}
                </>
            ) : null}
        </pixiContainer>
    )
}

export default EnemiesColony
