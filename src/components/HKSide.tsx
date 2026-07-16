import { Label, ListBox, Avatar, Description } from "@heroui/react"
import type { AnalysisHomeObjItemSideType } from "../api/analysis/analysis_home"
import getColor from "../utils/getColor"
import { useNavigate } from "react-router"
import { useDetailStore } from "../store"

export default function ({ side }: { side: AnalysisHomeObjItemSideType }) {
    const navigate = useNavigate()
    const { setDetail } = useDetailStore()
    function openDetail(item: any) {
        setDetail(null)
        navigate("/detail", {
            viewTransition: true,
            preventScrollReset: true,
            state: item,
        })
    }

    if (side) {
        return <>
            <Label className='text-2xl hk_title'>{side.title}</Label><ListBox aria-label="Users" className="" selectionMode="none">
                {side.list.map((item, idx) => {
                    return <ListBox.Item key={idx} id={idx} textValue={item.title}>
                        <Avatar size="sm">
                            <Avatar.Fallback className={`${getColor(idx)} text-xl`}>{idx + 1}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col" onClick={() => openDetail(item)}>
                            <Label className="text">{item.title}</Label>
                            <Description>{item.date}</Description>
                        </div>
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                })}
            </ListBox>
        </>
    }
}