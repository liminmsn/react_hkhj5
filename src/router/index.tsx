import { createHashRouter } from "react-router";
import Layout from "../Layout";
import Detial from "../view/Detial";
import Player from "../view/Player";
import Search from "../view/Search";

export default createHashRouter([
    {
        path: "/",
        Component: Layout,
    },
    {
        path: "search",
        Component: Search,
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