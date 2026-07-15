import analysis_home, { type AnalysisHomeObjItemType } from "../../api/analysis/analysis_home"
import { Label } from "@heroui/react"
import Analysis from "../../api/Analysis"
import HkLoding from "../../components/HkLoding"
import HKCard from "../../components/HKCard"
import { setUrlVar } from "../../utils/setStyleVar"
import { useHkHomeStore, useHKSearchTagsStore } from "../../store"
import { useEffect } from "react"
import HKSearch from "../../components/HKSearch"
import analysis_search_tags from "../../api/analysis/analysis_search_tags"
import HKSide from "../../components/HKSide"

export default function () {
    const { setTags } = useHKSearchTagsStore();
    const { list: dataList, update: setdataList } = useHkHomeStore();

    useEffect(() => {
        if (!dataList) {
            new Analysis<AnalysisHomeObjItemType[]>(crypto.randomUUID(), import.meta.env['VITE_URL'], analysis_home, (res) => {
                console.log(res);
                setdataList(res)
                if (res)
                    setUrlVar('--hover_bg', res[0].list[0].imgUrl)
            }, (document) => setTags(analysis_search_tags(document))).get()
        }
    })

    if (!dataList) {
        return <HkLoding />
    } else
        return <div className="px-3">
            <div className="bg_blur"></div>
            <div className="flex justify-between mt-6 z-2">
                <div className="flex items-start gap-x-2">
                    {/* <img src="/logo.png" className="w-10 inline" />
                    <Label className="text-2xl">好看韩剧5</Label> */}
                </div>
                <HKSearch />
            </div>
            {dataList.map((item, idx) => {
                if (item.side) {
                    return <div key={idx} className="pt-5 flex gap-x-2">
                        <div className="max-w-8/10 min-w-8/10">
                            <Label className='text-2xl hk_title'>{item.title}</Label>
                            <div className='grid grid-cols-5 2xl:grid-cols-6 gap-2 mt-3'>
                                {
                                    item.list.map(item => <HKCard item={item} key={item.url} />)
                                }
                            </div>
                        </div>
                        <div className="">
                            <HKSide side={item.side} />
                        </div>
                    </div>
                } else
                    return <div key={idx} className="pt-5">
                        <Label className='text-2xl hk_title'>{item.title}</Label>
                        <div className='grid
                        grid-cols-6
                        2xl:grid-cols-7
                        gap-2 mt-3'>
                            {
                                item.list.map((item, idx) => <HKCard item={item} key={idx} />)
                            }
                        </div>
                    </div>
            })}
            <div className="h-25"></div>
        </div>
}