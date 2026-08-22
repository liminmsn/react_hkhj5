import UserNet, { Api } from "../UserNet";

export function model_price_list(callFun: (data: NetUser.ResType<NetUser.Response.ModelPrice.ListList>) => void) {
    new UserNet(Api.priceList).CarryToken().get()(async data => callFun(await UserNet.utils.toJson(data)))
}