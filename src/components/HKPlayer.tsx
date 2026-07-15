import type { SourceInfo, Options } from "plyr";
import { type APITypes, usePlyr } from "plyr-react"
import React, { type Ref } from "react"
export type PlyrPropsType = {
    source: SourceInfo;
    options: Options
};

export default React.forwardRef((props: PlyrPropsType, ref: Ref<APITypes>) => {
    const { source, options = null, ...rest } = props
    const raptorRef = usePlyr(ref, {
        source,
        options,
    })
    return <video ref={raptorRef} className="plyr-react plyr" {...rest} />
})