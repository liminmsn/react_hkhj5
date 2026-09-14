import UserNet, { Api } from "../UserNet";

export function model_invite_info(invite_code: string, callFun: (data: NetUser.ResType<NetUser.Response.ModelInvite.Info>) => void) {
    new UserNet(`${Api.inviteInfo}?invite_code=${invite_code}`).CarryToken().get()(async data => callFun(await UserNet.utils.toJson(data)))
}

export function model_invite_activate(invite_code: string, callFun: (data: NetUser.ResType<NetUser.Response.ModelInvite.Info>) => void) {
    new UserNet(`${Api.inviteActivate}?invite_code=${invite_code}`).CarryToken().get()(async data => callFun(await UserNet.utils.toJson(data)))
}