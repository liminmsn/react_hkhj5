import UserNet, { Api } from "../UserNet";

/**发送验证码 */
export function net_model_user_sendCaptcha() {
    // new UserNet(Api.sendCaptcha).post()<NetUser.Response.Captcha>(res => {
    //     console.log(res);
    // });
}

/**用户登录 */
export function net_model_user_login(parameter: NetUser.Parameter.ModelUser.Login, callFun: (data: NetUser.ResType<NetUser.Response.ModelUser.Login>) => void) {
    new UserNet(Api.login).post(JSON.stringify(parameter))(async data => callFun(await UserNet.utils.toJson(data)));

}

/**用户注册 */
export function net_model_user_register() {
    new UserNet(Api.register)
}