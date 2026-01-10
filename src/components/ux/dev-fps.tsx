import { useFPS } from "@hooks/useFPS"

const DevFPS = () => {
    const fps = useFPS()

    return (
        <div className="fps">
            FPS: {fps}
        </div>
    )
}

export default DevFPS
