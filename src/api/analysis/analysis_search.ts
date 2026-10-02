export const search_data = {
    code: 0,
    msg: "",
    body: [] as {
        url: string;
        name: string;
        time: string | number;
        actor: string;
    }[]
}

const type = {
    1: "韩剧",
    3: "韩国电影",
    4: "韩综"
}
export default function (document: Document) {
    console.log(document);
    const err = document.querySelector(".err");
    if (err) {
        return {
            code: -1,
            msg: err.innerHTML,
            body: []
        }
    }

    const list = Array.from(document.querySelectorAll(".txt ul li:not(#t)")).map(li => {
        const key = Number(li.children[2].textContent) as keyof typeof type;
        return {
            url: li.querySelector("#name a")?.getAttribute("href") || "",
            name: li.querySelector("#name a")?.textContent || "",
            time: type[key],
            actor: li.querySelector("#actor")?.textContent || "",
        }
    })
    
    if (list.length > 0) {
        return {
            code: 1,
            msg: "",
            body: list
        };
    }


    return {
        code: -1,
        msg: "没有找到相关内容的视频",
        body: []
    }
}