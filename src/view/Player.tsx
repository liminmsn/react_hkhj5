import "plyr-react/plyr.css"
import type { PlyrPropsType } from "../components/HKPlayer";
import HKPlayer from "../components/HKPlayer";
import { useEffect, useRef } from "react";
import type { APITypes } from "plyr-react";
import { useLocation, useNavigate } from "react-router";
import type { SourceInfo } from "plyr";
import { Button, Card, Label, Tag, TagGroup } from "@heroui/react";
import type { AnalysisDetailObjPlayListType, AnalysisDetailObjType } from "../api/analysis/analysis_detail";
import { CircleX, X, Minimize2, List } from "lucide-react";
import Hls from "hls.js";
import GlobalWebViewEbent from "../event/GlobalWebViewEbent";
import HKPlayList from "../components/HKPlayList";

export type PlayerInfoType = {
    m3u8url: string;
    detail: AnalysisDetailObjType;
    playList: AnalysisDetailObjPlayListType[]
}


const plyrProps: PlyrPropsType = {
    source: {
        type: "video",
        sources: [
            {
                src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
                type: "video/mp4",
                size: 720,
            },
        ],
        poster: "/poster.png",
    },
    options: {
        controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            // "pip",
            // "airplay",
            "fullscreen",
        ],
    },
}

const hls = new Hls();

hls.on(Hls.Events.ERROR, (e) => {
    console.log(e);
})

function hlsPlay(url: string) {
    hls.loadSource(url);
}

export default function () {
    const navigate = useNavigate();
    const player = useRef<APITypes>(null);
    const { state } = useLocation() as { state: PlayerInfoType };
    const playerControl = useRef<HTMLDivElement>(null);
    const playerListRef = useRef<HTMLDivElement>(null);

    const source: SourceInfo = {
        type: "video",
        poster: "/poster.png",
        sources: [
            {
                src: state.m3u8url,
                type: "application/x-mpegURL"
            }
        ]
    }


    function togglePlayerListRefShow() {
        if (playerListRef.current) {
            const dom = playerListRef.current;
            dom.style.display = (dom.style.display == 'block' || dom.style.display == '') ? 'none' : 'block'
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (player.current) {
                const video = (player.current.plyr as any).media;
                hls.attachMedia(video);
                hlsPlay(state.m3u8url);

                // 绑定自定义控件
                const dom = document.querySelector(".plyr__controls")
                if (dom && playerControl.current) {
                    dom.appendChild(playerControl.current);
                }
                //从写全屏按钮事件
                const btn_full = document.querySelector("button[data-plyr='fullscreen']") as HTMLButtonElement;
                if (btn_full) {
                    btn_full.onclick = function () {
                        GlobalWebViewEbent.send({
                            id: crypto.randomUUID(),
                            data: {
                                type: 'win',
                                data: { type: 'toggleFullscreen' }
                            }
                        }, (data) => {
                            console.log(data);
                        })
                    }
                }
            }
        }, 100);
        // setTimeout(() => {
        //     togglePlayerListRefShow()
        // }, 2000);
    }, [state.m3u8url])

    return <div className="flex w-screen h-screen">
        <div ref={playerControl} className="absolute pointer-events-none left-0 right-0 bottom-0 h-screen text-left p-4">
            <div className="flex">
                <div className="flex-1">
                    <Label className="text-3xl text-white hk_title">{state.detail.head.title}</Label>
                    <TagGroup aria-label="Tags" selectionMode="none" className="mt-1">
                        <TagGroup.List>
                            {
                                state.detail.head.tags.map((item, idx) => {
                                    return <Tag id={idx} key={idx} textValue={item}>{item}</Tag>
                                })
                            }
                        </TagGroup.List>
                    </TagGroup>
                </div>
                <div className="w-auto pointer-events-auto">
                    <X className="cursor-pointer active:scale-90" size={28} onClick={() => {
                        GlobalWebViewEbent.sendOnce({
                            id: crypto.randomUUID(),
                            data: { type: 'win', data: { type: 'Reset' } }
                        })
                        setTimeout(() => {
                            navigate(-1)
                        }, 100);
                    }} />
                </div>
            </div>
            <div className="">
                <Card ref={playerListRef} className="pointer-events-auto block backdrop-blur-sm max-w-2/5 max-h-120 p-2! mt-2 shadow-lg">
                    <div className="flex">
                        <HKPlayList panelStyle="max-h-90" gridCols="grid-cols-6 max-h-9/12" detail={state.detail} playList={state.playList} replace />
                    </div>
                </Card>
                <div className="my-2">
                    <Button className="pointer-events-auto rounded-xl" size="sm" onClick={togglePlayerListRefShow}>
                        <List />
                    </Button>
                </div>
            </div>
        </div>
        <HKPlayer ref={player} options={plyrProps.options} source={source} />
    </div>
}