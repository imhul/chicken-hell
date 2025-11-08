import { useEffect } from "react"
// tauri
import { getCurrentWindow } from '@tauri-apps/api/window'
import { getCurrentWebview } from '@tauri-apps/api/webview'
// store
import { useStore } from "@/store"
// components
import { ThemeProvider } from "@components/ux/theme-provider"
import Header from "@components/ux/header"
import { Toaster } from "@components/ui/sonner"
import Home from "@components/ux/home"
import { Output as GameOutput } from "@components/game/output"

const Layout = () => {
    const route = useStore((state: all.store.GlobalStore) => state.route)

    useEffect(() => {
        getCurrentWindow().once('tauri://close-requested', async () => {
            await getCurrentWebview().clearAllBrowsingData()
            // .then(() => {
            //     console.info("Cleared browsing data")
            // })
            await getCurrentWindow().destroy()
        })
    }, [])

    const render = () => {
        switch (route) {
            case "home":
                return <Home />
            case "game":
                return <GameOutput />
            default:
                return null
        }
    }

    return (
        <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
            <Toaster closeButton richColors duration={4000} position="top-right" />
            <Header />
            <main>{render()}</main>
        </ThemeProvider>
    )
}

export default Layout
