import type { AnalysisHomeObjItemTypeListItem } from "./analysis_home";

export interface AnalysisDetailObjType {
    head: AnalysisDetailObjHeadType;
    main: AnalysisDetailObjMainType[];
    playList: AnalysisDetailObjPlayListType[];
    list: AnalysisHomeObjItemTypeListItem[]
}

export interface AnalysisDetailObjHeadType {
    title: string;
    tags: string[];
    papUrl: string;
    imgUrl: string;
}

export interface AnalysisDetailObjMainType {
    title: string;
    item: AnalysisDetailObjMainItemType[] | string
}

export interface AnalysisDetailObjMainItemType {
    name: string;
    url: string | null;
}

export interface AnalysisDetailObjPlayListType {
    title: string;
    list: {
        name: string;
        url: string;
    }[]
}

const analysis_detail_obj = {
    head: {
        title: '',
        tags: [''],
        papUrl: '',
        imgUrl: ''
    },
    main: [],
    playList: [],
    list: []
}

export default function (document: Document) {
    const obj: AnalysisDetailObjType = analysis_detail_obj;
    const head_dom = document.querySelector('.video-info-header');
    const main_dom = document.querySelector('.video-info-main');
    obj.head = {
        title: head_dom?.querySelector('.page-title')?.textContent || '-',
        tags: Array.from(head_dom?.querySelector('.video-info-aux.scroll-content')?.children || []).map(item => {
            return item.textContent.replaceAll('\n', '')
        }),
        papUrl: head_dom?.querySelector('.video-info-play')?.getAttribute('href') || '-',
        imgUrl: document?.querySelector('img')?.getAttribute('data-src') || '-',
    }
    obj.main = Array.from(main_dom?.querySelectorAll('.video-info-items') || []).map(item => {
        return {
            title: item.querySelector('.video-info-itemtitle')?.textContent || '-',
            item: (() => {
                const arr = Array.from(item.querySelector('.video-info-item')?.children || [])
                if (arr.length > 1) {
                    arr.pop()
                    return arr.map(a => {
                        return {
                            name: a.textContent,
                            url: a.getAttribute('href')
                        }
                    })
                }
                if (arr.length == 1) {
                    return arr[0].textContent
                }
                return item.querySelector('.video-info-item')?.textContent || '-'
            })()
        }
    })
    obj.playList = Array.from(document.querySelectorAll(".tab-content.myui-panel_bd ul") || []).map((item, idx) => {
        return {
            title: `播放源${idx + 1}`,
            list: Array.from(item.querySelectorAll('a') || []).map(a => {
                return {
                    name: a.textContent || '-',
                    url: a.getAttribute('href') || '-'
                }
            })
        }
    })

    obj.list = Array.from(document.querySelectorAll('.module-item') || []).map(item => {
        return {
            name: item.querySelector('.module-item-titlebox a')?.getAttribute('title') || '-',
            url: item.querySelector('.module-item-titlebox a')?.getAttribute('href') || '/',
            imgUrl: item.querySelector('.module-item-pic img')?.getAttribute('data-src') || '-',
            tags: Array.from(item.querySelector('.module-item-caption')?.children || []).map(item => item.textContent),
            date: item.querySelector('.module-item-text')?.textContent || '-',
        }
    })

    return obj;
}