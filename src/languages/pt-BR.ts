// languages/index.ts (ou onde seu arquivo ptBRStrings está)

export const ptBRStrings = {
  global: {
    attention: "Atenção",
    error: "Erro",
    success: "Sucesso!",
    validationError: "Erro de Validação",
    registrationFailed: "Falha no Cadastro",
    fillAllFields: "Por favor, preencha todos os campos.",
    serverError: "Não foi possível conectar ao servidor.",
    invalidDate: "Data Inválida",
    invalidPassword: "Senha Inválida",
    backToLogin: "voltar ao login",
    back: "voltar",
    continue: "Continuar",
    select: "Selecionar",
    cpfLabel: "CPF",
    cpfPlaceholder: "000.000.000-00",
    datePlaceholder: "DD/MM/AAAA",
    emailLabel: "Email",
    emailPlaceholder: "exemplo@dominio.com",
    passwordLabel: "Senha",
    newPasswordLabel: "Nova Senha",
    confirmPasswordLabel: "Confirmar Senha",
    createStrongPassword: "Crie uma senha forte",
    repeatPasswordPlaceholder: "Repita a senha",
  },

  login: {
    rememberMe: "Lembre de mim",
    forgotPassword: "Esqueci minha senha.",
    loginButton: "Logar-se",
    noAccount: "Não tem conta?",
    signUp: "Cadastrar-se",
    loginFailureTitle: "Falha no Login",
    passwordPlaceholder: "Digite sua senha",
  },

  cadastroCliente: {
    title: "Cadastro Cliente",
    backToLogin: "voltar ao login",
    nomeLabel: "Nome",
    nomePlaceholder: "Digite seu nome completo",
    dataNascLabel: "Data Nasc",
    correctBirthDate: "Corrija a data de nascimento para continuar.",
    passwordRequirements: "Cumpra todos os requisitos de senha para continuar.",
    successTitle: "Cadastro realizado!",
    successMessage: "Cadastre seu veículo para continuar.",
    button: "Cadastrar",
  },

  cadastroVeiculo: {
    title: "Cadastro de Veículo",
    userIdError:
      "Não foi possível encontrar seu ID de usuário. Tente fazer o login novamente.",
    validationMessage:
      "Preencha a Marca, Modelo, Ano (AAAA), Quilometragem e Cor com dados válidos.",
    successMessage: "Veículo cadastrado com sucesso!",
    unknownError: "Erro desconhecido ao cadastrar veículo.",
    placaLabel: "Placa",
    placaPlaceholder: "Ex: ABC-1D23",
    invalidPlaca: "Formato de placa inválido",
    marcaLabel: "Marca",
    marcaPlaceholder: "Ex: Volkswagen",
    modeloLabel: "Modelo",
    modeloPlaceholder: "Ex: Gol",
    combustivelLabel: "Combustível",
    anoLabel: "Ano",
    anoPlaceholder: "AAAA",
    kmLabel: "Quilometragem",
    kmPlaceholder: "Ex: 50000",
    corLabel: "Cor",
    corPlaceholder: "Ex: Preto",
    optionalData: "Dados opcionais",
    tracaoLabel: "Tração",
    tracaoPlaceholder: "Ex: 4x4",
    revisaoLabel: "Revisão",
    trocaPneuLabel: "Troca de pneu",
    trocaOleoLabel: "Troca de óleo",
    button: "Cadastrar Veículo",
  },

  recuperarSenha: {
    recoverAccountTitle: "Recuperar Cadastro",
    createNewPasswordTitle: "Criar Nova Senha",
    correctBirthDate: "Corrija a data de nascimento para continuar.",
    accountFoundMessage: "Cadastro encontrado! Agora crie uma nova senha.",
    newPasswordRequirements: "A nova senha deve cumprir todos os requisitos.",
    passwordChangedSuccess:
      "Sua senha foi alterada. Faça o login com sua nova senha.",
    newPasswordLabel: "Nova Senha",
    confirmNewPasswordLabel: "Confirmar Nova Senha",
    repeatNewPasswordPlaceholder: "Repita a nova senha",
    savePasswordButton: "Salvar Senha",
    dataNascLabel: "Data Nasc.",
  },

  home: {
    cardTitle: "Seu veículo precisa de atenção?",
    cardSubtitle:
      "Agende um serviço de forma rápida e encontre os melhores profissionais perto de você.",
    scheduleServiceButton: "Agendar um Serviço",
  },

  services: {
    valueOfferTab: "Oferta de Valor",
    mapTab: "Mapa",
    noServiceRequested: "Nenhum serviço solicitado...",
    requestServiceButton: "Solicitar serviço",
  },

  solicitarServico: {
    title: "Solicitação",
    tipoServicoLabel: "Tipo de serviço",
    tipoServicoPlaceholder: "Selecione o tipo de serviço",
    veiculoLabel: "Veículo",
    veiculoPlaceholder: "Selecione o seu veículo",
    descricaoLabel: "Descrição",
    descricaoPlaceholder: "Descreva o problema ou o que você precisa...",
    solicitarButton: "SOLICITAR",
    validationError: "Selecione o tipo de serviço e o veículo para continuar.",
    successTitle: "Solicitação Enviada!",
    successMessage:
      "Sua solicitação foi enviada com sucesso. Aguarde o contato de uma oficina.",
  },

  profile: {
    title: "Perfil",
    generalSettings: "Configurações Gerais",
    security: "Segurança",
    personalData: "Dados\nPessoais",
    vehicles: "Veículos",
    help: "Ajuda",
    registeredVehicles: "Veículos cadastrados",
    passwordPlaceholder: "Deixe em branco para não alterar",
    saveButton: "Salvar Alterações",
    saveSuccessTitle: "Perfil Atualizado!",
    saveSuccessMessage: "Suas informações foram salvas com sucesso.",
  },

  // --- ADICIONADO ---
  securityScreen: {
    title: "Segurança",
    password: "Senha",
    passwordSubtitle: "Última alteração em: 21 de outubro de 2020",
    recoveryPhone: "Telefone para recuperação",
    recoveryPhoneSubtitle: "Adicione um número de telefone alternativo",
  },

  // --- ADICIONADO ---
  personalDataScreen: {
    title: "Informações pessoais",
    name: "Nome",
    phone: "Número de telefone",
    language: "Idioma",
    languageSubtitle: "Atualizar idioma do dispositivo",
  },

  drawerMenu: {
    userNamePlaceholder: "Nome do Usuário",
    userEmailPlaceholder: "email@exemplo.com",
    home: "Início",
    services: "Serviços",
    history: "Histórico",
    profile: "Perfil",
    help: "Ajuda",
    logout: "Sair",
    logoutConfirmTitle: "Confirmar Saída",
    logoutConfirmMessage: "Você tem certeza que deseja sair?",
    logoutCancel: "Cancelar",
    logoutError: "Não foi possível sair. Tente novamente.",
  },

  inputComponent: {
    minAgeError: (age: number) => `A idade mínima é de ${age} anos.`,
    fuelOptions: {
      commonGasoline: "Gasolina Comum",
      additiveGasoline: "Gasolina Aditivada",
      premiumGasoline: "Gasolina Premium",
      ethanol: "Etanol",
      diesel: "Diesel",
      cng: "GNV (Gás)",
    },
  },

  passwordValidation: {
    length: "Pelo menos 6 caracteres",
    uppercase: "Uma letra maiúscula",
    specialChar: "Um caractere especial (!@#$)",
    match: "As senhas coincidem",
  },
};