import { useEffect } from "react";
import HkLoding from "../../components/HkLoding";
import Analysis from "../../api/Analysis";
import analysis_category from "../../api/analysis/analysis_category";
import { useCateGoryStore } from "../../store";
import { Label } from "@heroui/react";
import HKCard from "../../components/HKCard";

export default function () {
    const { data, setData, url, setUrl } = useCateGoryStore();

    useEffect(() => {
        setData(null);
        new Analysis<any>(crypto.randomUUID(), import.meta.env['VITE_URL'] + url, analysis_category, (res) => {
            console.log(res);
            setData(res);
        }).get();
    }, [setData, url])

    function ToggleCateGory(url: string) {
        setUrl(url)
    }

    if (!data) {
        return <HkLoding />
    }

    return <div className="px-3 pt-5">
        <div className="bg_blur"></div>
        {/* <div className="text-center text-shadow-sm text-shadow-color-red">
            {data.category.info}
        </div> */}
        <div>
            {
                data.category.list.filter(item => item.label != '-').map((item, idx) => {
                    return <div key={idx} className="flex items-center gap-x-7">
                        <Label className="text-xl hk_title">{item.label}</Label>
                        <div className="flex flex-wrap gap-1 mt-2 mb-4">
                            {
                                item.list.map((item_, idx_) => {
                                    return <div key={idx_} onClick={() => ToggleCateGory(item_.url)} className={`px-4 py-1 rounded-2xl backdrop-blur-sm text-nowrap cursor-pointer ${item_.select ? 'bg-accent' : 'active:scale-95 bg-default'}`}>
                                        <Label>{item_.label}</Label>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                })
            }
        </div>
        <div className="grid grid-cols-6 gap-2">
            {data.list.map((item, idx) => {
                return <HKCard key={idx} item={item} />
            })}
        </div>
        <div className="flex justify-center gap-x-1 mt-6">
            {
                data.pagination.map((item, idx) => {
                    return <div onClick={() => ToggleCateGory(item.url)} key={idx} className={`px-4 py-1 rounded-2xl cursor-pointer ${item.select ? 'bg-accent' : 'active:scale-95 bg-field-border-hover'}`}>
                        <Label>{item.label}</Label>
                    </div>
                })
            }
        </div>
        <div className="h-10"></div>
    </div>
}