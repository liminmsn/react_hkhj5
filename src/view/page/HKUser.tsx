import { Button, Description, FieldError, FieldGroup, Fieldset, Form, Input, Label, TextField, toast, Toast } from "@heroui/react";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { net_model_user_login, net_model_user_register, net_model_user_sendCaptcha } from "../../api/user/model/modelUser";
import getFormData from "../../utils/getFormData";
import { useUserInfo } from "../../store";
import { Mail, PartyPopper, Rocket } from "lucide-react";
import { isEmail } from "../../utils/verifys";

type SubmitParameter = React.FormEvent<HTMLFormElement>;
type LoginRegisterRef = {
    onsubmit: (e: SubmitParameter) => void;
}
function Login({ ref }: { ref?: Ref<LoginRegisterRef> }) {
    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: SubmitParameter) {
            const data = getFormData(e);
            net_model_user_login(data as any, (data) => {
                toast(<Label>{data.message}</Label>)
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

function Register({ ref }: { ref?: Ref<LoginRegisterRef> }) {

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

function LoginRegisterLayout() {
    const loginRef = useRef<LoginRegisterRef>(null);
    const registerRef = useRef<LoginRegisterRef>(null);
    const ComponentArr = [<Login ref={loginRef} />, <Register ref={registerRef} />];

    const [idx, setIdx] = useState(0);

    return <div className="mx-auto w-2/6">
        <Form onSubmit={(e) => {
            const onSubmit = [loginRef, registerRef][idx].current?.onsubmit;
            if (onSubmit) {
                onSubmit(e);
            }
        }}>
            {ComponentArr[idx]}
        </Form>
        <div className="h-3"></div>
        {
            idx == 0 &&
            <div className="flex justify-between px-3.5">
                <Label className="cursor-pointer" onClick={() => setIdx(1)}>注册用户</Label>
                <Label className="cursor-pointer" onClick={() => setIdx(1)}>忘记密码</Label>
            </div>
        }
        {
            idx == 1 &&
            <div>
                <Label className="cursor-pointer" onClick={() => setIdx(0)}>已有账户？去登陆</Label>
            </div>
        }
    </div>
}

export default function () {
    const { login } = useUserInfo();
    if (!login) {
        return <LoginRegisterLayout />
    }

    return <div className="h-full flex gap-2">
        <div className="w-full">
            User
        </div>
    </div>
}