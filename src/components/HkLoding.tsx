// import { Label, Spinner } from "@heroui/react";
import { RingLoader } from 'react-spinners';

export default function () {
    return <div className="h-full flex flex-col items-center justify-center">
        {/* <img className="w-35 inline" src="/logo.png" /> */}
        {/* <Label className="block my-2 text-2xl">好看韩剧5</Label> */}
        {/* <Spinner /> */}
        <RingLoader
            size={100}
            color="var(--foreground)"
        />
    </div>
}