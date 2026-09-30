import { useEffect } from "react";
import { useLocation } from "react-router";
import Analysis from "../api/Analysis";
import analysis_search from "../api/analysis/analysis_search";

export default function Search() {
    const location = useLocation();
    const { search } = location.state as { search: string };

    useEffect(() => {
        new Analysis(
            crypto.randomUUID(),
            `${import.meta.env["VITE_URL"]}/search/`,
            analysis_search,
            (res) => {
                console.log(res);
            }
        ).setHeader({
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
        }).post({
            show: "searchkey",
            keyboard: search,
        });
    }, [search]);

    return <div className="p-2">搜索：{search}</div>;
}
