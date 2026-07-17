import { useWatchListStore } from "../../store"

export default function () {
    const { list } = useWatchListStore();
    return <div>
        {JSON.stringify(list)}
    </div>
}