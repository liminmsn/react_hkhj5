import UserNet, { Api } from "../UserNet";

export function model_energy_ranking(limit: number, callFun: (data: NetUser.ResType<NetUser.Response.ModelEnergy.RankingList>) => void) {
    new UserNet(`${Api.energyRanking}?limit=${limit}`).get()(async data => callFun(await UserNet.utils.toJson(data)))
}