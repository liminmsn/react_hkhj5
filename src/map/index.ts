import type { Map } from "tianditu-v4-types";

export default class TDTMap {
    private map: Map | null = null;
    init(id: string, zoom: number) {
        if (this.map == null) {
            this.map = new window.T.Map(id,
                {
                    zoom: zoom,
                    minZoom: 8,
                    maxBounds: new window.T.LngLatBounds(
                        new window.T.LngLat(73.4, 18.1),   // 西南 左下
                        new window.T.LngLat(135.1, 53.6)
                    )
                }
            );
            const a = new window.T.Geolocation();
            console.log(a);
            a.getCurrentPosition((res) => {
                console.log(res);
                
            })

            // a.getCurrentPosition((res) => {
            //     console.log(res);

            // }, { enableHighAccuracy: true, timeout: 10000 })
            this.map.centerAndZoom(new window.T.LngLat(116.40769, 39.89945), zoom);
        }
    }
    destory() {
        this.map = null;
    }
}