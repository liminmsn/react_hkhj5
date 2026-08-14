import { useEffect } from "react"
import TDTMap from "../../map";

const tdt_map = new TDTMap();
export default function () {

    useEffect(() => {
        tdt_map.init("mapDiv", 12);

        return function () {
            tdt_map.destory();
        };
    }, [])
    return <div>
        <div id="mapDiv" style={{
            position: "absolute",
            height: "100vh",
            width: "100vw"
        }}></div>
    </div>
}