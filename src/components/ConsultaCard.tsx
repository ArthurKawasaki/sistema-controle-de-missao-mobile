/**
 * =============================================================================
 * COMPONENTE: ConsultaCard
 * =============================================================================
 *
 * Este é nosso primeiro componente extraído!
 *
 * O que este componente faz?
 * → Exibe os dados de UMA consulta médica de forma organizada
 *
 * Por que criamos este componente?
 * → Reutilização: Se tivermos 10 consultas, usamos este componente 10 vezes
 * → Organização: App.tsx não precisa saber COMO renderizar um card
 * → Manutenção: Mudanças no visual do card acontecem apenas aqui
 * → Testabilidade: Podemos testar este componente isoladamente
 *
 * =============================================================================
 */

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

// Importamos a interface Consulta que criamos na aula passada
// Ela vem de src/interfaces/ porque é usada em VÁRIOS lugares
import { Consulta } from "../interfaces/consulta";

/**
 * =============================================================================
 * TIPAGEM DAS PROPS (TYPE LOCAL DO COMPONENTE)
 * =============================================================================
 *
 * Atenção para esta distinção IMPORTANTE:
 *
 * Consulta → está em src/interfaces/ (usada em vários lugares)
 * ConsultaCardProps → está AQUI (usada APENAS neste componente)
 *
 * REGRA DE OURO:
 * Type/Interface usado em VÁRIOS componentes → src/types/ ou src/interfaces/
 * Type usado em UM componente só → dentro do próprio arquivo
 *
 * =============================================================================
 */
type ConsultaCardProps = {
  // A consulta que queremos exibir (OBRIGATÓRIA)
  consulta: Consulta;

  // Função chamada quando o usuário clica em "Confirmar" (OPCIONAL)
  // Por que opcional? Às vezes queremos só exibir, sem botões de ação!
  onConfirmar?: () => void;

  // Função chamada quando o usuário clica em "Cancelar" (OPCIONAL)
  onCancelar?: () => void;
};

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL
 * =============================================================================
 *
 * Aqui usamos destructuring nas props - é uma técnica moderna do JavaScript
 *
 * Em vez de: function ConsultaCard(props) { const consulta = props.consulta; }
 * Fazemos: function ConsultaCard({ consulta, onConfirmar, onCancelar })
 *
 * Fica mais limpo e direto!
 *
 * =============================================================================
 */
export default function ConsultaCard({
  consulta,
  onConfirmar,
  onCancelar,
}: ConsultaCardProps) {

  /**
   * ===========================================================================
   * FUNÇÕES AUXILIARES (LOCAIS DO COMPONENTE)
   * ===========================================================================
   *
   * Estas funções existem APENAS para ajudar este componente.
   * Por isso ficam aqui dentro, não precisam estar em outro arquivo.
   *
   * Se fossem usadas em vários componentes, criaríamos:
   * src/utils/formatadores.ts
   *
   * ===========================================================================
   */

  // Formata um número para moeda brasileira (R$ 150,00)

  // Formata uma data no padrão brasileiro (25/03/2026)
  function formatarData(dataHora: string): string {
  const data = new Date(dataHora);
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dia} às ${hora}`;
}
  return (
    <View style={styles.card}>

      {/*
        -----------------------------------------------------------------------
        BADGE DO STATUS
        -----------------------------------------------------------------------
        Renderização condicional de estilos!

        Se status === "confirmada" → aplica styles.statusConfirmada (verde)
        Se status === "cancelada"  → aplica styles.statusCancelada (vermelho)
        Se status === "agendada"   → só o estilo padrão (roxo)
        -----------------------------------------------------------------------
      */}
      <View
        style={[
          styles.statusBadge,
          consulta.status === "confirmada" && styles.statusConfirmada,
          consulta.status === "cancelada" && styles.statusCancelada,
        ]}
      >
        <Text style={styles.statusTexto}>
          {consulta.status.toUpperCase()}
        </Text>
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: MÉDICO
        -----------------------------------------------------------------------
        Exibimos todas as informações do médico.
        Repare que acessamos: consulta.medico.nome, consulta.medico.crm, etc.
        Isso funciona porque tipamos tudo com TypeScript!
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>Local</Text>
        <Text style={styles.valor}>{consulta.local.nome}</Text>
        <Text style={styles.info}>Código: {consulta.local.codigo}</Text>
        <Text style={styles.info}>{consulta.local.especialidade.nome}</Text>
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: PACIENTE
        -----------------------------------------------------------------------
        Repare que telefone é OPCIONAL na interface Paciente!
        Se não existir, não renderizamos nada.
        Isso é renderização condicional baseada em dados opcionais.
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>Equipamento</Text>
        <Text style={styles.valor}>Tipo de Equipamento: {consulta.equipamento.tipoEquipamento}</Text>
        <Text style={styles.info}>Local de Instalaçao: {consulta.equipamento.localInstalacao}</Text>
      </View>

      {/*
        -----------------------------------------------------------------------
        SEÇÃO: DADOS DA CONSULTA
        -----------------------------------------------------------------------
        Aqui usamos as funções auxiliares formatarData() e formatarValor()

        Em vez de:
        <Text>{consulta.data.toLocaleDateString("pt-BR")}</Text>

        Fazemos:
        <Text>{formatarData(consulta.data)}</Text>

        Fica mais legível e fácil de manter!
        -----------------------------------------------------------------------
      */}
      <View style={styles.secao}>
        <Text style={styles.label}>Dados do Cadastro</Text>
        <Text style={styles.valor}>Data: {formatarData(consulta.dataHora)}</Text>
      
      
      </View>

      {/*
        -----------------------------------------------------------------------
        BOTÕES DE AÇÃO (PROPS OPCIONAIS + CALLBACKS)
        -----------------------------------------------------------------------
        CONCEITO MUITO IMPORTANTE!

        Este componente NÃO gerencia o estado da consulta.
        Quem gerencia é o componente PAI (App.tsx).

        Renderização condicional em DOIS níveis:
        Nível 1: consulta.status === "agendada"
        → Só mostra botões se a consulta ainda estiver agendada

        Nível 2: onConfirmar && <Botao>
        → Só mostra o botão se a prop foi passada
        -----------------------------------------------------------------------
      */}
      <View style={styles.acoes}>
        {consulta.status === "agendada" && (
          <>
            {onConfirmar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Confirmar Cadastro"
                  onPress={onConfirmar}
                  color="#4CAF50"
                />
              </View>
            )}
            {onCancelar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Cancelar Cadastro"
                  onPress={onCancelar}
                  color="#f11f10"
                />
              </View>
            )}
          </>
        )}

        {consulta.status === "confirmada" && (
          <View style={styles.mensagem}>
            <Text style={styles.mensagemTexto}>
              ✓ Cadastro confirmado com sucesso!
            </Text>
          </View>
        )}

        {consulta.status === "cancelada" && (
          <View style={styles.mensagemCancelada}>
            <Text style={styles.mensagemTexto}>✗ Cadastro cancelada</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * =============================================================================
 * ESTILOS DO COMPONENTE (ENCAPSULADOS)
 * =============================================================================
 *
 * Todos os estilos relacionados ao card ficam AQUI, dentro do componente.
 *
 * Antes da componentização:
 * - App.tsx tinha ~20 estilos misturados
 * - Estilos do card + estilos do app tudo junto
 *
 * Depois da componentização:
 * - App.tsx tem só estilos de layout geral (container, header, footer)
 * - ConsultaCard.tsx tem só estilos do card
 * - Cada um cuida do seu!
 *
 * Isso é ENCAPSULAMENTO na prática.
 * O componente é AUTOSSUFICIENTE: tem seu JSX, sua lógica E seus estilos.
 *
 * =============================================================================
 */
const styles = StyleSheet.create({
  // Container principal do card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    // Sombra no iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Sombra no Android
    elevation: 5,
  },

  // Badge de status (agendada, confirmada, cancelada)
  statusBadge: {
    backgroundColor: "#FFA500", // Laranja (padrão para "agendada")
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusConfirmada: {
    backgroundColor: "#4CAF50", // Verde
  },
  statusCancelada: {
    backgroundColor: "#f11f10", // Vermelho
  },
  statusTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  // Seções do card (médico, paciente, dados)
  secao: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  // Labels das seções (👨‍⚕️ Local, 👤 Equipamento, etc)
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#79059C",
    marginBottom: 8,
  },

  // Valores exibidos (nome do médico, nome do paciente, etc)
  valor: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },

  // Informações complementares (CRM, CPF, email, etc)
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  // Observações (texto em itálico)
  observacoes: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 8,
  },

  // Container das ações (botões e mensagens)
  acoes: {
    marginTop: 10,
  },

  // Espaçamento entre botões
  botaoContainer: {
    marginBottom: 12,
  },

  // Mensagem de sucesso (verde)
  mensagem: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },

  // Mensagem de cancelamento (vermelho)
  mensagemCancelada: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f11f10",
  },
  mensagemTexto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});