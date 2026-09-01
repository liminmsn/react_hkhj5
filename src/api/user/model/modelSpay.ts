import UserNet, { Api } from "../UserNet";

export function model_spay_init_pay(param: NetUser.Parameter.ModelPrice.SpayRequest, callFun: (data: NetUser.ResType<NetUser.Response.ModelPrice.SpayResponse>) => void) {
    new UserNet(Api.initPay).CarryToken().post(JSON.stringify(param))(async data => callFun(await UserNet.utils.toJson(data)))
}