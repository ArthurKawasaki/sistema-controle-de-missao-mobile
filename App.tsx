/**
 * App.tsx - Aplicativo de Consultas Médicas
 * Versão 5: Consultas Reais + Formulário de Agendamento
 *
 * Evolução:
 * Aula 1 (23/03) → MVP Simples
 * Aula 2 (06/04) → Integração TypeScript
 * Aula 3 (13/04) → Componentização
 * Aula 4 (04/05) → Integração com Backend (médicos e pacientes)
 * Aula 5 (11/05) → Consultas + Formulário de Agendamento ← VOCÊ ESTÁ AQUI
 */
 
import React, { useState, useEffect } from "react";
import {
 View,
 Text,
 StyleSheet,
 FlatList,
 ActivityIndicator,
 Modal,
 TextInput,
 TouchableOpacity,
 ScrollView,
 KeyboardAvoidingView,
 Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
 
// Importando a modelagem TypeScript
import { Local } from "./src/interfaces/local";
import { Equipamento } from "./src/types/equipamento";
import { Consulta } from "./src/interfaces/consulta";
 
// Importando os serviços que consomem a API real
import { listarLocals } from "./src/services/localService";
import { listarEquipamentos } from "./src/services/equipamentoService";
import {
 listarConsultas,
 agendarConsulta,
 confirmarConsulta,
 cancelarConsulta,
 NovaConsulta,
} from "./src/services/consultaService";
 
// Cores dos badges de status
const STATUS_CORES: Record<string, string> = {
 cadastrado: "#e3f2fd",
 confirmada: "#d4edda",
 realizada: "#e8f5e9",
 cancelada: "#f8d7da",
};
 
const STATUS_TEXTO_CORES: Record<string, string> = {
 cadastrado: "#a415c0",
 confirmada: "#155724",
 realizada: "#1b5e20",
 cancelada: "#721c24",
};
 
export default function App() {
 // === ESTADOS DOS DADOS ===
 const [locals, setLocals] = useState<Local[]>([]);
 const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
 const [consultas, setConsultas] = useState<Consulta[]>([]);
 const [carregando, setCarregando] = useState(true);
 const [erro, setErro] = useState<string | null>(null);
 
 // === ESTADOS DO FORMULÁRIO ===
 const [mostrarForm, setMostrarForm] = useState(false);
 const [salvando, setSalvando] = useState(false);
 const [formLocalId, setFormLocalId] = useState("");
 const [formEquipamentoId, setFormEquipamentoId] = useState("");
 const [formDataHora, setFormDataHora] = useState("2026-05-20T10:00:00");
 const [formValor, setFormValor] = useState("");
 const [formObservacoes, setFormObservacoes] = useState("");
 
 useEffect(() => {
 carregarDados();
 }, []);
 
 async function carregarDados() {
 try {
 setCarregando(true);
 setErro(null);
 
 // Promise.all executa as 3 requisições em paralelo
 const [listaLocals, listaEquipamentos, listaConsultas] = await Promise.all([
 listarLocals(),
 listarEquipamentos(),
 listarConsultas(),
 ]);
 
 setLocals(listaLocals);
 setEquipamentos(listaEquipamentos);
 setConsultas(listaConsultas);
 } catch (error) {
 setErro(
 "Não foi possível carregar os dados.\nVerifique se o backend está rodando em http://localhost:8080"
 );
 } finally {
 setCarregando(false);
 }
 }
 
 // Formata "2026-05-20T09:00:00" → "20/05/2026 às 09:00"
 function formatarDataHora(dataHora: string): string {
 const data = new Date(dataHora);
 const dia = data.toLocaleDateString("pt-BR");
 const hora = data.toLocaleTimeString("pt-BR", {
 hour: "2-digit",
 minute: "2-digit",
 });
 return `${dia} às ${hora}`;
 }
 
 async function handleAgendarConsulta() {
 if (!formLocalId || !formEquipamentoId || !formDataHora || !formValor) {
 alert("Preencha todos os campos obrigatórios (*).");
 return;
 }
 
 try {
 setSalvando(true);
 
 const novaConsulta: NovaConsulta = {
 localId: Number(formLocalId),
 equipamentoId: Number(formEquipamentoId),
 dataHora: formDataHora,
 status: "agendada",
 valor: Number(formValor),
 observacoes: formObservacoes || undefined,
 };
 
 const consultaCriada = await agendarConsulta(novaConsulta);
 // Adiciona a nova consulta ao final da lista sem recarregar tudo
 setConsultas((prev) => [...prev, consultaCriada]);
 
 // Limpa e fecha o formulário
 setFormLocalId("");
 setFormEquipamentoId("");
 setFormDataHora("2026-05-20T10:00:00");
 setFormValor("");
 setFormObservacoes("");
 setMostrarForm(false);
 } catch (error) {
 alert("Erro ao cadastrar.\nVerifique os IDs de local e equipamento.");
 } finally {
 setSalvando(false);
 }
 }
 
 async function handleConfirmarConsulta(consulta: Consulta) {
 try {
 const atualizada = await confirmarConsulta(consulta);
 // Substitui a consulta antiga pela atualizada na lista
 setConsultas((prev) =>
 prev.map((c) => (c.id === atualizada.id ? atualizada : c))
 );
 } catch {
 alert("Erro ao confirmar.");
 }
 }
 
 async function handleCancelarConsulta(consulta: Consulta) {
 try {
 const atualizada = await cancelarConsulta(consulta);
 setConsultas((prev) =>
 prev.map((c) => (c.id === atualizada.id ? atualizada : c))
 );
 } catch {
 alert("Erro ao cancelar.");
 }
 }
 
 return (
 <View style={styles.container}>
 <StatusBar style="light" />
 
 <FlatList
 contentContainerStyle={styles.scrollContent}
 data={[]}
 renderItem={null}
 ListHeaderComponent={
 <>
 {/* Cabeçalho */}
 <View style={styles.header}>
 <Text style={styles.titulo}>Painel de Controle</Text>
 <Text style={styles.subtitulo}>GS1</Text>
 </View>
 
 {carregando && (
 <ActivityIndicator
 size="large"
 color="#fff"
 style={{ marginTop: 40 }}
 />
 )}
 
 {erro && (
 <View style={styles.erroContainer}>
 <Text style={styles.erroTexto}>{erro}</Text>
 </View>
 )}
 
 {!carregando && !erro && (
 <>
 {/* Lista de Médicos */}
 <Text style={styles.secaoTitulo}>
 Locacais ({locals.length})
 </Text>
 {locals.map((local) => (
 <View key={local.id} style={styles.card}>
 <Text style={styles.cardNome}>{local.nome}</Text>
 <Text style={styles.cardInfo}>Codigo: {local.codigo}</Text>
 <Text style={styles.cardInfo}>
 {local.especialidade?.nome ?? " - "}
 </Text>
 <View
 style={[
 styles.badge,
 local.ativo ? styles.badgeAtivo : styles.badgeInativo,
 ]}
 >
 <Text style={styles.badgeTexto}>
 {local.ativo ? "Ativo" : "Inativo"}
 </Text>
 </View>
 </View>
 ))}
 
 {/* Lista de Pacientes */}
 <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>
 Equipamentos ({equipamentos.length})
 </Text>
 {equipamentos.map((equipamento) => (
 <View key={equipamento.id} style={styles.card}>
 <Text style={styles.cardNome}>{equipamento.tipoEquipamento}</Text>
 <Text style={styles.cardInfo}>{equipamento.localInstalacao}</Text>
 </View>
 ))}
 
 {/* ─── SEÇÃO DE CONSULTAS (NOVA) ─── */}
 <View style={styles.secaoHeader}>
 <Text style={styles.secaoTituloConsultas}>
 Consultas ({consultas.length})
 </Text>
 <TouchableOpacity
 style={styles.botaoAgendar}
 onPress={() => setMostrarForm(true)}
 >
 <Text style={styles.botaoAgendarTexto}>+ Agendar</Text>
 </TouchableOpacity>
 </View>
 
 {consultas.map((consulta) => (
 <View key={consulta.id} style={styles.card}>
 {/* Badge de status colorido */}
 <View
 style={[
 styles.statusBadge,
 {
 backgroundColor:
 STATUS_CORES[consulta.status] ?? "#f0f0f0",
 },
 ]}
 >
 <Text
 style={[
 styles.statusTexto,
 {
 color:
 STATUS_TEXTO_CORES[consulta.status] ?? "#333",
 },
 ]}
 >
 {consulta.status.toUpperCase()}
 </Text>
 </View>
 
 <Text style={styles.cardNome}>
 Dr(a). {consulta.local?.nome}
 </Text>
 <Text style={styles.cardInfo}>
 👤 {consulta.equipamento?.localInstalacao}
 </Text>
 <Text style={styles.cardInfo}>
 📅 {formatarDataHora(consulta.dataHora)}
 </Text>
 <Text style={styles.cardInfo}>
</Text>
 
 {/* Botões só aparecem quando a consulta está agendada */}
 {consulta.status === "agendada" && (
 <View style={styles.acoesContainer}>
 <TouchableOpacity
 style={[styles.botaoAcao, styles.botaoConfirmar]}
 onPress={() => handleConfirmarConsulta(consulta)}
 >
 <Text style={styles.botaoAcaoTexto}>✓ Confirmar</Text>
 </TouchableOpacity>
 <TouchableOpacity
 style={[styles.botaoAcao, styles.botaoCancelarAcao]}
 onPress={() => handleCancelarConsulta(consulta)}
 >
 <Text style={styles.botaoAcaoTexto}>✗ Cancelar</Text>
 </TouchableOpacity>
 </View>
 )}
 </View>
 ))}
 </>
 )}
 </>
 }
 />
 
 {/* ─── MODAL DE AGENDAMENTO (NOVO) ─── */}
 <Modal
 visible={mostrarForm}
 animationType="slide"
 transparent={true}
 onRequestClose={() => setMostrarForm(false)}
 >
 <KeyboardAvoidingView
 behavior={Platform.OS === "ios" ? "padding" : "height"}
 style={styles.modalOverlay}
 >
 <View style={styles.modalContainer}>
 <Text style={styles.modalTitulo}>Nova Consulta</Text>
 <ScrollView>
 <Text style={styles.inputLabel}>ID do Local *</Text>
 <TextInput
 style={styles.input}
 placeholder="Ex: 1"
 keyboardType="numeric"
 value={formLocalId}
 onChangeText={setFormLocalId}
 />
 
 <Text style={styles.inputLabel}>ID do Equipamento *</Text>
 <TextInput
 style={styles.input}
 placeholder="Ex: 1"
 keyboardType="numeric"
 value={formEquipamentoId}
 onChangeText={setFormEquipamentoId}
 />
 
 <Text style={styles.inputLabel}>Data e Hora * (YYYY-MM-DDTHH:MM:SS)</Text>
 <TextInput
 style={styles.input}
 placeholder="2026-05-25T10:00:00"
 value={formDataHora}
 onChangeText={setFormDataHora}
 />
 
 
 <Text style={styles.inputLabel}>Observações (opcional)</Text>
 <TextInput
 style={[styles.input, styles.inputMultilinha]}
 placeholder="Ex: Consulta de rotina"
 value={formObservacoes}
 onChangeText={setFormObservacoes}
 multiline
 numberOfLines={3}
 />
 
 <TouchableOpacity
 style={[
 styles.botaoSalvar,
 salvando && styles.botaoDesabilitado,
 ]}
 onPress={handleAgendarConsulta}
 disabled={salvando}
 >
 {salvando ? (
 <ActivityIndicator color="#fff" />
 ) : (
 <Text style={styles.botaoSalvarTexto}>Agendar Consulta</Text>
 )}
 </TouchableOpacity>
 
 <TouchableOpacity
 style={styles.botaoCancelarModal}
 onPress={() => setMostrarForm(false)}
 >
 <Text style={styles.botaoCancelarModalTexto}>Cancelar</Text>
 </TouchableOpacity>
 </ScrollView>
 </View>
 </KeyboardAvoidingView>
 </Modal>
 </View>
 );
}
 
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: "#2f20ff" },
 scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
 header: { alignItems: "center", marginBottom: 24 },
 titulo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 8 },
 subtitulo: { fontSize: 18, color: "#fff", opacity: 0.9 },
 secaoTitulo: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 12 },
 secaoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 },
 secaoTituloConsultas: { fontSize: 18, fontWeight: "bold", color: "#fff" },
 card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
 cardNome: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
 cardInfo: { fontSize: 14, color: "#666", marginBottom: 2 },
 cardObservacoes: { fontSize: 13, color: "#888", fontStyle: "italic", marginTop: 4 },
 badge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8 },
 badgeAtivo: { backgroundColor: "#d4edda" },
 badgeInativo: { backgroundColor: "#f8d7da" },
 badgeTexto: { fontSize: 12, fontWeight: "bold", color: "#333" },
 statusBadge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8 },
 statusTexto: { fontSize: 11, fontWeight: "bold" },
 acoesContainer: { flexDirection: "row", gap: 8, marginTop: 10 },
 botaoAcao: { flex: 1, borderRadius: 8, padding: 10, alignItems: "center" },
 botaoConfirmar: { backgroundColor: "#28a745" },
 botaoCancelarAcao: { backgroundColor: "#dc3545" },
 botaoAcaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
 botaoAgendar: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
 botaoAgendarTexto: { color: "#79059C", fontWeight: "bold", fontSize: 14 },
 erroContainer: { marginTop: 24, padding: 16, backgroundColor: "rgba(255,80,80,0.2)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,80,80,0.5)" },
 erroTexto: { fontSize: 14, color: "#fff", textAlign: "center", lineHeight: 22 },
 modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
 modalContainer: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: "85%" },
 modalTitulo: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 20, textAlign: "center" },
 inputLabel: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
 input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 16, color: "#333" },
 inputMultilinha: { height: 80, textAlignVertical: "top" },
 botaoSalvar: { backgroundColor: "#79059C", borderRadius: 10, padding: 16, alignItems: "center", marginBottom: 12 },
 botaoDesabilitado: { opacity: 0.6 },
 botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
 botaoCancelarModal: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 8 },
 botaoCancelarModalTexto: { color: "#666", fontSize: 15 },
});
