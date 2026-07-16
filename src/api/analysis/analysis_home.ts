type AnalysisHomeObjItemTypeListItem = {
    name: string;
    url: string;
    imgUrl: string;
    tags: string[];
    date: string;
}

type AnalysisHomeObjItemSideType = {
    title: string,
    list: {
        url: string
        title: string
        date: string
    }[]
}
type AnalysisHomeObjItemType = {
    title: string
    list: AnalysisHomeObjItemTypeListItem[]
    side?: AnalysisHomeObjItemSideType
}
export type { AnalysisHomeObjItemTypeListItem, AnalysisHomeObjItemType, AnalysisHomeObjItemSideType }
export const analysis_home_obj: AnalysisHomeObjItemType[] = []
export default function (document: Document) {
    const data = analysis_home_obj

    Array.from(document.querySelectorAll(".box.mt") || []).map(model => {
        data.push({
            title: model.querySelector('.on')?.textContent || '-',
            list: Array.from(model.querySelectorAll('.box_r li') || []).map(item => {
                return {
                    name: item.querySelector('.tu.lazyload')?.getAttribute('title') || '-',
                    url: item.children[1].children[0]?.getAttribute('href') || '-',
                    imgUrl: item.querySelector('.tu.lazyload')?.getAttribute('data-original') || '-',
                    tags: item.children[2].textContent.split(',') || [],
                    date: item.querySelector('.tu.lazyload')?.textContent || '-',
                }
            }),
            side: {
                title: model.querySelector('.name')?.children[0].children[1].textContent|| '-',
                list: Array.from(model.querySelectorAll('.box_l li') || []).map(item => {
                    return {
                        url: item.children[1].getAttribute('href') || '-',
                        title: item.children[1].childNodes.item(1).textContent || '-',
                        date: item.children[0].textContent || '-'
                    }
                }).splice(1,12)
            }
        })
    });

    return data
}