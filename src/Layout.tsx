import { Label, Tabs } from '@heroui/react';
import HkHome from './view/page/HkHome';
import { useCateGoryStore, useLayoutStore } from './store';
import HKCategory from './view/page/HKCategory';
export default function () {
    const selectedKey = useLayoutStore().selectedKey;
    const setSelectedKey = useLayoutStore().setSelectedKey;

    const { setUrl } = useCateGoryStore();

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
            title: '追剧',
            id: 'a',
            component: function () {
                return <div>hello world</div>
            }
        },
        {
            title: '我的',
            id: 'User',
            component: function () {
                return <div>hello world</div>
            }
        },
    ]

    return <Tabs className="h-screen shadow-md" selectedKey={selectedKey} onSelectionChange={(key) => {
        if (key == 'HKCategory') {
            setUrl("/love/1.html");
        }
        setSelectedKey(key);
    }}>
        <Tabs.ListContainer className='fixed left-0 right-0 bottom-4 z-10'>
            <div className='w-2/6 mx-auto'>
                <Tabs.List aria-label="Options" className='backdrop-blur-xs bg-foreground/20'>
                    {
                        tabs.map(item => {
                            return <Tabs.Tab id={item.id} key={item.id}>
                                <Label className='cursor-pointer'>{item.title}</Label>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        })
                    }
                </Tabs.List>
            </div>
        </Tabs.ListContainer>
        {
            tabs.map(item => {
                return <Tabs.Panel className="h-full overflow-y-auto" id={item.id} key={item.id}>
                    <item.component />
                </Tabs.Panel>
            })
        }
    </Tabs>
}