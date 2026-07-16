import { Button, Label, Tabs } from "@heroui/react"
import type { AnalysisDetailObjPlayListType, AnalysisDetailObjType } from "../api/analysis/analysis_detail"
import getPlayerUrl from "../utils/getPlayerUrl"
import { useNavigate } from "react-router";
import { usePlayListStore } from "../store";

type PlayItem = AnalysisDetailObjPlayListType["list"][number];

export default function ({ panelStyle, gridCols, playList, detail, replace, onClick }: { panelStyle?: string; gridCols: string; playList: AnalysisDetailObjPlayListType[], detail: AnalysisDetailObjType, replace?: boolean, onClick?: (item: PlayItem) => void }) {
    const navigate = useNavigate();
    const { play_select_ctegory, play_select_item, select } = usePlayListStore();

    function Play(item: PlayItem) {
        if (onClick) {
            onClick(item)
            return;
        }
        getPlayerUrl(item.url, (m3u8_url) => navigate("/player", {
            preventScrollReset: true,
            viewTransition: true,
            replace,
            state: {
                m3u8url: m3u8_url,
                detail,
                playList
            }
        }))
    }
    return <div className="flex-1 max-h-full">
        <div className="my-2">
            <Label className='text-xl hk_title'>播放列表</Label>
        </div>
        <Tabs className="h-full" selectedKey={play_select_ctegory} onSelectionChange={(key) => select(key, play_select_item)}>
            <Tabs.ListContainer>
                <Tabs.List aria-label="Options" className="w-auto">
                    {
                        playList.map((item, idx) => {
                            return <Tabs.Tab id={idx} key={idx}>
                                <Label className="text-nowrap cursor-pointer">{item.title}</Label>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        })
                    }
                </Tabs.List>
            </Tabs.ListContainer>
            {
                playList.map((item, idx) => {
                    return <Tabs.Panel className={`max-h-9/12 ${panelStyle} overflow-y-auto`} id={idx} key={idx}>
                        <div className={`grid ${gridCols} gap-1`}>
                            {
                                item.list.map((item, idx) => {
                                    return <Button key={idx} className="w-full" variant={`${play_select_item == idx ? 'primary' : 'outline'}`} onClick={() => {
                                        select(play_select_ctegory, idx);
                                        Play(item);
                                    }} >
                                        {item.name}
                                    </Button>
                                })
                            }
                        </div>
                    </Tabs.Panel>
                })
            }
        </Tabs>
    </div>
}