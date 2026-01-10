import { useEffect, useState, useRef } from 'react';

export const useFPS = () => {
    const [fps, setFps] = useState<number>(0);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());

    useEffect(() => {
        let frameId: number;

        const loop = () => {
            const now = performance.now();
            frameCount.current++;

            if (now >= lastTime.current + 1000) {
                setFps(frameCount.current);
                frameCount.current = 0;
                lastTime.current = now;
            }

            frameId = requestAnimationFrame(loop)
        };

        frameId = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frameId)
    }, [])

    return fps
}
