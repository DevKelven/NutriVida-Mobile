import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Activity,
  Apple,
  Droplets,
  Edit3,
  Moon,
  Scale,
  Sparkles,
  TrendingDown
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const perfilIcon = require("@/assets/images/perfilicon.png");
const logoApp = require("@/assets/images/logo.png");

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Pegando parâmetros da rota
  
  // ESTADOS PARA O NOME DO USUÁRIO
  const [nomeExibicao, setNomeExibicao] = useState("Usuário");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [progressoSemanal, setProgressoSemanal] = useState({
    peso: { atual: 74, inicial: 75, meta: 70 },
    agua: { atual: 14, meta: 14 },
    treinos: { atual: 4, meta: 5 },
  });

  const [tempValues, setTempValues] = useState({
    atual: "",
    meta: "",
    inicial: "",
  });

  // EFEITO PARA CARREGAR O NOME SALVO NO ASYNCSTORAGE
  useEffect(() => {
    const carregarInfoUsuario = async () => {
      try {
        // 1. Tenta buscar no armazenamento interno
        const nomeSalvo = await AsyncStorage.getItem('@usuario_nome');
        
        if (nomeSalvo) {
          setNomeExibicao(nomeSalvo);
        } else if (params.nomeUsuario) {
          // 2. Se não achou no storage mas veio por parâmetro, usa o parâmetro
          setNomeExibicao(params.nomeUsuario as string);
          // E já salva no storage para a próxima vez
          await AsyncStorage.setItem('@usuario_nome', params.nomeUsuario as string);
        }
      } catch (e) {
        console.log("Erro ao recuperar nome do usuário:", e);
      }
    };

    carregarInfoUsuario();

    // ANIMAÇÕES DE ENTRADA
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [params.nomeUsuario]); // Recarrega se o parâmetro mudar

  // --- DADOS ESTÁTICOS (RECEITAS E LEMBRETES) ---
  const destaques = [
    {
      id: 1,
      titulo: "Mini Kibe de Quinoa",
      tempo: "30 min",
      calorias: "82 kcal",
      imagem: require("@/assets/images/kibe.jpg"),
      porcoes: "12 unidades",
      ingredientes: [
        "1 xícara de quinoa cozida",
        "1/2 xícara de aveia em flocos",
        "1 cebola pequena picada",
        "2 dentes de alho",
        "1 colher de sopa de azeite",
        "Sal e pimenta a gosto",
        "Hortelã fresca",
        "Cominho em pó"
      ],
      preparo: [
        "Cozinhe a quinoa conforme instruções da embalagem e deixe esfriar",
        "Em uma frigideira, refogue a cebola e o alho no azeite até dourar",
        "Em um processador, coloque a quinoa cozida, aveia, refogado de cebola, sal, pimenta e cominho",
        "Processe até obter uma massa homogênea",
        "Modele em formato de kibe e leve ao forno pré-aquecido a 180°C por 20 minutos",
        "Vire na metade do tempo para dourar dos dois lados"
      ],
      dicas: "Sirva com iogurte natural temperado com hortelã. Pode congelar por até 30 dias."
    },
    {
        id: 2,
        titulo: "Salada Proteica",
        tempo: "20 min",
        calorias: "150 kcal",
        imagem: require("@/assets/images/salada.jpg"),
        porcoes: "2 porções",
        ingredientes: [
          "2 xícaras de folhas verdes variadas",
          "1 peito de frango grelhado desfiado",
          "2 ovos cozidos",
          "1/2 xícara de grão de bico",
          "Tomate cereja",
          "Pepino fatiado",
          "2 colheres de sopa de azeite",
          "Suco de 1 limão",
          "Sal e pimenta"
        ],
        preparo: [
          "Lave bem todas as folhas e reserve",
          "Cozinhe os ovos por 10 minutos, esfrie e descasque",
          "Grelhe o frango temperado com sal e pimenta, depois desfie",
          "Em uma tigela grande, misture as folhas, grão de bico e legumes",
          "Adicione o frango desfiado por cima",
          "Corte os ovos ao meio e disponha sobre a salada",
          "Tempere com azeite, limão, sal e pimenta"
        ],
        dicas: "Adicione sementes de girassol ou gergelim para mais textura e nutrientes."
      },
      {
        id: 3,
        titulo: "Smoothie Detox",
        tempo: "10 min",
        calorias: "95 kcal",
        imagem: require("@/assets/images/smoothie.jpg"),
        porcoes: "1 porção",
        ingredientes: [
          "1 folha de couve",
          "1/2 pepino",
          "1/2 maçã verde",
          "Suco de 1/2 limão",
          "1 pedaço pequeno de gengibre",
          "200ml de água de coco",
          "Gelo a gosto",
          "1 colher de chá de chia (opcional)"
        ],
        preparo: [
          "Lave bem todos os ingredientes",
          "Descasque o gengibre e o pepino",
          "Corte a maçã em pedaços, removendo as sementes",
          "Coloque todos os ingredientes no liquidificador",
          "Bata até ficar homogêneo e cremoso",
          "Adicione gelo se desejar mais refrescância",
          "Sirva imediatamente"
        ],
        dicas: "Beba logo após o preparo para aproveitar todos os nutrientes. Ideal para consumir em jejum."
      },
  ];

  const lembretes = [
    {
      id: 1,
      icon: Droplets,
      texto: "Beba água",
      cor: "#3B82F6",
      titulo: "Hidratação é Vida",
      descricao: "Seu corpo é 60% água! Beber água regularmente:",
      beneficios: ["Melhora o metabolismo", "Aumenta energia", "Elimina toxinas", "Pele saudável"],
      dica: "Meta: 2 litros por dia"
    },
    {
        id: 2,
        icon: Moon,
        texto: "Durma 8h",
        cor: "#8B5CF6",
        titulo: "Sono de Qualidade",
        descricao: "Durante o sono seu corpo se recupera:",
        beneficios: [
          "Regula hormônios da fome",
          "Fortalece o sistema imunológico",
          "Melhora memória e aprendizado",
          "Reduz estresse e ansiedade"
        ],
        dica: " Meta: 7-9 horas por noite"
      },
      {
        id: 3,
        icon: Apple,
        texto: "Coma frutas",
        cor: "#EF4444",
        titulo: "Poder das Frutas",
        descricao: "Frutas são ricas em vitaminas e fibras:",
        beneficios: [
          "Fortalecem a imunidade",
          "Melhoram o funcionamento intestinal",
          "Fornecem energia natural",
          "Previnem doenças"
        ],
        dica: "Meta: 3-5 porções por dia"
      },
  ];

  // --- FUNÇÕES DE LÓGICA ---
  const calcularPercentual = (atual, meta) => {
    if (meta === 0) return 0;
    return Math.min(Math.round((atual / meta) * 100), 100);
  };

  const openEditModal = (metricType) => {
    const metric = progressoSemanal[metricType];
    setEditingMetric(metricType);
    setTempValues({
      atual: metric.atual.toString(),
      meta: metric.meta.toString(),
      inicial: metric.inicial ? metric.inicial.toString() : "",
    });
    setEditModalVisible(true);
  };

  const saveProgress = () => {
    if (!editingMetric) return;
    const newData = { ...progressoSemanal };
    newData[editingMetric] = {
      atual: parseFloat(tempValues.atual) || 0,
      meta: parseFloat(tempValues.meta) || 0,
      ...(tempValues.inicial && { inicial: parseFloat(tempValues.inicial) || 0 })
    };
    setProgressoSemanal(newData);
    setEditModalVisible(false);
  };

  const getMetricConfig = (type) => {
    const configs = {
      peso: { title: "Peso", icon: TrendingDown, color: "#00E676", unit: "kg", hasInitial: true },
      agua: { title: "Hidratação", icon: Droplets, color: "#3B82F6", unit: "L", hasInitial: false },
      treinos: { title: "Atividades", icon: Activity, color: "#EF4444", unit: "dias", hasInitial: false },
    };
    return configs[type];
  };

  const { peso, agua, treinos } = progressoSemanal;

  return (
    <LinearGradient colors={["#0a1f1a", "#0f172a"]} style={styles.gradient}>
      {/* HEADER CORRIGIDO COM O NOME DINÂMICO */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoApp} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.greetingTitle}>Olá,</Text>
            <Text style={styles.greetingName}>{nomeExibicao}!</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Image source={perfilIcon} style={styles.perfilImg} resizeMode="cover" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION */}
        <Animated.View style={[styles.heroCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroTitle}>Transforme Sua Vida</Text>
          <Text style={styles.heroSubtitle}>Crie seu primeiro cardápio personalizado grátis</Text>
          <TouchableOpacity style={styles.heroCTA} onPress={() => router.push("/planos")}>
            <Text style={styles.heroCTAText}>Começar Agora</Text>
            <Text style={styles.heroCTAArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* LEMBRETES */}
        <View style={styles.remindersContainer}>
          {lembretes.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={item.id} style={styles.reminderCard} onPress={() => { setSelectedReminder(item); setModalVisible(true); }}>
                <View style={[styles.reminderIconBg, { backgroundColor: `${item.cor}20` }]}>
                  <IconComponent color={item.cor} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.reminderText}>{item.texto}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECEITAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Receitas Gratuitas</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todas →</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeScroll}>
            {destaques.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recipeCard} onPress={() => { setSelectedRecipe(item); setRecipeModalVisible(true); }}>
                <Image source={item.imagem} style={styles.recipeImage} resizeMode="cover" />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.recipeGradient}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>{item.titulo}</Text>
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeDetail}>⏱ {item.tempo}</Text>
                    <Text style={styles.recipeDetail}>🔥 {item.calorias}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PROGRESSO SEMANAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso Semanal</Text>
          <View style={styles.progressCard}>
            {/* Peso */}
            <TouchableOpacity style={styles.progressItem} onPress={() => openEditModal('peso')}>
              <View style={styles.progressHeader}>
                <View style={styles.progressIconContainer}><TrendingDown color="#00E676" size={20} /></View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Peso</Text>
                  <Text style={styles.progressValue}>{peso.atual}kg → {peso.meta}kg</Text>
                </View>
                <Edit3 color="#00E676" size={16} />
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${calcularPercentual(peso.inicial - peso.atual, peso.inicial - peso.meta)}%`, backgroundColor: "#00E676" }]} />
              </View>
            </TouchableOpacity>

            <View style={styles.progressDivider} />

            {/* Água */}
            <TouchableOpacity style={styles.progressItem} onPress={() => openEditModal('agua')}>
              <View style={styles.progressHeader}>
                <View style={[styles.progressIconContainer, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}><Droplets color="#3B82F6" size={20} /></View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Hidratação</Text>
                  <Text style={styles.progressValue}>{agua.atual}L / {agua.meta}L</Text>
                </View>
                <Edit3 color="#3B82F6" size={16} />
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${calcularPercentual(agua.atual, agua.meta)}%`, backgroundColor: "#3B82F6" }]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACESSO RÁPIDO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          <View style={styles.shortcutsContainer}>
            <TouchableOpacity style={styles.shortcutButton} onPress={() => router.push("/imc")}>
              <View style={styles.shortcutIcon}><Scale color="#00E676" size={32} /></View>
              <Text style={styles.shortcutLabel}>IMC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutButton} onPress={() => router.push("/planos")}>
              <View style={styles.shortcutIcon}><Sparkles color="#00E676" size={32} /></View>
              <Text style={styles.shortcutLabel}>Planos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 NutriVida</Text>
        </View>
      </ScrollView>

      {/* MODAL EDITAR (EXEMPLO) */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
         <View style={styles.modalOverlay}>
           <View style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>Atualizar Dados</Text>
              <TextInput 
                style={styles.input} 
                value={tempValues.atual} 
                onChangeText={(t) => setTempValues({...tempValues, atual: t})}
                keyboardType="numeric"
                placeholder="Valor Atual"
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveProgress}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>Cancelar</Text>
              </TouchableOpacity>
           </View>
         </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "rgba(10, 31, 26, 0.95)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 40, height: 40 },
  greetingTitle: { color: "#94a3b8", fontSize: 16},
  greetingName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  perfilImg: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: "#00E676" },
  heroCard: { margin: 20, padding: 20, borderRadius: 20, backgroundColor: "#1e293b", overflow: "hidden" },
  heroGlow: { position: "absolute", top: -50, right: -50, width: 150, height: 150, backgroundColor: "#00E676", opacity: 0.1, borderRadius: 75 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  heroSubtitle: { color: "#94a3b8", fontSize: 14, marginTop: 5 },
  heroCTA: { backgroundColor: "#00E676", flexDirection: "row", alignSelf: "flex-start", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 15, alignItems: "center" },
  heroCTAText: { color: "#0a1f1a", fontWeight: "bold" },
  heroCTAArrow: { color: "#0a1f1a", marginLeft: 5 },
  remindersContainer: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 10 },
  reminderCard: { alignItems: "center", width: width / 3.5 },
  reminderIconBg: { padding: 12, borderRadius: 15, marginBottom: 5 },
  reminderText: { color: "#fff", fontSize: 11 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#00E676", fontSize: 12 },
  recipeScroll: { gap: 15 },
  recipeCard: { width: 200, height: 150, borderRadius: 15, overflow: "hidden" },
  recipeImage: { width: "100%", height: "100%" },
  recipeGradient: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10, height: "60%", justifyContent: "flex-end" },
  recipeTitle: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  recipeInfo: { flexDirection: "row", gap: 10, marginTop: 5 },
  recipeDetail: { color: "#ccc", fontSize: 10 },
  progressCard: { backgroundColor: "#1e293b", borderRadius: 15, padding: 15 },
  progressItem: { marginBottom: 15 },
  progressHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  progressIconContainer: { padding: 8, borderRadius: 10, backgroundColor: "rgba(0, 230, 118, 0.1)" },
  progressInfo: { flex: 1 },
  progressLabel: { color: "#94a3b8", fontSize: 12 },
  progressValue: { color: "#fff", fontWeight: "bold" },
  progressBarContainer: { height: 6, backgroundColor: "#334155", borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%" },
  progressDivider: { height: 1, backgroundColor: "#334155", marginVertical: 10 },
  shortcutsContainer: { flexDirection: "row", gap: 15 },
  shortcutButton: { flex: 1, backgroundColor: "#1e293b", padding: 15, borderRadius: 15, alignItems: "center" },
  shortcutIcon: { marginBottom: 8 },
  shortcutLabel: { color: "#fff", fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", padding: 20 },
  editModalContent: { backgroundColor: "#1e293b", padding: 25, borderRadius: 20 },
  editModalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { backgroundColor: "#0f172a", color: "#fff", padding: 15, borderRadius: 10, marginBottom: 15 },
  saveButton: { backgroundColor: "#00E676", padding: 15, borderRadius: 10, alignItems: "center" },
  saveButtonText: { color: "#0a1f1a", fontWeight: "bold" },
  footer: { marginTop: 40, alignItems: "center", paddingBottom: 20 },
  footerText: { color: "#475569", fontSize: 12 }
});