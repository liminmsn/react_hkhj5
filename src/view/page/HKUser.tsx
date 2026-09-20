import { Avatar, Button, Card, Description, FieldError, FieldGroup, Fieldset, Form, Input, Label, ListBox, Modal, Table, Tabs, Tag, TagGroup, TextField, toast, Toast, type Key } from "@heroui/react";
import { net_model_user_forgotPassword, net_model_user_info, net_model_user_login, net_model_user_register, net_model_user_sendCaptcha } from "../../api/user/model/modelUser";
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
import { model_spay_init_pay } from "../../api/user/model/modelSpay";
import { model_invite_activate } from "../../api/user/model/modelActivate";

type SubmitParameter = React.FormEvent<HTMLFormElement>;
type LoginRegisterForgotRef = {
    onsubmit: (e: SubmitParameter) => void;
}
//登录
function Login({ ref }: { ref?: Ref<LoginRegisterForgotRef> }) {
    const { saveInfo, saveLoginState, login_state } = useUserInfoStore();

    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: SubmitParameter) {
            const data = getFormData(e);
            net_model_user_login(data as any, (res) => {
                console.log(res);
                if (res.code == 200) {
                    saveInfo(res.data);
                    saveLoginState(1);
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
        {
            login_state == -1 &&
            <div className='bg-danger text-center py-1'>
                <Label className='text-white'>登录状态过期重新登录</Label>
            </div>
        }
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
//注册用户
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
//修改密码
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


    const [type, setPayType] = useState<"alipay" | "wxpay">("alipay")
    const [spay, setSpay] = useState<NetUser.Response.ModelPrice.SpayResponse>()
    function init_pay() {
        if (select) {
            model_spay_init_pay({
                productName: select.productName,
                price: select.price.toFixed(2),
                type: type
            }, (res) => {
                if (res.code == 200) {
                    setSpay(res.data);
                } else {
                    toast(res.message, { variant: "danger" })
                }
                console.log(res);
            });
        }
    }

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
                        {(list) &&
                            <div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {list.map((item, idx) => {
                                        return <Card key={item.productCode}
                                            className={`gap-0 cursor-pointer ${select == item ? "bg-accent" : ""}`}
                                            onClickCapture={() => setSelect(item)}>
                                            <Card.Header className="text-center">
                                                {
                                                    idx < 3 && idx > 0 &&
                                                    <div className="bg-red-500 text-white rounded-sm mb-1">推荐</div>
                                                }
                                                <Label className={item == select ? "text-white" : "text-accent"}>{item.productName}</Label>
                                            </Card.Header>
                                            <Card.Content className="flex-row my-1 justify-center">
                                                <Label className="text-red-500 font-bold text-xl">{item.price}</Label>
                                                {
                                                    item.price != item.originalPrice &&
                                                    <span className="text-nowrap">/<del>原价{item.originalPrice}</del></span>
                                                }
                                                <Label>{item.currency}</Label>
                                            </Card.Content>
                                            <Card.Footer className="mt-1">
                                                <span className={item == select ? "text-white" : "scale-90"}>{item.description}</span>
                                            </Card.Footer>
                                        </Card>
                                    })}
                                </div>
                                <Tabs className="pt-5" defaultSelectedKey={type} onSelectionChange={(key) => setPayType(key as any)}>
                                    <Tabs.ListContainer>
                                        <Tabs.List aria-label="选项">
                                            <Tabs.Tab id="alipay">
                                                支付宝
                                                <img className="ml-1" width={20} src={`/asset/zfb.png`} />
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                            <Tabs.Tab id="wxpay">
                                                微信
                                                <img className="ml-1" width={20} src={`/asset/wx.svg`} />
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                        </Tabs.List>
                                    </Tabs.ListContainer>
                                </Tabs>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer className="mt-1.5">
                        <Modal>
                            <Button className="w-full" onClick={init_pay}>继续</Button>
                            <Modal.Backdrop>
                                <Modal.Container>
                                    <Modal.Dialog className="w-8/12">
                                        <Modal.CloseTrigger />
                                        <Modal.Header className="flex-row items-center">
                                            {/* <Modal.Icon className="bg-default text-foreground">
                                                <CircleDollarSign className="size-5" />
                                            </Modal.Icon> */}
                                            <img width={40} src={`/asset/${type == "alipay" ? "zfb.png" : "wx.svg"}`} />
                                            <Modal.Heading><div className="font-bold">{type == "alipay" ? "支付宝" : "微信"}</div>扫码支付</Modal.Heading>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {
                                                select ?
                                                    !spay ? <HKComLoding /> :
                                                        <div className="flex gap-3.5">
                                                            <img src={spay.img} className="w-30 border-2 border-accent rounded-sm" />
                                                            <div className="flex flex-col gap-y-1.5">
                                                                <Label>订单创建状态：{spay.msg}</Label>
                                                                <Label>订单编号：{spay.trade_no}</Label>
                                                                <Label className="text-black/20">已经支付完成？</Label>
                                                                <Button variant="primary">查询支付状态</Button>
                                                            </div>
                                                        </div> :
                                                    <div>
                                                        <Label>至少择一个能量套餐选项</Label>
                                                    </div>
                                            }
                                        </Modal.Body>
                                    </Modal.Dialog>
                                </Modal.Container>
                            </Modal.Backdrop>
                        </Modal >
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
        model_energy_flowingWater(0, 30, (res) => {
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
                    {
                        list.length > 0 ?
                            <Table.ScrollContainer>
                                <Table.Content aria-label="Team members">
                                    <Table.Header>
                                        <Table.Column isRowHeader className="px-0">#</Table.Column>
                                        <Table.Column >时间</Table.Column>
                                        <Table.Column >支出/收入</Table.Column>
                                        <Table.Column >变动前</Table.Column>
                                        <Table.Column >能量</Table.Column>
                                        <Table.Column >备注</Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {
                                            list.map((item, idx) => {
                                                return <Table.Row key={item.id}>
                                                    <Table.Cell className="pl-0">{idx + 1}</Table.Cell>
                                                    <Table.Cell className="text-nowrap">{dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm:ss')}</Table.Cell>
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
                            </Table.ScrollContainer> :
                            <div>
                                <Label>暂时没有流水记录噢！</Label>
                            </div>
                    }
                </Table>
            }
        </Card.Content>
    </Card>
}

function UserInfoRankingCard() {
    const [list, setList] = useState<NetUser.Response.ModelEnergy.Ranking[]>();
    useEffect(() => {
        model_energy_ranking(20, (res) => {
            if (res.code == 200) {
                setList(res.data);
            }
        })
    }, []);

    return <Card className="col-span-2">
        <Card.Header className="pb-0">
            <Card.Title>排行榜</Card.Title>
        </Card.Header>
        <Card.Content className="overflow-y-auto">
            {!list ? <HKComLoding /> :
                <ListBox aria-label="用户" selectionMode="none" className="px-0">
                    {
                        list.length > 0 ?
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
                            }) :
                            <ListBox.Item>
                                <Label>暂无查询到数据!</Label>
                            </ListBox.Item>
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
            offset: 0,
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
                    // console.log(res.data);
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

//使用邀请码
function UserInvite() {
    async function subMit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formdata = new FormData(e.target as HTMLFormElement);
        const invite_code = formdata.get("invite_code") as string;
        model_invite_activate(invite_code, (res) => {
            toast(res.message, { timeout: 1000, variant: `${res.code == 200 ? "success" : "danger"}` });
        });
    }

    return <Card>
        <Modal>
            <Button className="w-full">使用朋友的邀请码</Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="w-8/12">
                        <Toast.Provider placement="top" />
                        <Form onSubmit={subMit}>
                            <Modal.CloseTrigger />
                            <Modal.Header className="flex-row items-center">
                                <Modal.Icon className="bg-default text-foreground">
                                    <Rocket className="size-5" />
                                </Modal.Icon>
                                <Label>使用朋友的邀请码</Label>
                            </Modal.Header>
                            <Modal.Body>
                                <Input name="invite_code" className="w-full" placeholder="邀请码" required />
                                <div className="h-2.5"></div>
                            </Modal.Body>
                            <Modal.Footer className="mt-1.5">
                                <Button type="submit">使用</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal >
    </Card>
}

function UserInfo() {
    const { info, outLogin, saveInfo } = useUserInfoStore();

    useEffect(() => {
        net_model_user_info((res) => {
            if (res.code == 200) {
                saveInfo({ ...res.data, token: info!.token })
            }
        });
    }, [])

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
                <div className="flex justify-between items-end">
                    <Label>我的能量：{info?.energy}</Label>
                    <UserInfoTopUp />
                </div>
                <div>
                    <Label>我的邀请码：</Label>
                    <Label className="select-all">{info?.invitationCode}</Label>
                    <div>
                        <Description>
                            邀请好友加入好看韩剧5，使用此邀请码你即可得300能量，每一个被邀请人只能使用1次。
                        </Description>
                    </div>
                </div>
            </Card>
            <UserInvite />
            <Button className="w-full" variant="danger-soft" onClick={outLogin}>退出登录</Button>
            {/* <Card>
            </Card> */}
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