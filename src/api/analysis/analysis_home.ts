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

    //  searchTag: Array.from(data_dom?.querySelectorAll('.search-tag a') || []).map(a => {
    //         return {
    //             tag: a.textContent || '-',
    //             url: a.getAttribute('href') || '-'
    //         }
    //     })

    const data_dom = document.getElementById('index-main')?.children[0]
    data[0] = {
        title: data_dom?.children[0].querySelector('.module-title')?.textContent || '-',
        list: Array.from(data_dom?.children[0].querySelectorAll('.module-item') || []).map(item => {
            return {
                name: item.querySelector('.module-item-titlebox a')?.getAttribute('title') || '-',
                url: item.querySelector('.module-item-titlebox a')?.getAttribute('href') || '/',
                imgUrl: item.querySelector('.module-item-pic img')?.getAttribute('data-src') || '-',
                tags: Array.from(item.querySelector('.module-item-caption')?.children || []).map(item => item.textContent),
                date: item.querySelector('.module-item-text')?.textContent || '-',
            }
        }),
    }

    const all_module_wrapper = document.getElementById('index-main')?.querySelectorAll(".module-wrapper");
    Array.from(all_module_wrapper || []).filter(wrapper => {
        data.push({
            title: wrapper.querySelector('.module-title')?.textContent || '-',
            list: Array.from(wrapper.children[0].querySelectorAll('.module-item') || []).map(item => {
                return {
                    name: item.querySelector('.module-item-titlebox a')?.getAttribute('title') || '-',
                    url: item.querySelector('.module-item-titlebox a')?.getAttribute('href') || '/',
                    imgUrl: item.querySelector('.module-item-pic img')?.getAttribute('data-src') || '-',
                    tags: Array.from(item.querySelector('.module-item-caption')?.children || []).map(item => item.textContent),
                    date: item.querySelector('.module-item-text')?.textContent || '-',
                }
            }),
            side: {
                title: wrapper.children[1].querySelector('.module-title')?.textContent || '-',
                list: Array.from(wrapper.querySelectorAll('.text-list-item') || []).map(item => {
                    return {
                        url: item.getAttribute('href') || '-',
                        title: item.getAttribute('title') || '-',
                        date: item.querySelector('.text-list-title')?.children[1].textContent || '-'
                    }
                })
            }
        })
    })
    return data
}