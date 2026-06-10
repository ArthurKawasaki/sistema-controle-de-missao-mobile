import api from "./api";
import { Equipamento } from "../types/equipamento";
 
export async function listarEquipamentos(): Promise<Equipamento[]> {
 const response = await api.get<Equipamento[]>("/equipamentos");
 return response.data;
}
 
export async function buscarEquipamentoPorId(id: number): Promise<Equipamento> {
 const response = await api.get<Equipamento>(`/equipamentos/${id}`);
 return response.data;
}