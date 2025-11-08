// tauri
import { getCurrentWebview } from '@tauri-apps/api/webview'
// components
import { Button } from "@components/ui/button"
import { RefreshCw } from "lucide-react"
import GameMenu from "@/components/ux/game-menu"
import Menu from "@components/ux/menu"
import Link from "@components/ux/link"
import DevHeroActions from "@components/ux/dev-hero-actions"
import DevMenu from "@/components/ux/dev-menu"
// store
import { useStore, usePersistedStore } from "@/store"

const Header = () => {
    const route = useStore((state: all.store.GlobalStore) => state.route)
    const showHeroActionMenu = usePersistedStore((state: all.store.PersistedStore) => state.showHeroActionMenu)

    const reload = async () => {
        await getCurrentWebview().clearAllBrowsingData().then(() => {
            console.info("Cleared browsing data")
        })
    }

    return (
        <header className="fixed w-full z-10 flex items-center justify-between h-[84px] p-3 pl-4 pr-6  bg-gray-100 dark:bg-[var(--secondary)]">
            <Link withChildren to="home">
                <img
                    src="/assets/chicken-hell-logo.png"
                    alt="Chicken Hell Logo"
                    width={100}
                    className="logo"
                />
            </Link>
            <Menu />
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => reload()}
                    className={
                        "no-border no-bg-on-hover" + " " +
                        "hover:text-primary" + " " +
                        "hover:bg-transparent" + " " +
                        "data-[state='open']:text-primary"
                    }
                >
                    <RefreshCw className="scale-250 transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                {route === "game" && (<>
                    {showHeroActionMenu && (<DevHeroActions />)}
                    <DevMenu />
                    <GameMenu />
                </>)}
            </div>
        </header>
    )
}

export default Header
