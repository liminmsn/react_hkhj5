import UserNet, { Api } from "../UserNet";

export function model_energy_ranking(limit: number, callFun: (data: NetUser.ResType<NetUser.Response.ModelEnergy.Ranking[]>) => void) {
    new UserNet(`${Api.energyRanking}?limit=${limit}`).CarryToken().get()(async data => callFun(await UserNet.utils.toJson(data)))
}
export function model_energy_flowingWater(offset: number, size: number, callFun: (data: NetUser.ResType<NetUser.Response.ModelEnergy.FlowingWater[]>) => void) {
    new UserNet(`${Api.flowingWater}?offset=${offset}&size=${size}`).CarryToken().get()(async data => callFun(await UserNet.utils.toJson(data)))
}
export function model_energy_flowingChat(item: { startTime: string; endTime: string; offset: number; size: number; }, callFun: (data: NetUser.ResType<NetUser.Response.ModelEnergy.FlowingWater[]>) => void) {
    const params = new URLSearchParams({
        startTime: item.startTime,
        endTime: item.endTime,
        offset: item.offset.toString(),
        size: item.size.toString()
    });
    new UserNet(`${Api.flowingWaterChat}?${params}`)
        .CarryToken()
        .get()(async data => callFun(await UserNet.utils.toJson(data)))
}