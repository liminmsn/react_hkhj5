import { AlertDialog, Button, Label, Switch } from "@heroui/react";
import HKCard from "../../components/HKCard";
import { useWatchListStore } from "../../store"
import { Trash } from "lucide-react";
import { useState } from "react";
import HKEmpty from "../../components/HKEmpty";

export default function () {
    const { list, add_remove } = useWatchListStore();
    const [edit, setEdit] = useState(false);

    if (list.length === 0) {
        return <HKEmpty />
    }
    return <div className="px-3">
        <Switch className="flex-row-reverse" onChange={(isSelectd) => setEdit(isSelectd)}>
            <Switch.Content>
                <Label>编辑</Label>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch.Content>
        </Switch>
        <div className="grid grid-cols-6 gap-x-2">
            {
                list.map((item) => {
                    return <div key={item.url}>
                        {
                            edit &&
                            <div className="mb-1 text-center">
                                <AlertDialog>
                                    <Button variant="danger" size="sm"><Trash />移除</Button>
                                    <AlertDialog.Backdrop>
                                        <AlertDialog.Container>
                                            <AlertDialog.Dialog>
                                                <AlertDialog.CloseTrigger />
                                                <AlertDialog.Header>
                                                    <AlertDialog.Icon status="danger" />
                                                    <AlertDialog.Heading>{`要移除追剧吗？`}</AlertDialog.Heading>
                                                </AlertDialog.Header>
                                                <AlertDialog.Body>
                                                    <Label>
                                                        此操作将从<strong>追剧列表</strong>移除{`:${item.head.title}`}
                                                    </Label>
                                                </AlertDialog.Body>
                                                <AlertDialog.Footer>
                                                    <Button slot="close" variant="tertiary">
                                                        取消
                                                    </Button>
                                                    <Button slot="close" variant="danger" onClick={() => add_remove(item)}>
                                                        确认
                                                    </Button>
                                                </AlertDialog.Footer>
                                            </AlertDialog.Dialog>
                                        </AlertDialog.Container>
                                    </AlertDialog.Backdrop>
                                </AlertDialog>
                            </div>
                        }
                        <HKCard item={{ date: '追剧列表', name: item.head.title, url: item.url, ...item.head }} />
                    </div>
                })
            }
        </div>
    </div>
}