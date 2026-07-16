import type { AnalysisHomeObjItemTypeListItem } from "../api/analysis/analysis_home";
import { Card, Chip, Label } from "@heroui/react";
import { setUrlVar } from "../utils/setStyleVar";
import HKImg from "./HKImg";
import { useNavigate } from "react-router";
import { useDetailStore } from "../store";

export default function ({ item }: { item: AnalysisHomeObjItemTypeListItem; }) {
    const navigate = useNavigate();
    const { setDetail } = useDetailStore();

    function openDetail() {
        setDetail(null);

        navigate("/detail", {
            state: item,
        });
    }

    return (
        <div
            className="cursor-pointer group"
            onClick={openDetail}
        >
            <Card
                className="
                    rounded-xl
                    h-58
                    w-full
                    mb-2
                    overflow-hidden
                    p-0
                    bg-surface
                    border
                    border-border
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-lg
                    hover:-translate-y-1
                    active:scale-95
                "
                onMouseMove={() =>
                    setUrlVar("--hover_bg", item.imgUrl)
                }
            >
                <HKImg url={item.imgUrl} />
            </Card>
            <div className="mt-2">
                <Label
                    className="
                        block
                        text-base
                        max-w-full
                        overflow-hidden
                    "
                >
                    {item.name}
                </Label>

                {
                    item.tags.length > 0 &&
                    <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, idx) => (
                            <Chip size="sm" key={idx} className=" backdrop-blur-sm">
                                {tag}
                            </Chip>
                        ))}
                    </div>
                }
                {/* <Label className="mt-1 text-xs text-muted" >
                    {item.date}
                </Label> */}
            </div>
        </div>
    );
}