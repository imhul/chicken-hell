// config
import { defaultChunkSize, initialBaseModel } from '@lib/config'

export type Enemies = Record<string, all.game.EnemyEntity[]>

export const initState = {
    init: false,
    paused: false,
    gameOver: false,
    isAttack: false,
    water: [],
    startTimestamp: 0,
    playTime: 0,
    gameSize: {
        width: defaultChunkSize * 2,
        height: defaultChunkSize * 2,
    },
    zoom: 1,
    scene: 1,
    seed: undefined,
    worldName: '',
    heroName: '',
    enemies: 0,
    colonies: {},
    bullets: [] as all.game.BulletEntity[],
    preferences: {
        antialias: true,
        difficulty: "normal" as all.game.GameDifficultyType,
        theme: "system" as all.ui.ThemeName,
        soundLevel: 50,
        fullscreen: false,
        keyBindings: {
            moveup: {
                keys: ['ArrowUp', 'w'],
                codes: ['ArrowUp', 'KeyW'],
                keyCodes: [87, 38]
            },
            movedown: {
                keys: ['ArrowDown', 's'],
                codes: ['ArrowDown', 'KeyS'],
                keyCodes: [83, 40]
            },
            moveleft: {
                keys: ['ArrowLeft', 'a'],
                codes: ['ArrowLeft', 'KeyA'],
                keyCodes: [65, 37]
            },
            moveright: {
                keys: ['ArrowRight', 'd'],
                codes: ['ArrowRight', 'KeyD'],
                keyCodes: [68, 39]
            },
            jump: {
                keys: [' '],
                codes: ['Space'],
                keyCodes: [32]
            },
            shoot: {
                keys: ['f'],
                codes: ['KeyF'],
                keyCodes: [70]
            },
            pause: {
                keys: ['Escape', 'p'],
                codes: ['Escape', 'KeyP'],
                keyCodes: [27, 80]
            },
        }
    },
}

export const createGameSlice: all.store.CreateGameSliceType = (set, get) => ({
    ...initState,
    setGameAction: (action, payload) => {
        switch (action) {
            case "init":
                set({ init: true, startTimestamp: performance.now() })
                break
            case "pause":
                set(() => ({ paused: true }))
                break
            case "resume":
                set({ paused: false })
                break
            case "restart":
                set(initState)
                get().resetHero()
                get().resetAudio()
                break
            case "exit":
                set({ ...initState, gameOver: true, paused: true })
                get().resetUI()
                get().resetHero()
                get().resetAudio()
                break
            case "clearCache":
                set(initState)
                get().resetUI()
                get().resetHero()
                get().resetAudio()
                break
            case "resize":
                set({ gameSize: payload })
                break
            case "setAttack":
                set({ isAttack: payload })
                break
            case "saveWater":
                set({ water: payload })
                break
            case "setSeed":
                set({ seed: payload })
                break
            case "setZoom":
                set({ zoom: payload })
                break
            case "setWorldName":
                set({ worldName: payload })
                break
            case "setHeroName":
                set({ heroName: payload })
                break
            case "setPref":
                set({ preferences: payload })
                break
            case "addBullet":
                set((s) => ({
                    bullets: [...s.bullets, payload]
                }))
                break
            case "removeBullet":
                set((s) => ({
                    bullets: s.bullets.filter(bullet => bullet.id !== payload)
                }))
                break
            case "setScene":
                set({ scene: payload })
                break
            case "setColonyState":
                const { uid, angry } = payload
                set((s) => ({
                    colonies: {
                        ...s.colonies,
                        [uid]: {
                            ...s.colonies[uid],
                            angry,
                            lastAttackTimestamp: performance.now(),
                            list: s.colonies[uid]?.list.map((enemy) => ({
                                ...enemy,
                                state: angry ? "angry" : enemy.state,
                            })) || [],
                        },
                    },
                }))
                break
            case "setEnemies":
                set((s) => ({
                    colonies: {
                        ...s.colonies,
                        [payload.colonyUid]: {
                            ...initialBaseModel,
                            list: [
                                ...(s.colonies[payload.colonyUid]?.list || []),
                                payload.newEnemy,
                            ],
                            dirty: true,
                            angry: false,
                            lastAttackTimestamp: 0,
                        },
                    },
                    enemies: Object.values(s.colonies).reduce((acc, colony) => acc + colony.list.length, 0) + 1,
                }))
                break
            case "updateEnemy":
                set((s) => ({
                    colonies: {
                        ...s.colonies,
                        [payload.colony.uid]: {
                            ...s.colonies[payload.colony.uid],
                            list: s.colonies[payload.colony.uid].list.map((enemy) =>
                                enemy.uid === payload.uid ? payload : enemy
                            ),
                        },
                    },
                }))
                break
            case "removeEnemy":
                set((s) => ({
                    colonies: {
                        ...s.colonies,
                        [payload.colony.uid]: {
                            ...s.colonies[payload.colony.uid],
                            list: s.colonies[payload.colony.uid].list.filter(
                                (enemy) => enemy.uid !== payload.uid
                            ),
                        },
                    },
                }))
                break
            case "removeColony":
                set((s) => {
                    const newColonies = { ...s.colonies }
                    delete newColonies[payload.uid]
                    return { colonies: newColonies }
                })
        }
    },
})
