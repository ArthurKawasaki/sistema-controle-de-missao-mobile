import api from "./api";
import { Local } from "../interfaces/local";
 
export async function listarLocals(): Promise<Local[]> {
 const response = await api.get<Local[]>("/locals");
 return response.data;
}
 
export async function buscarLocalPorId(id: number): Promise<Local> {
 const response = await api.get<Local>(`/locals/${id}`);
 return response.data;
}