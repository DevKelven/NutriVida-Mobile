import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";

const logoApp = require("@/assets/images/Logonutri.png");

interface Usuario {
  email: string;
  senha: string;
  nome?: string; // opcional, se tiver a coluna nome
}

export default function Login() {
  // const [dados, setDados] = useState([]);// começa array vazio pq não te nada do BD ainda
  const [dados, setDados] = useState<Usuario[]>([]);
  const router = useRouter();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {// meu gatilho de ação useeffect vao receber o fetch
  //   // aqui vai o endereço de IPv4 :3000/dados 
  //   fetch('http://192.168.14.202:3000/dados') //esse é o meu, coloque o de vocês
  //     .then(res => res.json()) //quando server responde, trabforma em json
  //     .then(json => {
  //       setDados(json);// pega lista do BD e guarda na variável dados
  //     })
  //     .catch(err => { // se servidor estiver desligado cai aqui
  //       console.error("Erro ao conectar na API:", err);
  //     });
  // }, []);
  
useEffect(() => {
  // Confirma se o IP 192.168.14.202 ainda é o mesmo (vê no ipconfig)
  fetch('http://192.168.14.202:135/dados') 
    .then(res => res.json())
    .then(json => {
      setDados(json);
      console.log("Conectado via IPv4 com sucesso!");
    })
    .catch(err => {
      console.error("Erro via IPv4:", err);
      // Se der erro aqui, é quase certo que o Firewall está a bloquear
    });
}, []);

//   useEffect(() => {
//     // Substitua pelo link que apareceu no seu terminal
//     fetch('https://cold-points-show.loca.lt') 
//       .then(res => res.json())
//       .then(json => {
//         setDados(json);
//       })
//       .catch(err => {
//         console.error("Erro ao conectar na API:", err);
//       });
// }, []);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function onClickButtonDisabled() {
    Alert.alert("Atenção", "Informe o email e a senha para acessar.");
  }

  function onClickLogin() {
  if (!login || !password) {
    Alert.alert("Erro", "Informe o email e a senha.");
    return;
  }

  // 1. Procuramos no array 'dados' se existe alguém com esse login e senha
  // 'user' representa cada linha da sua tabela 'usuarios'
  const usuarioValidado = dados.find(user => 
    user.email === login && user.senha === password
  );

  // 2. Se encontrarmos o objeto, o login é válido
  if (usuarioValidado) {
    Alert.alert("Sucesso", `Bem-vindo, ${usuarioValidado.nome || 'usuário'}!`);
    router.navigate("/(tabs)");
  } else {
    // 3. Se não encontrar, as credenciais estão erradas
    Alert.alert("Erro", "Login ou senha incorretos.");
  }
}

  const isFormValid = login.trim() !== "" && password.trim() !== "";

  return (
    
    <LinearGradient
      colors={["#0a1f1a", "#0f172a"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Header com Logo */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image source={logoApp} style={styles.logo} resizeMode="contain" />
            <Text style={styles.saudacao}>Que bom vê-lo novamente!</Text>
            <Text style={styles.subtitle}>
              Entre para continuar sua jornada
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.main,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Mail
                  color="#00E676"
                  size={20}
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={login}
                  placeholder="seu@email.com"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={setLogin}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  color="#00E676"
                  size={20}
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff color="#666" size={20} strokeWidth={2} />
                  ) : (
                    <Eye color="#666" size={20} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Esqueci Senha */}
            <TouchableOpacity
              onPress={() => Alert.alert("Recuperação de senha")}
              activeOpacity={0.7}
            >
              <Text style={styles.linkEsqueci}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>

            {/* Botão Entrar */}
            {isFormValid ? (
              <TouchableOpacity
                style={styles.button}
                onPress={onClickLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#00E676", "#00C853"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonDisabled}
                onPress={onClickButtonDisabled}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonTextDisabled}>Entrar</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Link href="/register" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.linkCriar}> Criar conta</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Divisor */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Social (opcional) */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
            >
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    width: 200,
    height: 80,
    marginBottom: 15,
  },

  saudacao: {
    color: "#00E676",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },

  subtitle: {
    color: "#bafdbc",
    fontSize: 14,
    fontWeight: "400",
  },

  main: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.2)",
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    color: "#bafdbc",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },

  inputIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,
    padding: 14,
    paddingLeft: 10,
    fontSize: 15,
    color: "#000",
  },

  eyeIcon: {
    padding: 14,
  },

  linkEsqueci: {
    color: "#00E676",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 24,
    fontWeight: "600",
    fontSize: 13,
  },

  button: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#00E676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#0D332D",
    fontSize: 17,
    fontWeight: "bold",
  },

  buttonDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  buttonTextDisabled: {
    color: "#666",
    fontSize: 17,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },

  footerText: {
    color: "#bafdbc",
    fontSize: 14,
  },

  linkCriar: {
    color: "#00E676",
    fontWeight: "bold",
    fontSize: 14,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  dividerText: {
    color: "#666",
    paddingHorizontal: 15,
    fontSize: 13,
  },

  socialContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  socialButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});