import api from "./api";
import { Especialidade } from "../types/especialidade";
 
export async function listarEspecialidades(): Promise<Especialidade[]> {
 const response = await api.get<Especialidade[]>("/especialidades");
 return response.data;
}
 
export async function buscarEspecialidadePorId(id: number): Promise<Especialidade> {
 const response = await api.get<Especialidade>(`/especialidades/${id}`);
 return response.data;
}
 
export async function criarEspecialidade(especialidade: Omit<Especialidade, "id">): Promise<Especialidade> {
 const response = await api.post<Especialidade>("/especialidades", especialidade);
 return response.data;
}