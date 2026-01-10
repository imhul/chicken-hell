import { useEffect, useLayoutEffect, useRef } from "react"
// store
import { usePersistedStore } from "@/store"
// utils
import { generateMapChunk } from "@lib/utils"
// config
import {
    zindex,
    heroSize,
    heroScale,
    heroJumpHeight,
    heroJumpDuration,
    defaultChunkSize,
    distanceToMapBorder,
} from "@lib/config"

type Store = all.store.PersistedStore

type PressedMap = Record<string, boolean>
type TimersMap = Record<string, ReturnType<typeof setTimeout> | null>

type MoveIntent = {
    direction: all.game.MovementDirection
    isKeyDown: boolean
}

type WaterCollisionResult = {
    collision: boolean
    direction: all.game.MovementDirection | null
}

type GameLoopContext = {
    paused: boolean
    water: all.game.Position[]
    keyBindings: all.store.KeyBindings
    heroSnapshot: all.game.HeroEntity
    setHeroAction: (action: all.game.HeroState) => void
    setGameAction: (action: all.game.GameAction, payload?: any) => void
}

interface IChunkBoundaryWatcher {
    check(nextPos: all.game.Position): void
}

class ChunkBoundaryWatcher implements IChunkBoundaryWatcher {
    public check(nextPos: all.game.Position) {
        if (nextPos.x < distanceToMapBorder) generateMapChunk(nextPos, "left")
        if (nextPos.y < distanceToMapBorder) generateMapChunk(nextPos, "top")
        if (nextPos.x > (defaultChunkSize * 2) - distanceToMapBorder) generateMapChunk(nextPos, "right")
        if (nextPos.y > (defaultChunkSize * 2) - distanceToMapBorder) generateMapChunk(nextPos, "bottom")
    }
}

interface IWaterCollisionDetector {
    check(nextPos: all.game.Position): WaterCollisionResult
}

class WaterCollisionDetector implements IWaterCollisionDetector {
    constructor(private readonly getWater: () => all.game.Position[]) { }

    public check(nextPos: all.game.Position): WaterCollisionResult {
        let collidedDirection: all.game.MovementDirection | null = null
        const halfOfHero = heroSize / 2

        for (const object of this.getWater()) {
            const dx = object.x - nextPos.x + halfOfHero
            const dy = object.y - nextPos.y - halfOfHero
            const distance = Math.hypot(dx, dy)

            if (distance < halfOfHero) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    collidedDirection = dx > 0 ? "rune" : "runw"
                } else {
                    collidedDirection = dy > 0 ? "runs" : "runn"
                }
                return { collision: true, direction: collidedDirection }
            }
        }

        return { collision: false, direction: null }
    }
}

class PixiRefs {
    public view: all.view.Viewport | null = null
    public hero: all.game.PixiElementInstance | null = null
    public enemies: all.game.PixiElementInstance[] = []
    public bullets: all.game.PixiElementInstance[] = []

    public syncFromViewport(view: all.view.Viewport) {
        this.view = view
        this.hero = view.getChildByLabel("hero") ?? null

        const enemyManager = view.getChildByLabel("enemy-manager")
        if (enemyManager) {
            const colonyList = enemyManager.getChildrenByLabel("enemy-colony", true)
            this.enemies = colonyList.flatMap((colony) => colony.getChildrenByLabel(/enemy/, true))
        } else {
            this.enemies = []
        }

        this.bullets = view.getChildrenByLabel(/bullet/, true)
    }

    public requireView(): all.view.Viewport {
        if (!this.view) throw new Error("Viewport is not ready yet")
        return this.view
    }

    public requireHero(): all.game.PixiElementInstance {
        if (!this.hero) throw new Error("Hero not found")
        return this.hero
    }
}

class HeroMover {
    constructor(
        private readonly pixi: PixiRefs,
        private readonly chunkWatcher: IChunkBoundaryWatcher,
        private readonly waterCollision: IWaterCollisionDetector,
        private readonly blocked: Set<all.game.MovementDirection>,
    ) { }

    public apply(dx: number, dy: number, direction: all.game.MovementDirection): void {
        const view = this.pixi.view
        const hero = this.pixi.hero
        if (!view || !hero || !hero.position) return

        const nextPos = { x: hero.position.x + dx, y: hero.position.y + dy }

        this.chunkWatcher.check(nextPos)

        const { collision, direction: obstacleDir } = this.waterCollision.check(nextPos)
        if (collision && obstacleDir) {
            this.blocked.add(obstacleDir)
            return
        } else {
            this.blocked.clear()
        }

        view.animate({
            time: 1200,
            position: nextPos,
            ease: "easeOutSine",
        })

        hero.zIndex = (hero.zIndex < zindex.hero || nextPos.y < zindex.hero)
            ? zindex.hero
            : Math.floor(nextPos.y - heroSize / 2)

        hero.position.set(nextPos.x, nextPos.y)

        if (["runnw", "runsw", "runw", "shoot-left", "jump-left"].includes(direction)) {
            hero.scale.x = -heroScale
        } else if (["runne", "runse", "rune", "shoot-right", "jump-right"].includes(direction)) {
            hero.scale.x = heroScale
        }
    }
}

class Runner {
    private raf: number | null = null

    constructor(
        private readonly mover: HeroMover,
        private readonly onStop: () => void,
    ) { }

    public start(dx: number, dy: number, direction: all.game.MovementDirection) {
        this.stop()
        const tick = () => {
            this.mover.apply(dx, dy, direction)
            this.raf = requestAnimationFrame(tick)
        }
        this.raf = requestAnimationFrame(tick)
    }

    public stop() {
        this.onStop()
        if (this.raf) {
            cancelAnimationFrame(this.raf)
            this.raf = null
        }
    }
}

class Jumper {
    private raf: number | null = null
    private isJumping = false

    constructor(
        private readonly pixi: PixiRefs,
        private readonly shouldRepeat: () => boolean,
        private readonly onJumpStart: () => void,
        private readonly onJumpEnd: () => void,
    ) { }

    public jump() {
        if (this.isJumping) return
        this.isJumping = true
        this.onJumpStart()

        const hero = this.pixi.hero
        if (!hero?.position) {
            this.isJumping = false
            this.onJumpEnd()
            return
        }

        const startY = hero.position.y
        const radius = heroJumpHeight
        const startTime = performance.now()

        const animate = (time: number) => {
            const h = this.pixi.hero
            if (!h?.position) return

            const elapsed = time - startTime
            const progress = Math.min(elapsed / (heroJumpDuration * 2), 1)
            const angle = progress * Math.PI

            h.position.y = startY - radius * Math.sin(angle)

            if (progress < 1) {
                this.raf = requestAnimationFrame(animate)
                return
            }

            this.isJumping = false
            if (this.raf) {
                cancelAnimationFrame(this.raf)
                this.raf = null
            }
            this.onJumpEnd()

            if (this.shouldRepeat()) this.jump()
        }

        this.raf = requestAnimationFrame(animate)
    }

    public cancel() {
        this.isJumping = false
        if (this.raf) {
            cancelAnimationFrame(this.raf)
            this.raf = null
        }
    }
}

class InputConductor {
    public resolve(pressed: PressedMap, keyBindings: all.store.KeyBindings): all.game.MovementDirection | null {
        const up = keyBindings.moveup.codes.some((k) => pressed[k])
        const down = keyBindings.movedown.codes.some((k) => pressed[k])
        const left = keyBindings.moveleft.codes.some((k) => pressed[k])
        const right = keyBindings.moveright.codes.some((k) => pressed[k])
        const jump = keyBindings.jump.codes.some((k) => pressed[k])
        const shoot = keyBindings.shoot.codes.some((k) => pressed[k])

        // dedicated jump command
        if (jump) return "jump"

        // run & shoot
        if (((up && left) || (down && left) || left) && shoot) return "shoot-left"
        if (((up && right) || (down && right) || right) && shoot) return "shoot-right"
        if (shoot) return "shoot"

        // run
        if (up && left) return "runnw"
        if (up && right) return "runne"
        if (down && left) return "runsw"
        if (down && right) return "runse"
        if (up) return "runn"
        if (down) return "runs"
        if (left) return "runw"
        if (right) return "rune"

        return null
    }
}

class GameLoopController {
    private ctx: GameLoopContext | null = null
    private readonly pixi = new PixiRefs()

    private readonly pressed: PressedMap = {}
    private readonly timers: TimersMap = {}
    private readonly blocked = new Set<all.game.MovementDirection>()

    private readonly conductor = new InputConductor()
    private readonly chunkWatcher = new ChunkBoundaryWatcher()

    private mover: HeroMover | null = null
    private runner: Runner | null = null
    private jumper: Jumper | null = null

    private attached = false

    constructor(private readonly viewportRef: all.game.CamRef) { }

    public setContext(ctx: GameLoopContext) {
        this.ctx = ctx

        const waterDetector = new WaterCollisionDetector(() => this.ctx?.water ?? [])
        this.mover = new HeroMover(this.pixi, this.chunkWatcher, waterDetector, this.blocked)

        this.runner = new Runner(this.mover, () => {
            this.ctx?.setHeroAction("player-idle")
        })

        this.jumper = new Jumper(
            this.pixi,
            () => Boolean(this.pressed["Space"]),
            () => this.ctx?.setHeroAction("player-jump"),
            () => { /* no-op */ },
        )
    }

    public syncPixiRefs() {
        const view = this.viewportRef.current
        if (!view) return
        this.pixi.syncFromViewport(view)
    }

    public attach() {
        if (this.attached) return
        window.addEventListener("keydown", this.onKeyDown)
        window.addEventListener("keyup", this.onKeyUp)
        this.attached = true
    }

    public detach() {
        if (!this.attached) return
        window.removeEventListener("keydown", this.onKeyDown)
        window.removeEventListener("keyup", this.onKeyUp)
        this.attached = false

        this.runner?.stop()
        this.jumper?.cancel()

        for (const k of Object.keys(this.timers)) {
            const t = this.timers[k]
            if (t) clearTimeout(t)
            this.timers[k] = null
        }
    }

    public centerCameraIfNeeded() {
        const ctx = this.ctx
        const view = this.viewportRef.current
        if (!ctx || !view) return

        const { x, y } = ctx.heroSnapshot.position
        if (x !== 0 || y !== 0) {
            view.animate({
                time: 1200,
                position: ctx.heroSnapshot.position,
                ease: "easeOutSine",
            })
        }
    }

    private stopRun(direction: all.game.MovementDirection | null = null) {
        if (direction) this.blocked.add(direction)
        this.runner?.stop()
    }

    private startRun(dx: number, dy: number, direction: all.game.MovementDirection) {
        this.runner?.start(dx, dy, direction)
    }

    private move(intent: MoveIntent) {
        const ctx = this.ctx
        if (!ctx || !this.mover) return

        const direction = intent.direction
        const isKeyDown = intent.isKeyDown

        if (this.blocked.has(direction)) {
            this.stopRun(direction)
            return
        }

        ctx.setHeroAction("player-run")
        const heroSpeed = ctx.heroSnapshot.speed

        switch (direction) {
            case "runn":
                if (isKeyDown) this.startRun(0, -heroSpeed, direction); else this.stopRun()
                break
            case "runs":
                if (isKeyDown) this.startRun(0, heroSpeed, direction); else this.stopRun()
                break
            case "runw":
                if (isKeyDown) this.startRun(-heroSpeed, 0, direction); else this.stopRun()
                break
            case "rune":
                if (isKeyDown) this.startRun(heroSpeed, 0, direction); else this.stopRun()
                break
            case "runnw":
                if (isKeyDown) this.startRun(-heroSpeed, -heroSpeed, direction); else this.stopRun()
                break
            case "runne":
                if (isKeyDown) this.startRun(heroSpeed, -heroSpeed, direction); else this.stopRun()
                break
            case "runse":
                if (isKeyDown) this.startRun(heroSpeed, heroSpeed, direction); else this.stopRun()
                break
            case "runsw":
                if (isKeyDown) this.startRun(-heroSpeed, heroSpeed, direction); else this.stopRun()
                break
            case "jump":
                this.jumper?.jump()
                ctx.setHeroAction("player-jump")
                break
            case "shoot":
                ctx.setHeroAction("player-stand")
                break
            case "shoot-left":
            case "shoot-right":
                ctx.setHeroAction("player-run-shot")
                break
            default:
                this.stopRun()
                break
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        const ctx = this.ctx
        if (!ctx || ctx.paused) return

        this.pressed[event.code] = true

        // pause shortcut
        const escape = ctx.keyBindings.pause.codes.some((k) => this.pressed[k])
        if (escape) {
            for (const k of Object.keys(this.pressed)) this.pressed[k] = false
            ctx.setGameAction("pause")
            return
        }

        const direction = this.conductor.resolve(this.pressed, ctx.keyBindings)
        if (!direction) return

        if (direction === "jump") {
            this.jumper?.jump()
            return
        }

        if (this.timers[event.code]) return
        this.timers[event.code] = setTimeout(() => {
            this.move({ direction, isKeyDown: true })
        }, 1000)

        this.move({ direction, isKeyDown: true })
    }

    private onKeyUp = (event: KeyboardEvent) => {
        const ctx = this.ctx
        if (!ctx || ctx.paused) return

        if (this.timers[event.code]) {
            clearTimeout(this.timers[event.code]!)
            this.timers[event.code] = null
        }

        this.pressed[event.code] = false

        const direction = this.conductor.resolve(this.pressed, ctx.keyBindings)
        if (direction) {
            this.move({ direction, isKeyDown: true })
        } else {
            this.stopRun()
        }
    }
}

/**
 * SOLID-ish game loop hook (classes + DI).
 * Not wired by default; current game uses [`useGameLoop`](src/hooks/useGameLoop.ts) from [`Game`](src/components/game/game.tsx).
 */
export const useGameLoopSOLID = ({ ref }: all.game.UseGameLoopProps) => {
    // store
    const heroSnapshot = usePersistedStore((s: Store) => s.hero)
    const keyBindings = usePersistedStore((s: Store) => s.preferences.keyBindings)
    const water = usePersistedStore((s: Store) => s.water)
    const paused = usePersistedStore((s: Store) => s.paused)
    const setHeroAction = usePersistedStore((s: Store) => s.setHeroAction)
    const setGameAction = usePersistedStore((s: Store) => s.setGameAction)

    const controllerRef = useRef<GameLoopController | null>(null)

    if (!controllerRef.current) controllerRef.current = new GameLoopController(ref)

    // keep context fresh (DI via setter)
    useEffect(() => {
        controllerRef.current?.setContext({
            paused,
            water,
            keyBindings,
            heroSnapshot,
            setHeroAction,
            setGameAction,
        })
    }, [paused, water, keyBindings, heroSnapshot, setHeroAction, setGameAction])

    // sync pixi refs when viewport/hero state changes (аналог useLayoutEffect у старому хуку)
    useLayoutEffect(() => {
        if (!ref.current) return
        controllerRef.current?.syncPixiRefs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current, heroSnapshot.state])

    // attach/detach listeners
    useEffect(() => {
        if (!keyBindings || paused) {
            controllerRef.current?.detach()
            return
        }

        controllerRef.current?.attach()
        controllerRef.current?.centerCameraIfNeeded()

        return () => controllerRef.current?.detach()
        // як і в старому хуку — реакція здебільшого на paused
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused])
}

export default useGameLoopSOLID