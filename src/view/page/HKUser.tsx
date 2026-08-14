import { Button, Card, Description, FieldError, FieldGroup, Fieldset, Form, Input, Label, TextArea, TextField, toast, Toast } from "@heroui/react";
import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { net_model_user_login } from "../../api/user/model/modelUser";
import getFormData from "../../utils/getFormData";
import { useUserInfo } from "../../store";

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
                {/* <FloppyDisk /> */}
                登陆
            </Button>
            <Button type="reset" variant="secondary">
                清空
            </Button>
        </Fieldset.Actions>
    </Fieldset>
}

function Register({ ref }: { ref?: Ref<LoginRegisterRef> }) {
    // 暴露给父组件
    useImperativeHandle(ref, () => ({
        onsubmit(e: React.FormEvent<HTMLFormElement>) {
            const data = getFormData(e);
            // net_model_user_login(data as any, (data) => {
            //     toast(<Label>{data.message}</Label>)
            // });
        }
    }));

    return <Fieldset className="gap-y-3">
        <Fieldset.Legend>能量系统注册用户</Fieldset.Legend>
        <Description>完善以下信息</Description>
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
            <TextField className="mb-1" isRequired name="email" type="email">
                <Label>邮箱</Label>
                <Input placeholder="abc@qq.com" />
                <FieldError />
            </TextField>
        </FieldGroup>
        <Fieldset.Actions>
            <Button type="submit">
                {/* <FloppyDisk /> */}
                下一步
            </Button>
        </Fieldset.Actions>
    </Fieldset>
}

function LoginRegisterLayout() {
    const loginRef = useRef<LoginRegisterRef>(null);
    const registerRef = useRef<LoginRegisterRef>(null);
    const ComponentArr = [<Login ref={loginRef} />, <Register ref={registerRef} />];

    const [idx, setIdx] = useState(1);

    return <Card className="mx-auto mt-30 w-2/6">
        <Form onSubmit={(e) => {
            const onSubmit = [loginRef, registerRef][idx].current?.onsubmit;
            if (onSubmit) {
                onSubmit(e);
            }
        }}>
            {ComponentArr[idx]}
        </Form>
        {
            idx == 0 &&
            <div className="flex justify-between px-3.5">
                <Label className="cursor-pointer" onClick={() => setIdx(1)}>注册</Label>
                <Label className="cursor-pointer" onClick={() => setIdx(1)}>忘记密码</Label>
            </div>
        }
        {
            idx == 1 &&
            <div>
                <Label className="cursor-pointer" onClick={() => setIdx(0)}>已有账户？去登陆</Label>
            </div>
        }
    </Card>
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