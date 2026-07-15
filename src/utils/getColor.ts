export default function (idx: number) {
    if(idx == 0) return "bg-red-400"
    if(idx == 1) return "bg-orange-400"
    if(idx == 2) return "bg-green-400"
    return "bg-accent-soft"
}