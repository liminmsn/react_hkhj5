import { Label, Tabs } from '@heroui/react';
import HkHome from './view/page/HkHome';
import { useCateGoryStore, useLayoutStore } from './store';
import HKCategory from './view/page/HKCategory';
import { useState } from 'react';
import HKWatchList from './view/page/HKWatchList';
import HKUser from './view/page/HKUser';
import HKMap from './view/page/HKMap';
import { Blocks, CircleUserRound, FolderHeart, House, Map } from 'lucide-react';
export default function () {
    const selectedKey = useLayoutStore().selectedKey;
    const setSelectedKey = useLayoutStore().setSelectedKey;
    const { setUrl } = useCateGoryStore();
    const [scrollTop, setScrollTop] = useState(0);

    const tabs = [
        {
            title: 
            <>
                <House />
                {/* 首页 */}
            </>,
            id: 'HkHome',
            component: HkHome
        },
        {
            title: <>
                <Blocks />
                {/* 分类 */}
            </>,
            id: 'HKCategory',
            component: HKCategory
        },
        {
            title: <>
                <FolderHeart />
                {/* 追剧列表 */}
            </>,
            id: 'HKWatchList',
            component: HKWatchList
        },
        {
            title: <>
                <Map />
                {/* 地图 */}
            </>,
            id: 'HKMap',
            component: HKMap
        },
        {
            title: <>
                <CircleUserRound />
                {/* 我的 */}
            </>,
            id: 'HKUser',
            component: HKUser
        },
    ]

    return <Tabs className="h-screen shadow-md" selectedKey={selectedKey}
        onSelectionChange={(key) => {
            if (key == 'HKCategory') {
                setUrl("/list/1---.html");
            }
            setSelectedKey(key);
        }}>
        <Tabs.ListContainer className='fixed left-0 right-0 bottom-4 z-500'>
            <div className={`w-75 mx-auto`}>
                <Tabs.List aria-label="Options" className={`backdrop-blur-md bg-foreground/20 transition-all transition-delay-300 ${scrollTop > 300 ? 'translate-y-20 scale-0 pointer-events-none' : ''}`}>
                    {
                        tabs.map(item => {
                            return <Tabs.Tab id={item.id} key={item.id}>
                                <Label className='cursor-pointer text-segment flex items-center gap-0.5'>{item.title}</Label>
                                <Tabs.Indicator className='bg-accent' />
                            </Tabs.Tab>
                        })
                    }
                </Tabs.List>
            </div>
        </Tabs.ListContainer>
        {
            tabs.map(item => {
                return <Tabs.Panel className="h-full overflow-y-auto p-0" id={item.id} key={item.id} onScrollCapture={(e) => {
                    const { scrollTop } = e.target as HTMLDivElement;
                    setScrollTop(scrollTop);
                }}>
                    <item.component />
                </Tabs.Panel>
            })
        }
    </Tabs>
}