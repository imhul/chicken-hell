import { useState, useEffect } from "react"
// store
import { useStore, usePersistedStore } from "@/store"
// utils
import { Howl, Howler } from "howler"
// sounds
import fire from "/assets/sounds/fire.ogg"
import Idle1 from "/assets/sounds/enemy-idle-01.ogg"
import Idle2 from "/assets/sounds/enemy-idle-02.ogg"
import Idle3 from "/assets/sounds/enemy-idle-03.ogg"
import attack1 from "/assets/sounds/enemy-attack-01.ogg"
import attack2 from "/assets/sounds/enemy-attack-02.ogg"
import attack3 from "/assets/sounds/enemy-attack-03.ogg"
import baseSpawn1 from "/assets/sounds/enemy-base-spawn-01.ogg"
import baseSpawn2 from "/assets/sounds/enemy-base-spawn-02.ogg"
import baseSpawn3 from "/assets/sounds/enemy-base-spawn-03.ogg"
import short from "/assets/sounds/enemy-short-sound.ogg"
// config
import {
    maxChanceOfEnemyClucking,
    minChanceOfEnemyClucking,
} from "@lib/config"

type Store = all.store.PersistedStore

const soundMap: Record<string, string[]> = {
    idle: [Idle1, Idle2, Idle3],
    attack: [attack1, attack2, attack3],
    ambient: [""],
    fire: [fire],
    baseSpawn: [baseSpawn1, baseSpawn2, baseSpawn3],
}

/* docs: https://github.com/goldfire/howler.js#documentation */

export const useSFX = () => {
    // store
    const ambientSFXStarted = usePersistedStore((s: Store) => s.ambientSFXStarted)
    const attackSFXStarted = usePersistedStore((s: Store) => s.attackSFXStarted)
    const idleSFXStarted = usePersistedStore((s: Store) => s.idleSFXStarted)
    const fireSFXStarted = usePersistedStore((s: Store) => s.fireSFXStarted)

    const soundLevel = usePersistedStore((s: Store) => s.preferences.soundLevel)
    const setAudioAction = usePersistedStore((s: Store) => s.setAudioAction)
    const resetAudio = usePersistedStore((s: Store) => s.resetAudio)
    const route = useStore((s: all.store.GlobalStore) => s.route)
    const colonies = usePersistedStore((s: Store) => s.enemies)
    const paused = usePersistedStore((s: Store) => s.paused)
    const zoom = usePersistedStore((s: Store) => s.zoom) // from 0.5 to 2

    useEffect(() => {
        Howler.autoUnlock = true
    }, [])

    useEffect(() => {
        Howler.volume(soundLevel / 100 * zoom)
    }, [soundLevel, zoom])

    useEffect(() => {
        if (route === "game") {
            if (paused) {
                resetAudio()
            }
            if (!ambientSFXStarted) {
                play("ambient")
                console.info("Game paused, play ambient")
            }
        }
    }, [paused, route])

    const play = (name: string) => {
        const randomIndex = Math.floor(Math.random() * soundMap[name].length)
        const enemies = Object.values(colonies).reduce((acc, colony) => acc + colony.list.length, 0)
        const volume = soundLevel / 100

        const options = {
            autoUnlock: true,
            loop: ["fire", "ambient"].includes(name),
            html5: false,
            volume: route === "game" ? volume * zoom : volume,
            src: [soundMap[name][randomIndex]],
            format: ['ogg'],
            onend: () => {
                console.info(`${name} finished!`)
            },
            onplayerror: () => {
                console.error('Error playing SFX: ', name)
            },
        }

        // console.info('play: ', { name, enemies, route, options, idleSFXStarted, attackSFXStarted, ambientSFXStarted, fireSFXStarted })

        if (name === "fire" && ((route === "game" && enemies > 0) || route === "home")) {
            const fireSFX = new Howl({
                ...options,
                onplayerror: function () {
                    fireSFX.once('unlock', function () {
                        fireSFX.play()
                    })
                },
            })
            fireSFX.play()
            setAudioAction("setFireSFXStarted")
            console.info("Fire SFX started!")
        }

        if (route === "game" && !ambientSFXStarted && name === "ambient") {
            const ambientSFX = new Howl({
                ...options,
                onplayerror: function () {
                    ambientSFX.once('unlock', function () {
                        ambientSFX.play()
                    })
                }
            })
            ambientSFX.play()
            setAudioAction("setAmbientSFXStarted")
            console.info("Ambient SFX started!")
        }

        if (name === "idle" || name === "attack") {
            const chanceCalc = maxChanceOfEnemyClucking + (enemies - 1) * (minChanceOfEnemyClucking - maxChanceOfEnemyClucking) / (50 - 1)
            const chanceOfSFX = Number(chanceCalc.toFixed(5))

            if (!attackSFXStarted && name === "attack") {
                const attackSFX = new Howl(options)
                if (Math.random() < chanceOfSFX) {
                    attackSFX.play()
                    setAudioAction("setAttackSFXStarted")
                    console.info("Enemy attack! 🐔", chanceOfSFX)
                }
            }

            if (!idleSFXStarted && name === "idle") {
                const idleSFX = new Howl(options)
                if (Math.random() < chanceOfSFX) {
                    idleSFX.play()
                    setAudioAction("setIdleSFXStarted")
                    console.info("Enemy cluck! 🐔", chanceOfSFX)
                }
            }
        }
    }

    return (name: string) => play(name)
}
