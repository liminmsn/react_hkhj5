import { Avatar, Button, Card, Description, FieldError, FieldGroup, Fieldset, Form, Input, Label, ListBox, Modal, Table, Tag, TagGroup, TextField, toast, Toast, type Key } from "@heroui/react";
import { net_model_user_forgotPassword, net_model_user_login, net_model_user_register, net_model_user_sendCaptcha } from "../../api/user/model/modelUser";
import { useEffect, useImperativeHandle, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { IdCard, LoaderIcon, Mail, PartyPopper, Rocket, Smartphone } from "lucide-react";
import { model_energy_flowingChat, model_energy_flowingWater, model_energy_ranking } from "../../api/user/model/modelEnergy";
import { useUserInfoFlowingWater, useUserInfoStore } from "../../store";
import { model_price_list } from "../../api/user/model/modelPrice";
import { ResponsiveBump } from '@nivo/bump'
import { isEmail } from "../../utils/verifys";
import HKComLoding from "../../components/HKComLoding";
import getFormData from "../../utils/getFormData";
import dayjs from "dayjs";

type SubmitParameter = React.FormEvent<HTMLFormElement>;
type LoginRegisterForgotRef = {
    onsubmit: (e: SubmitParameter) => void;
}
function Login({ ref }: { ref?: Ref<LoginRegisterForgotRef> }) {
    const { saveInfo } = useUserInfoStore();

    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: SubmitParameter) {
            const data = getFormData(e);
            net_model_user_login(data as any, (res) => {
                console.log(res);
                if (res.code == 200) {
                    toast(<Label>登录成功！</Label>)
                    saveInfo(res.data);
                } else {
                    toast(<div>{res.message}</div>, { variant: "danger" })
                }
            });
        }
    }));

    return <Fieldset className="gap-y-3">
        <Toast.Provider placement="top" />
        <Fieldset.Legend>能量系统</Fieldset.Legend>
        <Description>小小能量温暖的连接你我他</Description>
        <FieldGroup>
            <TextField
                className="mb-1"
                isRequired
                name="username"
                validate={(value) => {
                    if (value.length < 3) {
                        return "用户名不能小于3位";
                    }
                    return null;
                }}
            >
                <Label>用户名</Label>
                <Input placeholder="用户名长度在3-20个字符之间" />
                <FieldError />
            </TextField>
            <TextField className="mb-1" isRequired name="password" type="password">
                <Label>密码</Label>
                <Input placeholder="密码长度在6-20个字符之间" />
                <FieldError />
            </TextField>
        </FieldGroup>
        <Fieldset.Actions>
            <Button type="submit">
                用户登陆
            </Button>
            <Button type="reset" variant="secondary">
                清空
            </Button>
        </Fieldset.Actions>
    </Fieldset>
}

function Register({ ref }: { ref?: Ref<LoginRegisterForgotRef> }) {

    const [regSuccess, setRegSuccess] = useState(false);
    const [captchaId, setCaptchaId] = useState("");
    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: SubmitParameter) {
            const data = getFormData(e);
            if (captchaId != '') {
                data['captchaId'] = captchaId;
                net_model_user_register(data as any, (data) => {
                    toast(<Label>{data.message}</Label>)
                    setRegSuccess(data.code == 200)
                });
            }
        }
    }));

    // 邮箱验证码按钮
    const [email, setEmail] = useState("");
    const [emailCode, setemailCode] = useState(true);
    function onEmailChange({ target }: { target: HTMLInputElement }) {
        setEmail(target.value);
        setemailCode(!isEmail(target.value));
    }
    // 发送获取验证码
    function getVerify() {
        setemailCode(true);
        net_model_user_sendCaptcha({ email }, res => {
            setemailCode(false);
            toast(<Label>{res.message}</Label>);
            console.log(res)
            if (res.code == 200) {
                setCaptchaId(res.data.captchaID);
            }
        });
    }

    useEffect(() => { }, [regSuccess, email]);
    return <Fieldset className="gap-y-3">
        <Toast.Provider placement="top" />
        <Fieldset.Legend>能量系统注册用户</Fieldset.Legend>
        <Description>完善以下信息</Description>
        {
            regSuccess && <FieldGroup>
                <div className="flex flex-col justify-center items-center gap-3.5 pt-9">
                    <div className="bg-success p-2 rounded-[50rem] inline-block">
                        <PartyPopper className="text-white" size={20} />
                    </div>
                    <Label className="text-xl">太棒啦，用户注册成功！</Label>
                </div>
            </FieldGroup>
        }
        {
            !regSuccess &&
            <>
                <FieldGroup>
                    <TextField
                        className="mb-1"
                        isRequired
                        name="username"
                        validate={(value) => {
                            if (value.length < 3) {
                                return "用户名长度在3-20个字符之间";
                            }
                            return null;
                        }}
                    >
                        <Label>用户名</Label>
                        <Input placeholder="用户名（必填，3-20位）" />
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" isRequired name="password" type="password">
                        <Label>密码</Label>
                        <Input placeholder="密码长度在6-20个字符之间" />
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" isRequired name="confirmPassword" type="password">
                        <Label>确认密码</Label>
                        <Input placeholder="密码长度在6-20个字符之间" />
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" isRequired name="nickname" type="text">
                        <Label>昵称</Label>
                        <Input placeholder="昵称不能超过50个字符" />
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" name="phone" type="text">
                        <Label>手机号(可选)</Label>
                        <Input placeholder="手机号必须是11位数字" />
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" isRequired name="email" type="email">
                        <Label>邮箱</Label>
                        {captchaId}
                        <div className="flex">
                            <Input placeholder="abc@qq.com" className="flex-1 mr-1" onChange={onEmailChange} />
                            <Button isDisabled={emailCode} onClick={getVerify}>
                                <Mail />
                                发送验证码
                            </Button>
                        </div>
                        <FieldError />
                    </TextField>
                    <TextField className="mb-1" isRequired name="captcha" type="text">
                        <Label>验证码</Label>
                        <Input placeholder="6位数字组成" />
                        <FieldError />
                    </TextField>
                </FieldGroup>
                <Fieldset.Actions>
                    <Button type="submit">
                        <Rocket />
                        提交注册
                    </Button>
                </Fieldset.Actions>
            </>
        }
    </Fieldset >
}

function ForgotPassword({ ref }: { ref?: Ref<LoginRegisterForgotRef> }) {
    const [regSuccess, setRegSuccess] = useState(false);

    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: SubmitParameter) {
            const data = getFormData(e);
            const captchaId = localStorage.getItem('captchaId');
            if (captchaId) {
                data['captchaId'] = captchaId;
                net_model_user_forgotPassword(data as any, (res) => {
                    toast(<Label>{res.data}</Label>)
                    setRegSuccess(res.code == 200)
                });
            }
        }
    }));

    // 邮箱验证码按钮
    const [email, setEmail] = useState("");
    const [emailCode, setemailCode] = useState(true);
    function onEmailChange({ target }: { target: HTMLInputElement }) {
        setEmail(target.value);
        setemailCode(!isEmail(target.value));
    }
    // 发送获取验证码
    function getVerify() {
        setemailCode(true);
        net_model_user_sendCaptcha({ email }, res => {
            setemailCode(false);
            toast(<Label>{res.message}</Label>);
            if (res.code == 200) {
                localStorage.setItem('captchaId', res.data.captchaID);
            }
        });
    }

    useEffect(() => { }, [regSuccess])

    if (regSuccess) {
        return <FieldGroup>
            <div className="flex flex-col justify-center items-center gap-3.5 pt-9">
                <div className="bg-success p-2 rounded-[50rem] inline-block">
                    <PartyPopper className="text-white" size={20} />
                </div>
                <Label className="text-xl">太棒啦，密码修改成功！</Label>
            </div>
        </FieldGroup>
    }

    return <Fieldset className="gap-y-3">
        <Toast.Provider placement="top" />
        <Fieldset.Legend>能量系统</Fieldset.Legend>
        <Description>小小能量温暖的连接你我他</Description>
        <FieldGroup>
            <TextField className="mb-1" isRequired name="email" type="email">
                <Label>邮箱</Label>
                <div className="flex">
                    <Input placeholder="abc@qq.com" className="flex-1 mr-1" onChange={onEmailChange} />
                    <Button isDisabled={emailCode} onClick={getVerify}>
                        <Mail />
                        发送验证码
                    </Button>
                </div>
                <FieldError />
            </TextField>
            <TextField className="mb-1" isRequired name="captcha" type="text">
                <Label>验证码</Label>
                <Input placeholder="6位数字组成" />
                <FieldError />
            </TextField>
            <TextField className="mb-1" isRequired name="newPassword" type="password">
                <Label>密码</Label>
                <Input placeholder="密码长度在6-20个字符之间" />
                <FieldError />
            </TextField>
            <TextField className="mb-1" isRequired name="confirmPassword" type="password">
                <Label>确认密码</Label>
                <Input placeholder="密码长度在6-20个字符之间" />
                <FieldError />
            </TextField>
        </FieldGroup>
        <Fieldset.Actions>
            <Button type="submit">
                <Rocket />
                提交修改
            </Button>
        </Fieldset.Actions>
    </Fieldset>
}

function LoginRegisterLayout() {
    const loginRef = useRef<LoginRegisterForgotRef>(null);
    const registerRef = useRef<LoginRegisterForgotRef>(null);
    const forgotRef = useRef<LoginRegisterForgotRef>(null);
    const ComponentArr = [<Login ref={loginRef} />, <Register ref={registerRef} />, <ForgotPassword ref={forgotRef} />];

    const [idx, setIdx] = useState(0);

    return <div className="mx-auto w-2/6">
        <Form onSubmit={(e) => {
            const onSubmit = [loginRef, registerRef, forgotRef][idx].current?.onsubmit;
            if (onSubmit) {
                onSubmit(e);
            }
        }}>
            {ComponentArr[idx]}
        </Form>
        <div className="h-3"></div>
        {
            idx == 0 &&
            <div className="flex justify-between">
                <Label className="cursor-pointer" onClick={() => setIdx(1)}>注册用户</Label>
                <Label className="cursor-pointer" onClick={() => setIdx(2)}>忘记密码</Label>
            </div>
        }
        {
            idx == 1 &&
            <div>
                <Label className="cursor-pointer" onClick={() => setIdx(0)}>已有账户？去登陆</Label>
            </div>
        }
        {
            idx == 2 &&
            <div>
                <Label className="cursor-pointer" onClick={() => setIdx(0)}>去登陆</Label>
            </div>
        }
    </div>
}

function UserInfoTopUp() {
    const [select, setSelect] = useState<NetUser.Response.ModelPrice.ListItem>()
    const [list, setList] = useState<NetUser.Response.ModelPrice.ListList>();
    useEffect(() => {
        model_price_list((res) => {
            setList(res.data);
        })
    }, [])

    return <Modal>
        <Button size="sm" variant="primary">充值</Button>
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog className="w-8/12">
                    <Modal.CloseTrigger />
                    <Modal.Header className="flex-row items-center">
                        <Modal.Icon className="bg-default text-foreground">
                            <Rocket className="size-5" />
                        </Modal.Icon>
                        <Modal.Heading>能量充值</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {!list && <LoaderIcon />}
                        {list && <div className="grid grid-cols-3 gap-1.5">
                            {list.map(item => {
                                return <Card key={item.productCode}
                                    className={`gap-0 cursor-pointer active:scale-95 ${select == item ? "bg-accent" : ""}`}
                                    onClickCapture={() => setSelect(item)}>
                                    <Card.Header>
                                        <Label className={item == select ? "text-white" : "text-accent"}>{item.productName}</Label>
                                    </Card.Header>
                                    <Card.Content className="flex-row">
                                        <Label className="font-bold">{item.price}</Label>
                                        {
                                            item.price != item.originalPrice &&
                                            <span className="text-nowrap">/<del>原价{item.originalPrice}</del></span>
                                        }
                                        <Label>{item.currency}</Label>
                                    </Card.Content>
                                    <Card.Footer className="mt-1">
                                        <span className="scale-90">{item.description}</span>
                                    </Card.Footer>
                                </Card>
                            })}
                        </div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="w-full" slot="close">
                            继续
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal >
}

function UserInfoFlowingWaterCard() {
    const [list, setList] = useState<NetUser.Response.ModelEnergy.FlowingWater[]>();
    const { save } = useUserInfoFlowingWater();
    useEffect(() => {
        model_energy_flowingWater(1, 10, (res) => {
            if (res.code == 200) {
                save(res.data);
                setList(res.data);
            }
        })
    }, [save]);

    return <Card className="col-span-4 pr-1">
        <Card.Header className="p-0 pb-0">
            <Label>流水记录</Label>
        </Card.Header>
        <Card.Content className="overflow-y-auto">
            {!list ? <HKComLoding /> :
                <Table className="p-0">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Team members">
                            <Table.Header>
                                <Table.Column className="px-0">#</Table.Column>
                                <Table.Column >时间</Table.Column>
                                <Table.Column >支出/收入</Table.Column>
                                <Table.Column >变动前能量</Table.Column>
                                <Table.Column >能量</Table.Column>
                                <Table.Column >备注</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    list.map((item, idx) => {
                                        return <Table.Row key={item.id}>
                                            <Table.Cell className="pl-0">{idx + 1}</Table.Cell>
                                            <Table.Cell>{dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm:ss')}</Table.Cell>
                                            {
                                                item.changeType == 1 ?
                                                    <Table.Cell className="text-success">+{item.balanceAfter - item.balanceBefore}</Table.Cell> :
                                                    <Table.Cell className="text-danger">{item.balanceAfter - item.balanceBefore}</Table.Cell>
                                            }
                                            <Table.Cell>{item.balanceBefore}</Table.Cell>
                                            <Table.Cell>{item.balanceAfter}</Table.Cell>
                                            <Table.Cell>{item.description}</Table.Cell>
                                        </Table.Row>
                                    })
                                }
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            }
        </Card.Content>
    </Card>
}

function UserInfoRankingCard() {
    const [list, setList] = useState<NetUser.Response.ModelEnergy.Ranking[]>();
    useEffect(() => {
        model_energy_ranking(10, (res) => {
            if (res.code == 200) {
                setTimeout(() => {
                    setList(res.data);
                }, 500);
            }
        })
    }, []);

    return <Card className="col-span-2">
        <Card.Header className="pb-0">
            <Card.Title>排行榜</Card.Title>
        </Card.Header>
        <Card.Content>
            {!list ? <HKComLoding /> :
                <ListBox aria-label="用户" selectionMode="none" className="px-0">
                    {
                        list.map((item, idx) => {
                            return <ListBox.Item key={idx} id={item.userId} textValue={item.username}>
                                <div className="bg-accent/20 rounded-md h-8 w-8 text-center">
                                    <Label className="text-xl">{idx + 1}</Label>
                                </div>
                                <Avatar size="sm">
                                    <Avatar.Image
                                        alt="Bob"
                                        src={`/api/api${item.avatar}`}
                                    />
                                    <Avatar.Fallback>{item.username}</Avatar.Fallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <Label>{item.nickname}</Label>
                                    <Description>能量{item.energy}</Description>
                                </div>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        })
                    }
                </ListBox>
            }
        </Card.Content>
    </Card>
}

function ChatView({ list }: { list?: NetUser.Response.ModelEnergy.FlowingWater[], children?: ReactNode }) {
    const energy = useMemo(() => {
        if (!list) return [];
        return list.map(item => ({
            x: dayjs(item.createTime).format("YYYY年MM月DD日 HH:mm:ss"),
            y: Number(item.amount)
        }));
    }, [list]);

    if (list && list.length > 0) {
        return (
            <div className="h-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
                <div className="h-full" style={{ minWidth: Math.max(energy.length * 150, 600) }}>
                    <ResponsiveBump
                        data={[
                            { id: "收/支", data: energy }
                        ]}
                        colors={['var(--accent)']}
                        activeLineWidth={6}
                        lineWidth={3}
                        inactiveLineWidth={3}
                        inactiveOpacity={0.5}
                        inactivePointSize={0}
                        pointSize={10}
                        activePointSize={20}
                        activePointBorderWidth={3}
                        pointColor={{ theme: 'background' }}
                        pointBorderColor={{ from: 'serie.color' }}
                        pointBorderWidth={3}
                        axisTop={null}
                        axisLeft={{ legend: '能量收支曲线', legendOffset: -40 }}
                        margin={{ top: 10, right: 60, bottom: 40, left: 60 }}
                    />
                </div>
            </div>
        );
    }

    return <div className="p-3">
        <Label>暂无查询到数据!</Label>
    </div>
}

function UserInfoChat() {
    function getParameter(key: 'three' | 'seven' | 'year') {
        const now = dayjs();
        const times = {
            three: [
                now.subtract(3, 'day').format("YYYY-MM-DD HH:mm:ss"),
                now.format("YYYY-MM-DD HH:mm:ss")
            ],
            seven: [
                now.subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
                now.format("YYYY-MM-DD HH:mm:ss")
            ],
            year: [
                now.subtract(1, 'year').format("YYYY-MM-DD HH:mm:ss"),
                now.format("YYYY-MM-DD HH:mm:ss")
            ]
        };


        return {
            startTime: times[key][0],
            endTime: times[key][1],
            offset: 1,
            size: 100
        };
    }

    const [list, setList] = useState<NetUser.Response.ModelEnergy.FlowingWater[]>();
    const [selected, setSelected] = useState<Iterable<Key>>(new Set(["year"]));
    useEffect(() => {
        const key = Array.from(selected)[0] as any;
        if (key) {
            const param = getParameter(key);
            model_energy_flowingChat(param, (res) => {
                if (res.code == 200) {
                    setList(res.data);
                    console.log(res.data);
                }
            });
        }
    }, [selected]);

    return <Card className="p-0 gap-y-0 col-span-6">
        <Card.Header className="p-3 pb-0 flex-row overflow-hidden">
            <Card.Title>流水趋势</Card.Title>
            <TagGroup className="ml-3" aria-label="Tags" selectionMode="single"
                defaultSelectedKeys={selected}
                onSelectionChange={setSelected}>
                <TagGroup.List>
                    <Tag id="three">近三天</Tag>
                    <Tag id="seven">近七周</Tag>
                    <Tag id="year">近一年</Tag>
                </TagGroup.List>
            </TagGroup>
        </Card.Header>
        <Card.Content>
            {!list ? <HKComLoding /> : <ChatView list={list} />}
        </Card.Content>
    </Card>
}

function UserInfo() {
    const { info, outLogin } = useUserInfoStore();

    return <div className="w-full h-screen p-3 pb-16 flex gap-1.5">
        <div className="h-full flex flex-col gap-y-1.5 w-1/3">
            <Card className="inline-block">
                <div className="flex gap-x-1.5">
                    <img
                        className="w-24 h-24 pointer-events-none aspect-square rounded-2xl object-cover select-none"
                        loading="lazy"
                        src={`/api/api${info?.avatar}`}
                    />
                    <div className="flex flex-col">
                        <Card.Title className="select-all">
                            {info?.nickname}
                        </Card.Title>
                        <Card.Title className="flex items-center gap-x-1">
                            <IdCard size={20} />
                            <Label className="select-all">{info?.username}</Label>
                        </Card.Title>
                        <Card.Title className="flex items-center gap-x-1">
                            <Mail size={20} />
                            <Label className="select-all">{info?.email}</Label>
                        </Card.Title>
                        <Card.Title className="flex items-center gap-x-1">
                            <Smartphone size={20} />
                            <Label className="select-all">{info?.phone || "-"}</Label>
                        </Card.Title>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex justify-between items-center">
                    <Label>我的能量：{info?.energy}</Label>
                    <UserInfoTopUp />
                </div>
                <div>
                    <Label>我的邀请码：</Label>
                    <Label className="select-all">jiofw</Label>
                </div>
            </Card>
            <Button className="w-full" variant="danger" onClick={outLogin}>退出登录</Button>
        </div>
        <div className="w-full grid grid-cols-6 grid-rows-2 gap-1.5">
            <UserInfoRankingCard />
            <UserInfoFlowingWaterCard />
            <UserInfoChat />
        </div>
    </div>
}
export default function () {
    const { info } = useUserInfoStore();
    if (!info) {
        return <LoginRegisterLayout />
    }

    return <UserInfo />
}