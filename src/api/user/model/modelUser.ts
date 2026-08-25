import UserNet, { Api } from "../UserNet";

/**发送验证码 */
export function net_model_user_sendCaptcha(parameter: NetUser.Parameter.ModelUser.Captcha, callFun: (data: NetUser.ResType<NetUser.Response.Captcha>) => void) {
    new UserNet(Api.sendCaptcha).post(JSON.stringify(parameter))(async data => callFun(await UserNet.utils.toJson(data)));
}

/**用户登录 */
export function net_model_user_login(parameter: NetUser.Parameter.ModelUser.Login, callFun: (data: NetUser.ResType<NetUser.Response.ModelUser.Login>) => void) {
    new UserNet(Api.login).post(JSON.stringify(parameter))(async data => callFun(await UserNet.utils.toJson(data)));
}

/**用户注册 */
export function net_model_user_register(parameter: NetUser.Parameter.ModelUser.Login, callFun: (data: NetUser.ResType<NetUser.Response.ModelUser.Login>) => void) {
    new UserNet(Api.register).post(JSON.stringify(parameter))(async data => callFun(await UserNet.utils.toJson(data)));
}
/**忘记密码 */
export function net_model_user_forgotPassword(parameter: NetUser.Parameter.ModelUser.ForgotPassword, callFun: (data: NetUser.ResType<string>) => void) {
    new UserNet(Api.forgotPassword).post(JSON.stringify(parameter))(async data => callFun(await UserNet.utils.toJson(data)));
}
export function net_model_user_info(){
    // new UserNet
}