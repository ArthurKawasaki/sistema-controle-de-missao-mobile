import { Local } from "./local";
import { Equipamento } from "../types/equipamento";
import { StatusConsulta } from "../types/statusConsulta";
 
export interface Consulta {
 id: number;
 local: Local;
 equipamento: Equipamento;
 dataHora: string; // ISO string vindo do backend (ex: "2026-05-20T09:00:00")
 valor: number;
 status: StatusConsulta;

}