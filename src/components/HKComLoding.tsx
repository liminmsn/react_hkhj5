import { PuffLoader } from "react-spinners";

export default function ({ size }: { size?: number }) {
    return <div className="z-10 absolute left-0 top-0 bottom-0 right-0 rounded-3xl flex bg-surface items-center justify-center pt-10">
        <PuffLoader
            size={size}
            color="var(--accent)" />
    </div>
}