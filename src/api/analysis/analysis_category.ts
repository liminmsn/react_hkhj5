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
    const page_heading = Array.from(document.querySelector(".page-heading .box")?.children || []);
    const page_pagination = Array.from(document.getElementById("page")?.children || []);
    console.log(document);
    

    obj.category = {
        info: (function () {
            const label = page_heading[page_heading.length - 1]?.textContent || '-';
            return label;
        })(),
        list: page_heading.map(item => {
            return {
                label: item.querySelector('.library-item-first')?.textContent || '-',
                list: Array.from(item.querySelectorAll('.library-list a') || []).map(a => {
                    return {
                        label: a.textContent || '-',
                        url: a.getAttribute('href') || '-',
                        select: a.className.indexOf('selected') > -1
                    }
                })
            }
        })
    };
    obj.list = Array.from(document.querySelectorAll('.module-items .module-item') || []).map(item => {
        return {
            name: item.querySelector('.module-item-titlebox a')?.getAttribute('title') || '-',
            url: item.querySelector('.module-item-titlebox a')?.getAttribute('href') || '/',
            imgUrl: item.querySelector('.module-item-pic img')?.getAttribute('data-src') || '-',
            tags: Array.from(item.querySelector('.module-item-caption')?.children || []).map(item => item.textContent),
            date: item.querySelector('.module-item-text')?.textContent || '-',
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