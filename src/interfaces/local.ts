import { Especialidade } from "../types/especialidade";

export interface Local {
    id: number;
    nome: string;
    codigo: string;
    especialidade: Especialidade;
    ativo: boolean;
}
