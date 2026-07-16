import { useLocation, useNavigate } from "react-router";
import Analysis from "../api/Analysis";
import analysis_detail from "../api/analysis/analysis_detail";
import HkLoding from "../components/HkLoding";
import type { AnalysisHomeObjItemTypeListItem } from "../api/analysis/analysis_home";
import { useEffect } from "react";
import { setUrlVar } from "../utils/setStyleVar";
import { Avatar, Button, Card, Chip, Description, Label, ListBox, Tag, TagGroup } from "@heroui/react";
import { ArrowLeft, TagIcon } from "lucide-react";
import HKImg from "../components/HKImg";
import { useDetailStore, usePlayListStore } from "../store";
import HKCard from "../components/HKCard";
import HKPlayList from "../components/HKPlayList";

export default function () {
    const navigate = useNavigate();
    const { select } = usePlayListStore();

    const { detail, setDetail } = useDetailStore();
    const { state } = useLocation() as { state: AnalysisHomeObjItemTypeListItem }

    useEffect(() => {
        setUrlVar('--hover_bg', state.imgUrl)
        select();
        new Analysis(crypto.randomUUID(), import.meta.env['VITE_URL'] + state.url, analysis_detail, (res) => {
            console.log(res);
            setDetail(res)
        }).get()
    }, [setDetail, select, state])

    if (!detail) {
        return <HkLoding />
    }

    return <div className="pt-10 px-3 relative">
        <div className="bg_blur"></div>
        <div className="text-right mb-2">
            <Button onClick={() => navigate(-1)} variant="secondary">
                <ArrowLeft />
                返回
            </Button>
        </div>
        <div className="flex h-130 gap-2">
            <Card className="flex-1 flex-row backdrop-blur-sm shadow-sm mt-2">
                <div className="flex-1">
                    <Label className="text-3xl">{detail.head.title}</Label>
                    <TagGroup aria-label="Tags" selectionMode="none" className="mt-1">
                        <TagGroup.List>
                            {
                                detail.head.tags.map((item, idx) => {
                                    return <Tag id={idx} key={idx} textValue={item} className="text-accent bg-accent-soft">
                                        <span>{item}</span>
                                        <TagIcon />
                                    </Tag>
                                })
                            }
                        </TagGroup.List>
                    </TagGroup>
                    <div className="max-h-105 overflow-auto">
                        <ListBox aria-label="影视信息" selectionMode="none">
                            {
                                detail.main.map((item, idx) => {
                                    return <ListBox.Item key={idx} id={idx} textValue={item.title}>
                                        <Avatar size="sm">
                                            <Avatar.Fallback>{idx + 1}</Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <Label>{item.title}</Label>
                                            {
                                                Array.isArray(item.item)
                                                    ? <div className="pt-1 gap-1 flex flex-wrap">
                                                        {
                                                            item.item.map((item, idx) => <Chip key={idx} className="bg-accent-soft">
                                                                {item.name}
                                                            </Chip>)
                                                        }
                                                    </div>
                                                    : <Description>{item.item}</Description>
                                            }
                                        </div>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                })
                            }
                        </ListBox>
                    </div>
                </div>
                <div className="flex-1">
                    <HKPlayList gridCols="grid-cols-5" playList={detail.playList} detail={detail} />
                </div>
            </Card>
            <Card className="w-90 p-0! overflow-clip shadow-sm">
                <HKImg url={state.imgUrl || detail.head.imgUrl} />
            </Card>
        </div>
        {
            detail.list.length > 0 &&
            <>
                <div className="my-2 mt-6">
                    <Label className='text-xl hk_title'>猜你喜欢</Label>
                </div>
                <div className='grid grid-cols-6 gap-2 mt'>
                    {
                        detail.list.map(item => <HKCard item={item} key={item.url} />)
                    }
                </div>
            </>
        }
        <div className="h-20"></div>
    </div>
}