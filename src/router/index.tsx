import { createHashRouter } from "react-router";
import Layout from "../Layout";
import Detial from "../view/Detial";
import Player from "../view/Player";

export default createHashRouter([
    {
        path: "/",
        Component: Layout,
    },
    {
        path: "detail",
        Component: Detial
    },
    {
        path: "player",
        Component: Player
    }
]);