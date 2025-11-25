export interface SaveType {
    bullets: all.game.BulletEntity[]
    colonies: all.store.Colonies
    gameSize: all.game.BaseSize
    hero: all.game.HeroEntity
    heroName: string
    playTime: number
    preferences: all.store.Preferences
    scene: number
    seed: string
    startTimestamp: number
    water: all.game.Position[]
    worldName: string
    zoom: number
}
