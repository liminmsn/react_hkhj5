type AnalysisCateGoryObjItemTypeListItem = {
    name: string;
    url: string;
    imgUrl: string;
    tags: string[];
    date: string;
}

type AnalysisCateGoryObjItemTypeCateGoryListListItem = { label: string; url: string; select: boolean };

type AnalysisCateGoryObjItemTypeCateGory = {
    info: string;
    list: { label: string; list: AnalysisCateGoryObjItemTypeCateGoryListListItem[] }[];
}

export type AnalysisCateGoryObjItemType = {
    category: AnalysisCateGoryObjItemTypeCateGory;
    list: AnalysisCateGoryObjItemTypeListItem[];
    pagination: AnalysisCateGoryObjItemTypeCateGoryListListItem[];
}


const analysis_category_obj: AnalysisCateGoryObjItemType = {
    category: {
        info: '',
        list: []
    },
    pagination: [],
    list: []
}
export default function (document: Document) {
    const obj = analysis_category_obj;
    const page_heading = Array.from(document.querySelectorAll(".category") || []);
    const page_pagination = Array.from(document.querySelector(".page.mt")?.children || []);
    console.log(document);


    obj.category = {
        info: (function () {
            const label = page_heading[page_heading.length - 1]?.textContent || '-';
            return label;
        })(),
        list: page_heading.map(item => {
            return {
                label: item.children[0].children[0]?.textContent || '-',
                list: Array.from(item.children[0].children[1].children || []).map(a => {
                    return {
                        label: a.textContent || '-',
                        url: a.getAttribute('href') || '-',
                        select: a.className.indexOf('on') > -1
                    }
                })
            }
        })
    };
    obj.list = Array.from(document.querySelectorAll('.list li') || []).map(item => {
        return {
            name: item.querySelector('.tu.lazyload')?.getAttribute('title') || '-',
            url: item.children[1].children[0]?.getAttribute('href') || '-',
            imgUrl: item.querySelector('.tu.lazyload')?.getAttribute('data-original') || '-',
            tags: item.children[2].textContent.split(',') || [],
            date: item.querySelector('.tu.lazyload')?.textContent || '-',
        }
    });
    obj.pagination = page_pagination.map(item => {
        return {
            label: item.textContent || '-',
            url: item.getAttribute('href') || '-',
            select: item.nodeName === 'SPAN'
        }
    });

    return obj;
}