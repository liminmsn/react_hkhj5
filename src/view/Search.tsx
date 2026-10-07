import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Analysis from "../api/Analysis";
import analysis_search, { search_data } from "../api/analysis/analysis_search";
import { Button, Label, Table } from "@heroui/react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const { search } = location.state as { search: string };
    const [data, setData] = useState<typeof search_data>(() => {
        const data_local = localStorage.getItem(search);
        if (data_local)
            return JSON.parse(data_local)
        return search_data
    });

    useEffect(() => {
        if (!localStorage.getItem(search)) {
            new Analysis(crypto.randomUUID(), `${import.meta.env["VITE_URL"]}/search/`, analysis_search, res => {
                if (res) {
                    setData(res)
                    // localStorage.setItem(search, JSON.stringify(res))
                }
            })
                .setHeader({ "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" })
                .setHeader({ "User-Agent": "Mozilla/5.0 (Android)" })
                .post({
                    show: "searchkey",
                    keyboard: search,
                });
        }
    }, [search]);

    function openDetail(url: string) {
        navigate("/detail", {
            state: {
                url: url
            },
        })
    }
    return <div className="py-2 p-3 pt-13">
        <div className="mb-1 flex justify-between w-full">
            <Label className="text-xl">{search}：搜索结果</Label>
            <Button className="px-3 " variant="danger" onClick={() => navigate(-1)}>返回</Button>
        </div>
        {data.code === -1 &&
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.msg}
            </ReactMarkdown>
        }
        {data.code == 1 &&
            <div className="bg-background rounded-xl">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="搜索结果">
                            <Table.Header>
                                <Table.Column isRowHeader>#</Table.Column>
                                <Table.Column>片名</Table.Column>
                                <Table.Column>类型</Table.Column>
                                <Table.Column>演员表</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {data.body.map((item, idx) => {
                                    return <Table.Row key={item.url} className="cursor-pointer" onClickCapture={() => { openDetail(item.url) }}>
                                        <Table.Cell className="text-danger">{idx + 1}</Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.time}</Table.Cell>
                                        <Table.Cell>{item.actor}</Table.Cell>
                                    </Table.Row>
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </div>
        }
    </div >
}
