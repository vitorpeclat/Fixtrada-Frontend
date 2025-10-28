export const enUSStrings = {
  global: {
    attention: "Attention",
    error: "Error",
    success: "Success!",
    validationError: "Validation Error",
    registrationFailed: "Registration Failed",
    fillAllFields: "Please fill in all fields.",
    serverError: "Could not connect to the server.",
    invalidDate: "Invalid Date",
    invalidPassword: "Invalid Password",
    invalidEmail: "Invalid Email",
    backToLogin: "back to login",
    back: "back",
    continue: "Continue",
    select: "Select",
    cpfLabel: "CPF", // CPF é um documento específico do Brasil, mantido para consistência
    cpfPlaceholder: "000.000.000-00",
    datePlaceholder: "MM/DD/YYYY", // Formato de data americano
    emailLabel: "Email",
    emailPlaceholder: "example@domain.com",
    confirmEmailLabel: "Confirm Email",
    confirmEmailPlaceholder: "Repeat your email",
    passwordLabel: "Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    createStrongPassword: "Create a strong password",
    repeatPasswordPlaceholder: "Repeat the password",
    cancel: "Cancel",
    save: "Save",
    cellphoneLabel: "Cellphone",
    cellphonePlaceholder: "Enter your cellphone number",
    cellphoneInvalid: "Invalid cellphone number",
  },

  login: {
    rememberMe: "Remember me",
    forgotPassword: "Forgot my password.",
    loginButton: "Log In",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    loginFailureTitle: "Login Failed",
    passwordPlaceholder: "Enter your password",
  },

  cadastroCliente: {
    title: "Client Registration",
    backToLogin: "back to login",
    nomeLabel: "Name",
    nomePlaceholder: "Enter your full name",
    dataNascLabel: "Birth Date",
    correctBirthDate: "Please correct the birth date to continue.",
    passwordRequirements: "Please meet all password requirements to continue.",
    emailsNaoCoincidem: "The emails do not match. Please check your email.",
    successTitle: "Registration complete!",
    successMessage: "Register your vehicle to continue.",
    button: "Register",
  },

  cadastroVeiculo: {
    title: "Vehicle Registration",
    userIdError:
      "Could not find your user ID. Please try logging in again.",
    validationMessage:
      "Please fill in Make, Model, Year (YYYY), Mileage, and Color with valid data.",
    successMessage: "Vehicle registered successfully!",
    unknownError: "Unknown error while registering vehicle.",
    placaLabel: "License Plate",
    placaPlaceholder: "Ex: ABC-1D23",
    invalidPlaca: "Invalid license plate format",
    marcaLabel: "Make",
    marcaPlaceholder: "Ex: Volkswagen",
    modeloLabel: "Model",
    modeloPlaceholder: "Ex: Gol", // Exemplo mantido
    combustivelLabel: "Fuel",
    anoLabel: "Year",
    anoPlaceholder: "YYYY",
    kmLabel: "Mileage",
    kmPlaceholder: "Ex: 50000",
    corLabel: "Color",
    corPlaceholder: "Ex: Black",
    optionalData: "Optional Data",
    tracaoLabel: "Drivetrain", // "Tração" pode ser "Traction" ou "Drivetrain"
    tracaoPlaceholder: "Ex: 4x4",
    revisaoLabel: "Service Check",
    trocaPneuLabel: "Tire Change",
    trocaOleoLabel: "Oil Change",
    button: "Register Vehicle",
  },

  recuperarSenha: {
    recoverAccountTitle: "Recover Account",
    createNewPasswordTitle: "Create New Password",
    correctBirthDate: "Please correct the birth date to continue.",
    accountFoundMessage: "Account found! Now, create a new password.",
    newPasswordRequirements: "The new password must meet all requirements.",
    passwordChangedSuccess:
      "Your password has been changed. Please log in with your new password.",
    newPasswordLabel: "New Password",
    confirmNewPasswordLabel: "Confirm New Password",
    repeatNewPasswordPlaceholder: "Repeat the new password",
    savePasswordButton: "Save Password",
    dataNascLabel: "Birth Date",
  },

  home: {
    cardTitle: "Does your vehicle need attention?",
    cardSubtitle:
      "Schedule a service quickly and find the best professionals near you.",
    scheduleServiceButton: "Schedule a Service",
  },

  services: {
    valueOfferTab: "Value Offer",
    mapTab: "Map",
    noServiceRequested: "No service requested...",
    requestServiceButton: "Request Service",
  },

  solicitarServico: {
    title: "Service Request",
    tipoServicoLabel: "Service Type",
    tipoServicoPlaceholder: "Select the service type",
    veiculoLabel: "Vehicle",
    veiculoPlaceholder: "Select your vehicle",
    descricaoLabel: "Description",
    descricaoPlaceholder: "Describe the problem or what you need...",
    solicitarButton: "REQUEST",
    validationError: "Please select the service type and vehicle to continue.",
    successTitle: "Request Sent!",
    successMessage:
      "Your request has been sent successfully. Please wait for a workshop to contact you.",
  },

  profile: {
    title: "Profile",
    generalSettings: "General Settings",
    security: "Security",
    personalData: "Personal\nData",
    vehicles: "Vehicles",
    help: "Help",
    registeredVehicles: "Registered vehicles",
    passwordPlaceholder: "Leave blank to keep current password",
    saveButton: "Save Changes",
    saveSuccessTitle: "Profile Updated!",
    saveSuccessMessage: "Your information has been saved successfully.",
  },

  securityScreen: {
    title: "Security",
    password: "Password",
    passwordSubtitle: "Last changed: October 21, 2020",
    recoveryPhone: "Recovery Phone",
    recoveryPhoneSubtitle: "Add an alternative phone number",
  },

  personalDataScreen: {
    title: "Personal Information",
    name: "Name",
    phone: "Phone Number",
    language: "Language",
    languageSubtitle: "Update device language",
  },

  drawerMenu: {
    userNamePlaceholder: "User Name",
    userEmailPlaceholder: "email@example.com",
    home: "Home",
    services: "Services",
    history: "History",
    profile: "Profile",
    help: "Help",
    logout: "Log Out",
    logoutConfirmTitle: "Confirm Log Out",
    logoutConfirmMessage: "Are you sure you want to log out?",
    logoutCancel: "Cancel",
    logoutError: "Could not log out. Please try again.",
  },

  inputComponent: {
    minAgeError: (age: number) => `Minimum age is ${age} years old.`,
    fuelOptions: {
      commonGasoline: "Regular Gasoline",
      additiveGasoline: "Additive Gasoline", // Pode não ter tradução direta exata
      premiumGasoline: "Premium Gasoline",
      ethanol: "Ethanol",
      diesel: "Diesel",
      cng: "CNG (Gas)",
    },
  },

  passwordValidation: {
    length: "At least 6 characters",
    uppercase: "One uppercase letter",
    specialChar: "One special character (!@#$)",
    match: "The passwords match",
  },
};