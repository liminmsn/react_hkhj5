import { Avatar, Button, Card, Description, FieldError, FieldGroup, Fieldset, Form, Input, Label, ListBox, TextField, toast, Toast } from "@heroui/react";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { net_model_user_forgotPassword, net_model_user_login, net_model_user_register, net_model_user_sendCaptcha } from "../../api/user/model/modelUser";
import getFormData from "../../utils/getFormData";
import { useUserInfoStore } from "../../store";
import { IdCard, Mail, PartyPopper, Phone, Rocket, Smartphone } from "lucide-react";
import { isEmail } from "../../utils/verifys";

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
            if (res.code == 200) {
                setCaptchaId(res.data.captchaId);
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
                localStorage.setItem('captchaId', res.data.captchaId);
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


function UserInfo() {
    const { info } = useUserInfoStore();

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
                    <Label>能量：9999{info?.energy}</Label>
                    <Button size="sm" variant="primary">充值</Button>
                </div>
                <div>
                    <Label>我的邀请码：</Label>
                    <Label className="select-all">jiofw</Label>
                </div>
            </Card>
            <Button className="w-full" variant="danger">退出登录</Button>
        </div>
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-1.5">
            <Card className="p-0 gap-y-0">
                <Card.Header className="p-3 pb-0">
                    <Card.Title>能量流水明细</Card.Title>
                </Card.Header>
                <Card.Content className="overflow-y-auto">
                    <ListBox aria-label="用户" selectionMode="single" className="px-0">
                        <ListBox.Item id="1" textValue="Bob">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Bob"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                />
                                <Avatar.Fallback>B</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Bob</Label>
                                <Description>bob@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="2" textValue="Fred">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Fred"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
                                />
                                <Avatar.Fallback>F</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Fred</Label>
                                <Description>fred@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="3" textValue="Martha">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Martha"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
                                />
                                <Avatar.Fallback>M</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Martha</Label>
                                <Description>martha@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    </ListBox>
                </Card.Content>
            </Card>
            <Card className="p-0 gap-y-0">
                <Card.Header className="p-3 pb-0">
                    <Card.Title>能量榜</Card.Title>
                </Card.Header>
                <Card.Content className="overflow-y-auto">
                    <ListBox aria-label="用户" selectionMode="single" className="px-0">
                        <ListBox.Item id="1" textValue="Bob">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Bob"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                />
                                <Avatar.Fallback>B</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Bob</Label>
                                <Description>bob@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="2" textValue="Fred">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Fred"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
                                />
                                <Avatar.Fallback>F</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Fred</Label>
                                <Description>fred@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="3" textValue="Martha">
                            <Avatar size="sm">
                                <Avatar.Image
                                    alt="Martha"
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
                                />
                                <Avatar.Fallback>M</Avatar.Fallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Label>Martha</Label>
                                <Description>martha@heroui.com</Description>
                            </div>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    </ListBox>
                </Card.Content>
            </Card>
            <Card className="p-0 gap-y-0 col-span-2">
                <Card.Header className="p-3 pb-0">
                    <Card.Title>能量流水趋势</Card.Title>
                </Card.Header>
                <Card.Content className="overflow-y-auto">
                    曲线图
                </Card.Content>
            </Card>
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