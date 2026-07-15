import { useState } from "react"

export default function ({ url }: { url: string }) {
    const [err, setErr] = useState(false)
    if (err) {
        return <img src="/logo.png" className="w-30 pt-10 mx-auto" />
    }
    return <img draggable="false" className="h-full w-full"
        loading="lazy"
        decoding="async" src={url} onError={() => setErr(true)} />
}