import { Howler } from "howler"

export const initState = {
    idleSFXStarted: false,
    attackSFXStarted: false,
    ambientSFXStarted: false,
    fireSFXStarted: false,
}

export const createAudioSlice: all.store.CreateAudioSliceType = (set, get) => ({
    ...initState,
    resetAudio: () => {
        Howler.stop()
        return set(() => ({ ...initState }))
    },
    setAudioAction: (action, payload) => {
        switch (action) {
            case "setIdleSFXStarted":
                set({ idleSFXStarted: true })
                break
            case "stopIdleSFX":
                set({ idleSFXStarted: false })
                break
            case "setAttackSFXStarted":
                set({ attackSFXStarted: true })
                break
            case "stopAttackSFX":
                set({ attackSFXStarted: false })
                break
            case "setAmbientSFXStarted":
                set({ ambientSFXStarted: true })
                break
            case "stopAmbientSFX":
                set({ ambientSFXStarted: false })
                break
            case "setFireSFXStarted":
                set({ fireSFXStarted: true })
                break
            case "stopFireSFX":
                set({ fireSFXStarted: false })
                break
        }
    }
})
