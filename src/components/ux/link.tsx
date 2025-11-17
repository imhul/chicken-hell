import { Button } from "@components/ui/button"
// store
import { useStore } from "@/store"

const Link = ({
    to,
    children,
    text = "",
    active = false,
    asChild = false,
    withChildren = false,
    ...props
}: all.ui.LinkProps) => {
    const goto = useStore((s: all.store.GlobalStore) => s.to)

    return withChildren ? (
        <div onClick={() => goto(to)} {...props}>
            {children}
        </div>
    ) : (
        <Button
            asChild={asChild}
            onClick={() => goto(to)}
            variant={active ? "default" : "secondary"}
            {...props}
        >
            {text ?? to}
        </Button>
    )
}

export default Link
