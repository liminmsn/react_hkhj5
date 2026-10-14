import { createHashRouter } from "react-router";
import Layout from "../Layout";
import Detial from "../view/Detial";
import Player from "../view/Player";
import Search from "../view/Search";
import Spay from "../view/Spay";

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
    },
    {
        path: "spay",
        Component: Spay
    }
]);