import { create } from "zustand";
import type { AnalysisHomeObjItemType } from "../api/analysis/analysis_home";
import type { AnalysisDetailObjType } from "../api/analysis/analysis_detail";
import type { AnalysisCateGoryObjItemType } from "../api/analysis/analysis_category";
import type { Key } from "@heroui/react";

interface LayoutStoreType {
    selectedKey: string | undefined;
    setSelectedKey: (key: any) => void
}

interface HkHomeStoreType {
    list: AnalysisHomeObjItemType[] | null;
    update: (list: AnalysisHomeObjItemType[] | null) => void;
}

export type HKSearchTagsStoreTypeTag = { tag: string, url: string };
interface HKSearchTagsStoreType {
    tags: HKSearchTagsStoreTypeTag[];
    setTags: (data: HKSearchTagsStoreTypeTag[]) => void;
}

interface DetailStoreType {
    detail: AnalysisDetailObjType | null
    setDetail: (data: AnalysisDetailObjType | null) => void;
}

interface CateGoryStoreType {
    data: AnalysisCateGoryObjItemType | null;
    setData: (data: AnalysisCateGoryObjItemType | null) => void;
    url: string;
    setUrl: (url: string) => void;
}

interface PlayListStoreType {
    play_select_ctegory: Key;
    play_select_item: number;
    select: (play_select_ctegory?: Key, play_select_item?: number) => void;
}

type WatchItem = Pick<AnalysisDetailObjType, "head" | "main">;
interface WatchListStoreType {
    list: WatchItem[];
    add_remove: (item: WatchItem) => void;
    clear: () => void;
}

export const useLayoutStore = create<LayoutStoreType>((set) => ({
    selectedKey: "HkHome",
    setSelectedKey: (key) => {
        set({ selectedKey: key })
    }
}));

export const useHkHomeStore = create<HkHomeStoreType>((set) => ({
    list: null,
    update: (list) => {
        set({ list: null })
        set({ list })
    },
}));

export const useHKSearchTagsStore = create<HKSearchTagsStoreType>((set) => ({
    tags: [],
    setTags: (data) => {
        set({ tags: data })
    }
}));

export const useDetailStore = create<DetailStoreType>((set) => ({
    detail: null,
    setDetail: (detail) => {
        set({ detail })
    }
}));

export const useCateGoryStore = create<CateGoryStoreType>((set) => ({
    data: null,
    setData: (data) => {
        set({ data })
    },
    url: `/list/1---.html`,
    setUrl: (url) => {
        set({ url })
    }
}));

export const usePlayListStore = create<PlayListStoreType>((set) => ({
    play_select_ctegory: 0,
    play_select_item: -1,
    select: (play_select_ctegory = 0, play_select_item = -1) => {
        set({
            play_select_ctegory,
            play_select_item
        })
    }
}));

// 追剧列表
export const useWatchListStore = create<WatchListStoreType>((set => ({
    list: JSON.parse(localStorage.getItem('watch_list')!) || [],
    add_remove(item) {
        let list_data = [];
        set(data => {
            if (data.list.filter(item_ => item_.head.imgUrl === item.head.imgUrl).length > 0) {
                list_data = data.list.filter(i => i.head.imgUrl !== item.head.imgUrl)
                return { list: list_data }
            }
            list_data = [...data.list, item];
            localStorage.setItem('watch_list', JSON.stringify(list_data));
            return { list: list_data }
        })
    },
    clear() {
        set({ list: [] })
    },
})));