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

export interface SaveRequestType {
    data: SaveType
    slot: number
}

export interface LoadRequestType {
    slot: number
}

export interface DeleteRequestType {
    slot: number
}

export interface SaveResponseType {
    success: boolean
    message: string
}

export interface LoadResponseType {
    success: boolean
    message: string
    data?: SaveType
}
