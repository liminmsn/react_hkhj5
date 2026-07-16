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
    const head_dom = document.querySelector("#wp1ay .detail");
    obj.head = {
        title: head_dom?.querySelector('.info')?.children[0].children[1]?.textContent || '-',
        tags: head_dom?.querySelector('.info')?.children[1].children[1].textContent.split(',') || [],
        papUrl: '-',
        imgUrl: head_dom?.querySelector('img')?.getAttribute('data-original') || '-',
    }
    obj.main = Array.from(head_dom?.querySelectorAll('.info dl') || []).splice(2, 5).map(dl => {
        return {
            title: dl.children[0]?.textContent || '-',
            item: (() => {
                return dl.children[1].textContent || '-';
            })()
        }
    })
    obj.main.push({
        title: document.querySelector('#jq')?.children[0].textContent || '-',
        item: document.querySelector('#jq')?.children[1].textContent || '-'
    })

    obj.playList = Array.from(document.querySelectorAll(".box.mt").item(1).querySelectorAll('.play') || []).map((item, idx) => {
        return {
            title: `播放源${idx + 1}`,
            list: Array.from(item.querySelectorAll('a') || []).map(a => {
                return {
                    name: a.textContent || '-',
                    url: a.getAttribute('onclick') || '-'
                }
            })
        }
    })

    obj.list = Array.from(document.querySelectorAll('.box.mt .list li') || []).map(item => {
        return {
            name: item.querySelector('.tu.lazyload')?.getAttribute('title') || '-',
            url: item.children[1].children[0]?.getAttribute('href') || '-',
            imgUrl: item.querySelector('.tu.lazyload')?.getAttribute('data-original') || '-',
            tags: item.children[2].textContent.split(',') || [],
            date: item.querySelector('.tu.lazyload')?.textContent || '-',
        }
    })

    return obj;
}