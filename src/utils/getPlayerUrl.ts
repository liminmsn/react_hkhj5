import Analysis from "../api/Analysis";
import analysis_play from "../api/analysis/analysis_play";

export default function (url: string, call: (url: string) => void) {
    // console.log(import.meta.env['VITE_URL'] + url);
    new Analysis(crypto.randomUUID(), import.meta.env['VITE_URL'] + url, analysis_play, (url) => call(url)).get()
}