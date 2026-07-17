import { Label } from "@heroui/react";
import { Annoyed } from "lucide-react";
export default function () {
    return <div className="h-full text-center flex justify-center items-center flex-col">
        <Annoyed color="var(--muted)" size={63} />
        <div className="h-2"></div>
        <Label className="block text-xl text-segment">这里空空如也...</Label>
    </div>
}