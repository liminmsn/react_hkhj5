import { Label, Tabs } from '@heroui/react';
import HkHome from './view/page/HkHome';
import { useCateGoryStore, useLayoutStore } from './store';
import HKCategory from './view/page/HKCategory';
import { useState } from 'react';
import HKWatchList from './view/page/HKWatchList';
export default function () {
    const selectedKey = useLayoutStore().selectedKey;
    const setSelectedKey = useLayoutStore().setSelectedKey;
    const { setUrl } = useCateGoryStore();
    const [scrollTop, setScrollTop] = useState(0);

    const tabs = [
        {
            title: '首页',
            id: 'HkHome',
            component: HkHome
        },
        {
            title: '分类',
            id: 'HKCategory',
            component: HKCategory
        },
        {
            title: '追剧列表',
            id: 'HKWatchList',
            component: HKWatchList
        },
        {
            title: '我的',
            id: 'User',
            component: function () {
                return <div>hello world</div>
            }
        },
    ]

    return <Tabs className="h-screen shadow-md" selectedKey={selectedKey}
        onSelectionChange={(key) => {
            if (key == 'HKCategory') {
                setUrl("/list/1---.html");
            }
            setSelectedKey(key);
        }}>
        <Tabs.ListContainer className='fixed left-0 right-0 bottom-4 z-10'>
            <div className={`w-2/6 mx-auto`}>
                <Tabs.List aria-label="Options" className={`backdrop-blur-md bg-foreground/20 transition-all transition-delay-300 ${scrollTop > 300 ? 'translate-y-20 scale-0 pointer-events-none' : ''}`}>
                    {
                        tabs.map(item => {
                            return <Tabs.Tab id={item.id} key={item.id}>
                                <Label className='cursor-pointer text-segment'>{item.title}</Label>
                                <Tabs.Indicator className='bg-accent' />
                            </Tabs.Tab>
                        })
                    }
                </Tabs.List>
            </div>
        </Tabs.ListContainer>
        {
            tabs.map(item => {
                return <Tabs.Panel className="h-full overflow-y-auto" id={item.id} key={item.id} onScrollCapture={(e) => {
                    const { scrollTop } = e.target as HTMLDivElement;
                    setScrollTop(scrollTop);
                }}>
                    <item.component />
                </Tabs.Panel>
            })
        }
    </Tabs>
}