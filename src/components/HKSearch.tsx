import { Avatar, Button, Input, Label, ListBox } from "@heroui/react";
import { Flame, Search } from "lucide-react";
import HKModal from "./HKModal";
import { useDetailStore, useHKSearchTagsStore, type HKSearchTagsStoreTypeTag } from "../store";
import getColor from "../utils/getColor";
import { useNavigate } from "react-router";

export default function () {
    const navigate = useNavigate();
    const { setDetail } = useDetailStore();
    const { tags } = useHKSearchTagsStore();


    function openDetail(tag: HKSearchTagsStoreTypeTag) {
        setDetail(null)
        navigate("/detail", { state: tag })
    }

    return <HKModal
        btn={
            <Button variant="primary">
                <Search size={40} />
                搜索
            </Button>
        }
        head={
            <div className="pl-2">
                <div className="flex items-center mb-2">
                    <Label className="text-2xl">搜索韩剧</Label>
                </div>
                <Input className="w-full bg-field-hover" placeholder="输入要搜索的片名" />
            </div>
        }
        footer={
            <Button variant="primary">
                <Search size={40} />
                搜索
            </Button>
        }
    >
        {
            tags.length > 0 &&
            <>
                <Label className="text-sm pl-2">大家都在搜这些影片</Label>
                <div className="max-h-100 overflow-auto mt-1">
                    <ListBox aria-label="Tags" selectionMode="none">
                        {
                            tags.map((item, idx) => {
                                return <ListBox.Item key={idx} id={idx} textValue={item.tag}>
                                    <Avatar size="sm">
                                        <Avatar.Fallback className={`${getColor(idx)} text-xl`}>{idx + 1}</Avatar.Fallback>
                                    </Avatar>
                                    <div className="flex items-center" onClick={() => openDetail(item)}>
                                        <Label className="text mr-2">{item.tag}</Label>
                                        {
                                            idx < 3 && <Flame size={20} color="orange" />
                                        }
                                    </div>
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            })
                        }
                    </ListBox>
                </div>
            </>
        }
    </HKModal>
}