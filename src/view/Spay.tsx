import { Label, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function () {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate("/", { replace: true })
        }, 1000);
    }, [])
    return <div className="h-full flex flex-col items-center justify-center">
        <Label className="block my-2 text-2xl">支付查询...</Label>
        <Spinner />
    </div>
}