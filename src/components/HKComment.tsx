import { ListBox, Avatar, Description, Label } from "@heroui/react";
import type { AnalysisDetailComment } from "../api/analysis/analysis_detail";
// import { useUserInfoStore } from "../store";

export default function ({ comments }: { comments: AnalysisDetailComment[] }) {
    // const { info } = useUserInfoStore();

    return <div className="flex gap-x-1.5">
        <ListBox aria-label="Users" selectionMode="none">
            {
                comments.map((item, idx) => {
                    return <ListBox.Item key={idx} id={idx} textValue="Bob">
                        <Avatar size="lg">
                            <Avatar.Image alt="Bob" src={item.img} />
                            <Avatar.Fallback>{item.name}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-x-1.5">
                                <Label>{item.name}</Label>
                                <Description>{item.time}</Description>
                            </div>
                            <Description className="text-muted">{item.label}</Description>
                        </div>
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                })
            }
        </ListBox>
        
    </div>
}