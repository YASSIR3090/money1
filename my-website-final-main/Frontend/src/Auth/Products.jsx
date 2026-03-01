// src/Auth/Products.jsx - COMPLETE FIXED VERSION 🔥
// ✅ ADD PRODUCT - Registered user goes directly to VendorRegister
// ✅ NEW USER - Goes to VendorLogin first
// ✅ ALL PRODUCTS ARE CLICKABLE
// ✅ ALL LANGUAGES WORK PROPERLY
// ✅ CROSS-DOMAIN SYNC

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // ✅ FIXED: Language state with proper persistence
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('availoLanguage');
      if (savedLanguage) {
        return savedLanguage;
      }
    } catch (error) {
      console.error("Error reading language from localStorage:", error);
    }
    return "sw";
  });
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // Nav bar background color state
  const [navBarColor, setNavBarColor] = useState("#ffffff");
  const [navTextColor, setNavTextColor] = useState("#000000");
  
  // Search suggestions state
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Mobile state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ✅ AUTH CONTEXT
  const { user, getUserProfilePicture, logout: authLogout, isVendorRegistered } = useAuth();



  // ✅ Matangazo Carousel
  const adSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Black Friday Sale",
      description: "Up to 50% off on electronics",
      link: "#",
      backgroundColor: "#FF6B6B",
      textColor: "#ffffff",
      navColor: "#FF6B6B"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "New Arrivals",
      description: "Fresh stock just landed",
      link: "#",
      backgroundColor: "#4ECDC4",
      textColor: "#ffffff",
      navColor: "#4ECDC4"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Free Shipping",
      description: "On orders above 200,000 TZS",
      link: "#",
      backgroundColor: "#45B7D1",
      textColor: "#ffffff",
      navColor: "#45B7D1"
    }
  ];
  
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // ✅ COMPLETE TRANSLATIONS FOR ALL LANGUAGES
  const translations = {
    sw: {
      appName: "Availo",
      searchPlaceholder: "Tafuta bidhaa, maduka, brand...",
      sellProducts: "Uza bidhaa zako",
      signIn: "Ingia",
      signUp: "Jiandikishe",
      signInToSell: "Ingia kuuza bidhaa",
      welcome: "Karibu Availo",
      browseProducts: "Vinjari bidhaa",
      myProducts: "Bidhaa zangu",
      addProduct: "Ongeza bidhaa",
      help: "Msaada",
      logout: "Toka",
      home: "Nyumbani",
      shopNav: "Duka",
      account: "Akaunti",
      helpCenter: "Kituo cha msaada",
      language: "Lugha",
      selectLanguage: "Chagua Lugha",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Bidhaa Zote",
      location: "Mahali",
      noProducts: "Hakuna bidhaa zilizopatikana",
      clearSearch: "Futa utafutaji",
      viewDetails: "Angalia maelezo",
      tapToView: "Bonyeza kuona maelezo",
      searchResults: "Matokeo ya Utafutaji",
      searchFor: "Kutafuta:",
      productsFound: "bidhaa zilizopatikana",
      profile: "Wasifu",
      product: "Bidhaa",
      brand: "Chapa",
      condition: "Hali",
      shop: "Duka"
    },
    en: {
      appName: "Availo",
      searchPlaceholder: "Search products, shops, brands...",
      sellProducts: "Sell your products",
      signIn: "Sign in",
      signUp: "Register",
      signInToSell: "Sign in to sell products",
      welcome: "Welcome to Availo",
      browseProducts: "Browse Products",
      myProducts: "My Products",
      addProduct: "Add New",
      help: "Help",
      logout: "Logout",
      home: "Home",
      shopNav: "Shop",
      account: "Account",
      helpCenter: "Help Center",
      language: "Language",
      selectLanguage: "Select Language",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "All Products",
      location: "Location",
      noProducts: "No products found",
      clearSearch: "Clear Search",
      viewDetails: "View Details",
      tapToView: "Tap to view details",
      searchResults: "Search Results",
      searchFor: "Searching for:",
      productsFound: "products found",
      profile: "Profile",
      product: "Product",
      brand: "Brand",
      condition: "Condition",
      shop: "Shop"
    },
    ar: {
      appName: "أفايلو",
      searchPlaceholder: "ابحث عن منتجات، متاجر، علامات تجارية...",
      sellProducts: "بيع منتجاتك",
      signIn: "تسجيل الدخول",
      signUp: "التسجيل",
      signInToSell: "سجل الدخول لبيع المنتجات",
      welcome: "مرحباً بك في أفايلو",
      browseProducts: "تصفح المنتجات",
      myProducts: "منتجاتي",
      addProduct: "إضافة جديد",
      help: "مساعدة",
      logout: "تسجيل الخروج",
      home: "الرئيسية",
      shopNav: "متجر",
      account: "الحساب",
      helpCenter: "مركز المساعدة",
      language: "اللغة",
      selectLanguage: "اختر اللغة",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "جميع المنتجات",
      location: "الموقع",
      noProducts: "لم يتم العثور على منتجات",
      clearSearch: "مسح البحث",
      viewDetails: "عرض التفاصيل",
      tapToView: "انقر لعرض التفاصيل",
      searchResults: "نتائج البحث",
      searchFor: "البحث عن:",
      productsFound: "منتج تم العثور عليه",
      profile: "الملف الشخصي",
      product: "المنتج",
      brand: "العلامة التجارية",
      condition: "الحالة",
      shop: "متجر"
    },
    fr: {
      appName: "Availo",
      searchPlaceholder: "Rechercher produits, boutiques, marques...",
      sellProducts: "Vendez vos produits",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      signInToSell: "Connectez-vous pour vendre",
      welcome: "Bienvenue sur Availo",
      browseProducts: "Parcourir les produits",
      myProducts: "Mes produits",
      addProduct: "Ajouter",
      help: "Aide",
      logout: "Déconnexion",
      home: "Accueil",
      shopNav: "Boutique",
      account: "Compte",
      helpCenter: "Centre d'aide",
      language: "Langue",
      selectLanguage: "Choisir la langue",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Tous les produits",
      location: "Emplacement",
      noProducts: "Aucun produit trouvé",
      clearSearch: "Effacer la recherche",
      viewDetails: "Voir les détails",
      tapToView: "Appuyez pour voir les détails",
      searchResults: "Résultats de recherche",
      searchFor: "Recherche:",
      productsFound: "produits trouvés",
      profile: "Profil",
      product: "Produit",
      brand: "Marque",
      condition: "État",
      shop: "Boutique"
    },
    es: {
      appName: "Availo",
      searchPlaceholder: "Buscar productos, tiendas, marcas...",
      sellProducts: "Vende tus productos",
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      signInToSell: "Inicia sesión para vender",
      welcome: "Bienvenido a Availo",
      browseProducts: "Explorar productos",
      myProducts: "Mis productos",
      addProduct: "Agregar",
      help: "Ayuda",
      logout: "Cerrar sesión",
      home: "Inicio",
      shopNav: "Tienda",
      account: "Cuenta",
      helpCenter: "Centro de ayuda",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Todos los productos",
      location: "Ubicación",
      noProducts: "No se encontraron productos",
      clearSearch: "Limpiar búsqueda",
      viewDetails: "Ver detalles",
      tapToView: "Toca para ver detalles",
      searchResults: "Resultados de búsqueda",
      searchFor: "Buscando:",
      productsFound: "productos encontrados",
      profile: "Perfil",
      product: "Producto",
      brand: "Marca",
      condition: "Condición",
      shop: "Tienda"
    },
    pt: {
      appName: "Availo",
      searchPlaceholder: "Pesquisar produtos, lojas, marcas...",
      sellProducts: "Venda seus produtos",
      signIn: "Entrar",
      signUp: "Registrar",
      signInToSell: "Entre para vender",
      welcome: "Bem-vindo ao Availo",
      browseProducts: "Explorar produtos",
      myProducts: "Meus produtos",
      addProduct: "Adicionar",
      help: "Ajuda",
      logout: "Sair",
      home: "Início",
      shopNav: "Loja",
      account: "Conta",
      helpCenter: "Central de ajuda",
      language: "Idioma",
      selectLanguage: "Selecionar idioma",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Todos os produtos",
      location: "Localização",
      noProducts: "Nenhum produto encontrado",
      clearSearch: "Limpar pesquisa",
      viewDetails: "Ver detalhes",
      tapToView: "Toque para ver detalhes",
      searchResults: "Resultados da pesquisa",
      searchFor: "Pesquisando:",
      productsFound: "produtos encontrados",
      profile: "Perfil",
      product: "Produto",
      brand: "Marca",
      condition: "Condição",
      shop: "Loja"
    },
    zh: {
      appName: "Availo",
      searchPlaceholder: "搜索产品、商店、品牌...",
      sellProducts: "出售您的产品",
      signIn: "登录",
      signUp: "注册",
      signInToSell: "登录以出售产品",
      welcome: "欢迎来到Availo",
      browseProducts: "浏览产品",
      myProducts: "我的产品",
      addProduct: "添加",
      help: "帮助",
      logout: "退出",
      home: "首页",
      shopNav: "商店",
      account: "账户",
      helpCenter: "帮助中心",
      language: "语言",
      selectLanguage: "选择语言",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "所有产品",
      location: "位置",
      noProducts: "未找到产品",
      clearSearch: "清除搜索",
      viewDetails: "查看详情",
      tapToView: "点击查看详情",
      searchResults: "搜索结果",
      searchFor: "搜索:",
      productsFound: "找到的产品",
      profile: "个人资料",
      product: "产品",
      brand: "品牌",
      condition: "状况",
      shop: "商店"
    },
    hi: {
      appName: "एवेलो",
      searchPlaceholder: "उत्पाद, दुकानें, ब्रांड खोजें...",
      sellProducts: "अपने उत्पाद बेचें",
      signIn: "साइन इन",
      signUp: "पंजीकरण",
      signInToSell: "उत्पाद बेचने के लिए साइन इन करें",
      welcome: "एवेलो में आपका स्वागत है",
      browseProducts: "उत्पाद ब्राउज़ करें",
      myProducts: "मेरे उत्पाद",
      addProduct: "जोड़ें",
      help: "सहायता",
      logout: "लॉग आउट",
      home: "होम",
      shopNav: "दुकान",
      account: "खाता",
      helpCenter: "सहायता केंद्र",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "सभी उत्पाद",
      location: "स्थान",
      noProducts: "कोई उत्पाद नहीं मिला",
      clearSearch: "खोज साफ़ करें",
      viewDetails: "विवरण देखें",
      tapToView: "विवरण देखने के लिए टैप करें",
      searchResults: "खोज परिणाम",
      searchFor: "खोज:",
      productsFound: "उत्पाद मिले",
      profile: "प्रोफ़ाइल",
      product: "उत्पाद",
      brand: "ब्रांड",
      condition: "स्थिति",
      shop: "दुकान"
    },
    ru: {
      appName: "Availo",
      searchPlaceholder: "Поиск товаров, магазинов, брендов...",
      sellProducts: "Продавайте свои товары",
      signIn: "Войти",
      signUp: "Регистрация",
      signInToSell: "Войдите, чтобы продавать товары",
      welcome: "Добро пожаловать в Availo",
      browseProducts: "Просмотр товаров",
      myProducts: "Мои товары",
      addProduct: "Добавить",
      help: "Помощь",
      logout: "Выйти",
      home: "Главная",
      shopNav: "Магазин",
      account: "Аккаунт",
      helpCenter: "Центр помощи",
      language: "Язык",
      selectLanguage: "Выберите язык",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Все товары",
      location: "Местоположение",
      noProducts: "Товары не найдены",
      clearSearch: "Очистить поиск",
      viewDetails: "Посмотреть детали",
      tapToView: "Нажмите для просмотра",
      searchResults: "Результаты поиска",
      searchFor: "Поиск:",
      productsFound: "товаров найдено",
      profile: "Профиль",
      product: "Товар",
      brand: "Бренд",
      condition: "Состояние",
      shop: "Магазин"
    },
    de: {
      appName: "Availo",
      searchPlaceholder: "Produkte, Shops, Marken suchen...",
      sellProducts: "Verkaufen Sie Ihre Produkte",
      signIn: "Anmelden",
      signUp: "Registrieren",
      signInToSell: "Anmelden zum Verkauf",
      welcome: "Willkommen bei Availo",
      browseProducts: "Produkte durchsuchen",
      myProducts: "Meine Produkte",
      addProduct: "Hinzufügen",
      help: "Hilfe",
      logout: "Abmelden",
      home: "Startseite",
      shopNav: "Shop",
      account: "Konto",
      helpCenter: "Hilfezentrum",
      language: "Sprache",
      selectLanguage: "Sprache auswählen",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Alle Produkte",
      location: "Standort",
      noProducts: "Keine Produkte gefunden",
      clearSearch: "Suche löschen",
      viewDetails: "Details ansehen",
      tapToView: "Tippen für Details",
      searchResults: "Suchergebnisse",
      searchFor: "Suche nach:",
      productsFound: "Produkte gefunden",
      profile: "Profil",
      product: "Produkt",
      brand: "Marke",
      condition: "Zustand",
      shop: "Shop"
    },
    ja: {
      appName: "アバイロ",
      searchPlaceholder: "商品、店舗、ブランドを検索...",
      sellProducts: "商品を販売",
      signIn: "サインイン",
      signUp: "登録",
      signInToSell: "販売するにはサインイン",
      welcome: "アバイロへようこそ",
      browseProducts: "商品を閲覧",
      myProducts: "マイ商品",
      addProduct: "追加",
      help: "ヘルプ",
      logout: "ログアウト",
      home: "ホーム",
      shopNav: "ショップ",
      account: "アカウント",
      helpCenter: "ヘルプセンター",
      language: "言語",
      selectLanguage: "言語を選択",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "すべての商品",
      location: "場所",
      noProducts: "商品が見つかりません",
      clearSearch: "検索をクリア",
      viewDetails: "詳細を見る",
      tapToView: "タップして詳細",
      searchResults: "検索結果",
      searchFor: "検索:",
      productsFound: "件の商品が見つかりました",
      profile: "プロフィール",
      product: "商品",
      brand: "ブランド",
      condition: "状態",
      shop: "ショップ"
    },
    ko: {
      appName: "아바일로",
      searchPlaceholder: "제품, 상점, 브랜드 검색...",
      sellProducts: "제품 판매",
      signIn: "로그인",
      signUp: "회원가입",
      signInToSell: "판매하려면 로그인",
      welcome: "아바일로에 오신 것을 환영합니다",
      browseProducts: "제품 둘러보기",
      myProducts: "내 제품",
      addProduct: "추가",
      help: "도움말",
      logout: "로그아웃",
      home: "홈",
      shopNav: "상점",
      account: "계정",
      helpCenter: "고객센터",
      language: "언어",
      selectLanguage: "언어 선택",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "모든 제품",
      location: "위치",
      noProducts: "제품을 찾을 수 없습니다",
      clearSearch: "검색 지우기",
      viewDetails: "자세히 보기",
      tapToView: "탭하여 자세히 보기",
      searchResults: "검색 결과",
      searchFor: "검색:",
      productsFound: "개의 제품을 찾았습니다",
      profile: "프로필",
      product: "제품",
      brand: "브랜드",
      condition: "상태",
      shop: "상점"
    },
    it: {
      appName: "Availo",
      searchPlaceholder: "Cerca prodotti, negozi, marchi...",
      sellProducts: "Vendi i tuoi prodotti",
      signIn: "Accedi",
      signUp: "Registrati",
      signInToSell: "Accedi per vendere",
      welcome: "Benvenuto su Availo",
      browseProducts: "Sfoglia prodotti",
      myProducts: "I miei prodotti",
      addProduct: "Aggiungi",
      help: "Aiuto",
      logout: "Esci",
      home: "Home",
      shopNav: "Negozio",
      account: "Account",
      helpCenter: "Centro assistenza",
      language: "Lingua",
      selectLanguage: "Seleziona lingua",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Tutti i prodotti",
      location: "Posizione",
      noProducts: "Nessun prodotto trovato",
      clearSearch: "Cancella ricerca",
      viewDetails: "Visualizza dettagli",
      tapToView: "Tocca per dettagli",
      searchResults: "Risultati ricerca",
      searchFor: "Cerca:",
      productsFound: "prodotti trovati",
      profile: "Profilo",
      product: "Prodotto",
      brand: "Marca",
      condition: "Condizione",
      shop: "Negozio"
    },
    tr: {
      appName: "Availo",
      searchPlaceholder: "Ürün, mağaza, marka ara...",
      sellProducts: "Ürünlerinizi satın",
      signIn: "Giriş yap",
      signUp: "Kayıt ol",
      signInToSell: "Satış yapmak için giriş yapın",
      welcome: "Availo'ya hoş geldiniz",
      browseProducts: "Ürünleri keşfet",
      myProducts: "Ürünlerim",
      addProduct: "Ekle",
      help: "Yardım",
      logout: "Çıkış yap",
      home: "Ana Sayfa",
      shopNav: "Mağaza",
      account: "Hesap",
      helpCenter: "Yardım Merkezi",
      language: "Dil",
      selectLanguage: "Dil seçin",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Tüm ürünler",
      location: "Konum",
      noProducts: "Ürün bulunamadı",
      clearSearch: "Aramayı temizle",
      viewDetails: "Detayları görüntüle",
      tapToView: "Detaylar için dokunun",
      searchResults: "Arama sonuçları",
      searchFor: "Aranan:",
      productsFound: "ürün bulundu",
      profile: "Profil",
      product: "Ürün",
      brand: "Marka",
      condition: "Durum",
      shop: "Mağaza"
    },
    nl: {
      appName: "Availo",
      searchPlaceholder: "Zoek producten, winkels, merken...",
      sellProducts: "Verkoop uw producten",
      signIn: "Inloggen",
      signUp: "Registreren",
      signInToSell: "Log in om te verkopen",
      welcome: "Welkom bij Availo",
      browseProducts: "Blader door producten",
      myProducts: "Mijn producten",
      addProduct: "Toevoegen",
      help: "Hulp",
      logout: "Uitloggen",
      home: "Home",
      shopNav: "Winkel",
      account: "Account",
      helpCenter: "Hulpcentrum",
      language: "Taal",
      selectLanguage: "Selecteer taal",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Alle producten",
      location: "Locatie",
      noProducts: "Geen producten gevonden",
      clearSearch: "Zoekopdracht wissen",
      viewDetails: "Details bekijken",
      tapToView: "Tik voor details",
      searchResults: "Zoekresultaten",
      searchFor: "Zoeken naar:",
      productsFound: "producten gevonden",
      profile: "Profiel",
      product: "Product",
      brand: "Merk",
      condition: "Staat",
      shop: "Winkel"
    },
    pl: {
      appName: "Availo",
      searchPlaceholder: "Szukaj produktów, sklepów, marek...",
      sellProducts: "Sprzedawaj swoje produkty",
      signIn: "Zaloguj się",
      signUp: "Zarejestruj się",
      signInToSell: "Zaloguj się, aby sprzedawać",
      welcome: "Witaj w Availo",
      browseProducts: "Przeglądaj produkty",
      myProducts: "Moje produkty",
      addProduct: "Dodaj",
      help: "Pomoc",
      logout: "Wyloguj",
      home: "Strona główna",
      shopNav: "Sklep",
      account: "Konto",
      helpCenter: "Centrum pomocy",
      language: "Język",
      selectLanguage: "Wybierz język",
      swahili: "Kiswahili",
      english: "English",
      arabic: "العربية",
      french: "Français",
      spanish: "Español",
      portuguese: "Português",
      chinese: "中文",
      hindi: "हिन्दी",
      russian: "Русский",
      german: "Deutsch",
      japanese: "日本語",
      korean: "한국어",
      italian: "Italiano",
      turkish: "Türkçe",
      dutch: "Nederlands",
      polish: "Polski",
      allProducts: "Wszystkie produkty",
      location: "Lokalizacja",
      noProducts: "Nie znaleziono produktów",
      clearSearch: "Wyczyść wyszukiwanie",
      viewDetails: "Zobacz szczegóły",
      tapToView: "Dotknij, aby zobaczyć szczegóły",
      searchResults: "Wyniki wyszukiwania",
      searchFor: "Szukaj:",
      productsFound: "znalezionych produktów",
      profile: "Profil",
      product: "Produkt",
      brand: "Marka",
      condition: "Stan",
      shop: "Sklep"
    }
  };

  // ✅ SAFE: Get translations with fallback
  const t = translations[language] || translations.en;

  const navigate = useNavigate();

  // ✅ LOAD PRODUCTS - REAL PRODUCTS ONLY!
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        // TRY FETCH FROM BACKEND FIRST!
        apiClient.get('/api/products/')
          .then(response => {
            let realProducts = [];
            if (response.data && response.data.results) {
              realProducts = response.data.results;
            } else if (Array.isArray(response.data)) {
              realProducts = response.data;
            }
            
            console.log(`📦 Got ${realProducts.length} REAL products from API`);
            
            // 🗑️ FILTER OUT SAMPLE PRODUCTS
            realProducts = realProducts.filter(p => {
              const productName = (p.product_name || p.productName || '').toLowerCase().trim();
              const price = parseFloat(p.price) || 0;
              
              // List ya sample keywords
              const sampleKeywords = [
                '0tzs duka', '0 tzs duka', 'product', 'duka', 'shop',
                'sample', 'test', 'demo', 'example'
              ];
              
              // Check kama jina lina keywords yoyote
              for (const keyword of sampleKeywords) {
                if (productName.includes(keyword)) {
                  console.log(`🗑️ Filtering out sample product: "${productName}"`);
                  return false;
                }
              }
              
              // Check kama price ni 0 au chini ya 100
              if (price < 100) {
                console.log(`🗑️ Filtering out product with suspicious price ${price}: "${productName}"`);
                return false;
              }
              
              return true;
            });
            
            console.log(`🔥 AFTER FILTERING: ${realProducts.length} REAL products remain`);
            
            // ✅ ONLY REAL PRODUCTS - NO MIXING WITH SAMPLES!
            setProducts(realProducts);
            setFilteredProducts(realProducts);
            
            setIsLoading(false);
          })
          .catch(error => {
            console.error('❌ API error:', error);
            
            // ❌ NO FALLBACK TO SAMPLE PRODUCTS - SHOW EMPTY!
            setProducts([]);
            setFilteredProducts([]);
            setIsLoading(false);
          });
          
      } catch (error) {
        console.error("❌ Error loading products:", error);
        setProducts([]);
        setFilteredProducts([]);
        setIsLoading(false);
      }
    };

    loadProducts();
    
    // ❌ STORAGE LISTENER DISABLED - PREVENTS EXCESSIVE RELOADS
    // const handleStorageChange = (e) => { ... }
    // window.addEventListener('storage', handleStorageChange);
    
    // ❌ BROADCAST CHANNEL DISABLED - PREVENTS EXCESSIVE RELOADS
    // let channel = new BroadcastChannel('availo_sync');
    // channel.addEventListener('message', handleBroadcast);
    
    // Auto-refresh every 120 seconds (2 minutes) - REDUCED FREQUENCY
    const interval = setInterval(loadProducts, 120000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // ✅ AD CAROUSEL
  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
    }, 4000);
    return () => clearInterval(adInterval);
  }, []);

  // ✅ NAVBAR COLOR
  useEffect(() => {
    const currentAd = adSlides[currentAdIndex];
    if (currentAd) {
      setNavBarColor(currentAd.navColor);
      const brightness = getColorBrightness(currentAd.navColor);
      setNavTextColor(brightness > 128 ? "#000000" : "#ffffff");
    }
  }, [currentAdIndex]);

  // ✅ TOUCH DEVICE DETECTION
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // ✅ FILTER PRODUCTS
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const filterProducts = () => {
    let result = [...products];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        (product.product_name || product.productName || '').toLowerCase().includes(term) ||
        (product.shop_name || product.shopName || '').toLowerCase().includes(term) ||
        (product.brand || '').toLowerCase().includes(term) ||
        (product.main_category || product.mainCategory || '').toLowerCase().includes(term) ||
        (product.product_category || product.productCategory || '').toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  };

  // ✅ GET USER INITIAL
  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.name || user.displayName || user.email?.split('@')[0] || "User";
    return name.charAt(0).toUpperCase();
  };

  // ✅ GET PROFILE PICTURE from AuthContext
  const getProfilePictureUrl = () => {
    return getUserProfilePicture();
  };

  // ✅ PROFILE PICTURE COMPONENT
  const ProfileImage = ({ size = 35, showBorder = false }) => {
    const profileUrl = getProfilePictureUrl();
    const initial = getUserInitial();
    const [imgError, setImgError] = useState(false);

    if (user && profileUrl && !imgError && profileUrl !== 'null' && profileUrl !== 'undefined') {
      return (
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            border: showBorder ? "2px solid #FF6B6B" : "none",
            backgroundColor: "#dc3545",
            color: "white",
            fontWeight: "bold",
            fontSize: `${size * 0.4}px`,
            cursor: "pointer",
            flexShrink: 0
          }}
          onClick={handleProfilePictureClick}
        >
          <img 
            src={profileUrl} 
            alt={user?.name || "Profile"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
              console.log("Profile image failed to load, using fallback");
              setImgError(true);
            }}
          />
        </div>
      );
    }

    return (
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          border: showBorder ? "2px solid #FF6B6B" : "none",
          backgroundColor: user ? "#dc3545" : "#f0f0f0",
          color: user ? "white" : "#666",
          fontWeight: "bold",
          fontSize: `${size * 0.4}px`,
          cursor: "pointer",
          flexShrink: 0
        }}
        onClick={handleProfilePictureClick}
      >
        {user ? initial : <i className="fas fa-user" style={{ fontSize: `${size * 0.5}px` }}></i>}
      </div>
    );
  };

  // ✅ NAVIGATION HANDLERS
  const handleProductClick = (product) => {
    console.log("📦 Navigating to product:", product.id, product.product_name || product.productName);
    navigate(`/product/${product.id}`);
  };

  const handleLoginClick = () => {
    navigate("/vendor-login");
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleRegisterClick = () => {
    navigate("/vendor-register");
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  const handleLogout = () => {
    authLogout();
    navigate("/vendor-login");
  };

  const handleMyProductsClick = () => {
    if (user) {
      navigate("/seller-profile");
    } else {
      navigate("/vendor-login");
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  // ✅ FIXED: ADD PRODUCT BUTTON - CORRECT LOGIC!
  const handleAddProductClick = async () => {
    console.log("➕ Add Product clicked - User:", user?.email, "Logged in:", !!user);
    
    // CASE 1: HAKUNA USER - MPYA KABISA
    if (!user) {
      console.log("➡️ No user - NEW USER - Redirecting to login");
      navigate('/vendor-login', {
        state: {
          from: '/products',
          action: 'add-product-new-user',
          message: 'Please login to start selling'
        }
      });
      setShowMobileMenu(false);
      setShowLanguageSelector(false);
      return;
    }

    // ✅ DIRECT CHECK: Check if user is registered using the hook
    const isRegistered = isVendorRegistered(user.email);
    console.log("🔍 Vendor registration check (DIRECT):", { email: user.email, isRegistered });

    if (!isRegistered) {
      // CASE 2: AMEINGIA LAKINI HAJAJISAJILI - anza registration
      console.log("➡️ User logged in but NOT registered - Redirecting to vendor registration");
      navigate('/vendor-register', {
        state: {
          user: user,
          action: "register-vendor",
          message: "Please complete your vendor registration first",
          from: "/products"
        }
      });
    } else {
      // ✅ CASE 3: AMEINGIA NA AMEJISAJILI TAYARI - add product moja kwa moja!
      console.log("➡️ User IS registered - Redirecting directly to add product (NO LOGIN)");
      navigate('/vendor-register', {
        state: {
          user: user,
          action: "add-product", // ← MUHIMU SANA!
          message: "Add new product to your shop",
          from: "/products"
        }
      });
    }
    
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  // ✅ FIXED: Language change handler - ensures language stays selected
  const handleLanguageChange = (lang) => {
    console.log("🌐 Language changing to:", lang);
    
    // Update state first
    setLanguage(lang);
    
    // Then save to localStorage with try-catch
    try {
      localStorage.setItem('availoLanguage', lang);
      console.log("✅ Language saved to localStorage:", lang);
    } catch (error) {
      console.error("❌ Error saving language to localStorage:", error);
    }
    
    // Close language selector
    setShowLanguageSelector(false);
  };

  const handleProfilePictureClick = () => {
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
    setShowMobileMenu(false);
    setShowLanguageSelector(false);
  };

  // ✅ SEARCH HANDLERS
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
    
    if (value.trim().length > 0) {
      const term = value.toLowerCase();
      const suggestions = products
        .filter(p => (p.product_name || p.productName || '').toLowerCase().includes(term))
        .slice(0, 5)
        .map(p => ({
          type: "product",
          text: p.product_name || p.productName || 'Product',
          count: products.filter(prod => (prod.product_name || prod.productName) === (p.product_name || p.productName)).length
        }));
      setSearchSuggestions([...new Map(suggestions.map(item => [item.text, item])).values()]);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchInputFocused(true);
    if (searchTerm.trim().length > 0) setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setIsSearchInputFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setSearchSuggestions([]);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // ✅ FIXED: Suggestion click - Navigates to SearchResults
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    navigate(`/search-results?q=${encodeURIComponent(suggestion.text)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowSuggestions(false);
      if (searchTerm.trim() === "") return;
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchClick = () => {
    setShowSuggestions(false);
    if (searchTerm.trim() === "") return;
    navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
  };

  // ✅ Helper function to get suggestion type text
  const getSuggestionTypeText = (type) => {
    switch (type) {
      case "product": return t.product;
      default: return t.product;
    }
  };

  // ✅ CLICK OUTSIDE FOR SUGGESTIONS
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ BOTTOM NAVIGATION HANDLERS
  const handleHomeClick = () => navigate('/');
  const handleProductsClick = () => navigate('/products');
  const handleShopsClick = () => navigate('/shops');
  
  const handleAccountClick = () => {
    if (user) {
      navigate('/seller-profile');
    } else {
      navigate('/vendor-login');
    }
  };

  // ✅ HELPER FUNCTIONS
  const getColorBrightness = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const goToSlide = (index) => setCurrentAdIndex(index);
  const nextSlide = () => setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adSlides.length);
  const prevSlide = () => setCurrentAdIndex((prevIndex) => prevIndex === 0 ? adSlides.length - 1 : prevIndex - 1);

  const formatLocation = (product) => {
    const location = `${product.area || ''}, ${product.district || ''}, ${product.region || 'Tanzania'}`.replace(/^, |, $/g, '').replace(/^,|,$/g, '') || 'Tanzania';
    return location.length > 30 ? location.substring(0, 27) + '...' : location;
  };

  const worldLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  ];

  if (isLoading) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(0,0,0,0.1)",
            borderTop: "3px solid #FF6B6B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 15px"
          }}></div>
          <p style={{ color: "#5f6368", fontSize: "14px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentAd = adSlides[currentAdIndex];
  const textColor = navTextColor;

  return (
    <>
    <div style={{ 
      minHeight: "100vh", 
      background: "#f8f9fa",
      paddingBottom: isTouchDevice ? "80px" : "0"
    }}>
      {/* Navigation Bar */}
      <nav 
        className="navbar shadow-sm fixed-top py-2 navbar-light"
        style={{ 
          zIndex: 1000,
          backgroundColor: navBarColor,
          transition: 'background-color 0.8s ease-in-out',
          borderBottom: "none",
          margin: 0,
          padding: 0
        }}
      >
        <div className="container-fluid px-0" style={{ margin: 0, padding: 0 }}>
          {/* Mobile View */}
          <div className="d-flex d-lg-none align-items-center w-100 px-2" style={{ margin: 0, padding: "8px 0" }}>
            <Link 
              className="navbar-brand fw-bold me-2" 
              to="/" 
              style={{ 
                fontSize: "16px",
                color: textColor,
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColor, fontSize: "18px" }}></i>
              {t.appName}
            </Link>
            
            {/* Mobile Search */}
            <div className="flex-grow-1 mx-2" style={{ position: "relative" }}>
              <div className="search-container" style={{ width: "100%", position: "relative" }}>
                <div 
                  className={`search-input-wrapper ${isSearchInputFocused ? 'focused' : ''}`}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: isSearchInputFocused ? "25px" : "0",
                    backgroundColor: isSearchInputFocused 
                      ? (navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 12px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input-initial"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      color: textColor,
                      padding: "8px 0",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                  {searchTerm && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: "none",
                        border: "none",
                        color: textColor,
                        opacity: 0.7,
                        marginRight: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px"
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={handleSearchClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: textColor,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px"
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: isTouchDevice ? "fixed" : "absolute",
                      top: isTouchDevice ? "70px" : "100%",
                      left: isTouchDevice ? "10px" : 0,
                      right: isTouchDevice ? "10px" : 0,
                      width: isTouchDevice ? "calc(100% - 20px)" : "100%",
                      zIndex: 1001,
                      maxHeight: "300px",
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="dropdown-item d-flex align-items-center justify-content-between py-3 px-3 border-bottom"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backgroundColor: "transparent",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              textDecoration: "none",
                              color: "#212529"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="d-flex align-items-center w-100">
                              <i className="fas fa-box me-3 text-danger"></i>
                              <div className="d-flex flex-column w-100">
                                <div className="fw-medium">{suggestion.text}</div>
                                <small className="text-muted">
                                  {getSuggestionTypeText(suggestion.type)}
                                  {suggestion.count && ` • ${suggestion.count} ${t.products}`}
                                </small>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Buttons */}
            <div className="d-flex align-items-center ms-2" style={{ flexShrink: 0 }}>
              <button 
                className="btn"
                onClick={() => setShowLanguageSelector(true)}
                style={{ 
                  width: "36px", 
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  color: textColor,
                  padding: 0,
                  border: "none",
                  marginRight: "8px"
                }}
                title={t.language}
              >
                <i className="fas fa-globe" style={{ fontSize: "18px", color: textColor }}></i>
              </button>
              
              <button 
                className="btn"
                onClick={() => setShowMobileMenu(true)}
                style={{ 
                  width: "36px", 
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  color: textColor,
                  padding: 0,
                  border: "none"
                }}
                title="Menu"
              >
                <i className="fas fa-bars" style={{ fontSize: "18px", color: textColor }}></i>
              </button>
            </div>
          </div>
          
          {/* Desktop View */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between px-3">
            <Link 
              className="navbar-brand fw-bold" 
              to="/" 
              style={{ 
                fontSize: "18px",
                color: textColor,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i className="fas fa-shopping-cart me-2" style={{ color: textColor, fontSize: "20px" }}></i>
              {t.appName}
            </Link>
            
            {/* Desktop Search */}
            <div style={{ width: "400px", position: "relative" }}>
              <div className="search-container">
                <div 
                  className={`search-input-wrapper ${isSearchInputFocused ? 'focused' : ''}`}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: isSearchInputFocused ? "25px" : "0",
                    backgroundColor: isSearchInputFocused 
                      ? (navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                          ? "rgba(255,255,255,0.2)" 
                          : "rgba(0,0,0,0.1)") 
                      : "transparent",
                    border: isSearchInputFocused ? "none" : "none",
                    padding: isSearchInputFocused ? "0 16px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSearchInputFocused ? `inset 0 0 0 1px ${navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}` : "none"
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input-initial"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      color: textColor,
                      padding: "8px 0",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                  {searchTerm && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: "none",
                        border: "none",
                        color: textColor,
                        opacity: 0.7,
                        marginRight: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px"
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={handleSearchClick}
                    style={{
                      background: "none",
                      border: "none",
                      color: textColor,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px"
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                
                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="search-suggestions-dropdown"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1001,
                      maxHeight: "400px",
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      marginTop: "5px"
                    }}
                  >
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-0">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="dropdown-item d-flex align-items-center justify-content-between py-3 px-3 border-bottom"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backgroundColor: "transparent",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              textDecoration: "none",
                              color: "#212529"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="d-flex align-items-center w-100">
                              <i className="fas fa-box me-3 text-danger"></i>
                              <div className="d-flex flex-column w-100">
                                <div className="fw-medium">{suggestion.text}</div>
                                <small className="text-muted">
                                  {getSuggestionTypeText(suggestion.type)}
                                  {suggestion.count && ` • ${suggestion.count} ${t.products}`}
                                </small>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop Language Dropdown */}
            <div className="dropdown me-3">
              <button 
                className="btn btn-sm d-flex align-items-center"
                type="button" 
                data-bs-toggle="dropdown"
                style={{ 
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "13px",
                  backgroundColor: 'transparent',
                  color: textColor,
                  borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
              >
                <i className="fas fa-globe me-1" style={{ color: textColor }}></i>
                {language === 'sw' ? 'SW' : language === 'en' ? 'EN' : language === 'ar' ? 'AR' : language === 'fr' ? 'FR' : language === 'es' ? 'ES' : language === 'pt' ? 'PT' : language === 'zh' ? 'ZH' : language === 'hi' ? 'HI' : language === 'ru' ? 'RU' : language === 'de' ? 'DE' : language === 'ja' ? 'JA' : language === 'ko' ? 'KO' : language === 'it' ? 'IT' : language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : language === 'pl' ? 'PL' : 'EN'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button 
                    className={`dropdown-item ${language === 'sw' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('sw')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.swahili}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.english}
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ar' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ar')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.arabic}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'fr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('fr')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.french}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'es' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('es')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.spanish}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'pt' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pt')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.portuguese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'zh' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('zh')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.chinese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'hi' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('hi')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.hindi}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ru' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ru')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.russian}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'de' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('de')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.german}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ja' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ja')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.japanese}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'ko' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('ko')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.korean}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'it' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('it')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.italian}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'tr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('tr')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.turkish}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'nl' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('nl')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.dutch}
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${language === 'pl' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pl')}
                  >
                    <i className="fas fa-language me-2"></i>
                    {t.polish}
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Desktop User Button */}
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn d-flex align-items-center"
                  type="button" 
                  data-bs-toggle="dropdown"
                  style={{ 
                    borderRadius: "20px",
                    padding: "6px 15px",
                    fontSize: "14px",
                    backgroundColor: 'transparent',
                    color: textColor,
                    borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                  }}
                >
                  <ProfileImage size={35} />
                  <span style={{ fontSize: "14px", color: textColor, marginLeft: "8px" }}>{t.account}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text fw-bold">{t.welcome}, {user?.name || user?.displayName || user?.email?.split('@')[0] || "Seller"}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleMyProductsClick}>
                      <i className="fas fa-box me-2"></i>
                      {t.myProducts}
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleAddProductClick}>
                      <i className="fas fa-plus-circle me-2"></i>
                      {t.addProduct}
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      {t.logout}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button 
                className="btn d-flex align-items-center"
                onClick={handleLoginClick}
                style={{ 
                  borderRadius: "20px",
                  padding: "6px 15px",
                  fontSize: "14px",
                  transition: "all 0.8s ease",
                  backgroundColor: 'transparent',
                  color: textColor,
                  borderColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                    ? "rgba(255,255,255,0.2)" 
                    : "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                  style={{ 
                    width: "35px", 
                    height: "35px",
                    backgroundColor: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                      ? "rgba(255,255,255,0.9)" 
                      : navBarColor,
                    color: navBarColor === "#FF6B6B" || navBarColor === "#4ECDC4" || navBarColor === "#45B7D1" 
                      ? navBarColor 
                      : "white"
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: textColor }}>{t.signIn} ›</span>
                  <span style={{ fontSize: "11px", opacity: 0.8, color: textColor }}>{t.sellProducts}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Ad Carousel */}
      <div 
        className="container-fluid px-0" 
        style={{ 
          marginTop: isTouchDevice ? "70px" : "80px",
          paddingTop: "0",
          backgroundColor: navBarColor
        }}
      >
        <div className="row mx-0" style={{ margin: 0, padding: 0 }}>
          <div className="col-12 px-0" style={{ margin: 0, padding: 0 }}>
            <div className="ad-carousel-container" style={{ position: "relative", marginTop: "0", paddingTop: "0" }}>
              <div 
                className="ad-carousel-inner"
                style={{
                  height: isTouchDevice ? "200px" : "200px",
                  position: "relative",
                  overflow: "hidden",
                  margin: 0,
                  padding: 0
                }}
              >
                {adSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`ad-slide ${index === currentAdIndex ? 'active' : ''}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: index === currentAdIndex ? 1 : 0,
                      transition: 'opacity 0.8s ease-in-out',
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'white',
                      padding: '15px',
                      cursor: 'pointer',
                      margin: 0,
                      paddingTop: "0"
                    }}
                    onClick={() => window.open(slide.link, '_blank')}
                  >
                    <div className="ad-content" style={{ maxWidth: '600px' }}>
                      <h2 
                        className="fw-bold mb-2"
                        style={{ 
                          fontSize: isTouchDevice ? '20px' : '28px',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {slide.title}
                      </h2>
                      <p 
                        className="mb-3"
                        style={{ 
                          fontSize: isTouchDevice ? '14px' : '16px',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        {slide.description}
                      </p>
                      <button 
                        className="btn btn-light fw-bold"
                        style={{
                          padding: isTouchDevice ? '6px 15px' : '8px 20px',
                          borderRadius: '20px',
                          fontSize: isTouchDevice ? '12px' : '14px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(slide.link, '_blank');
                        }}
                      >
                        {t.shopNow} <i className="fas fa-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Navigation Arrows */}
              {!isTouchDevice && (
                <>
                  <button
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                    onClick={prevSlide}
                    style={{
                      marginLeft: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                    onClick={nextSlide}
                    style={{
                      marginRight: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex">
                {adSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`btn p-0 mx-1 ${index === currentAdIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: index === currentAdIndex ? '20px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: index === currentAdIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-fluid mb-5 px-2 px-lg-3" style={{ 
        paddingTop: isTouchDevice ? "10px" : "20px",
        paddingBottom: isTouchDevice ? "100px" : "20px"
      }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <div>
            <h1 className="fw-bold mb-2" style={{ color: "#333", fontSize: "24px" }}>
              {t.allProducts}
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              {filteredProducts.length} {t.productsFound}
              <span className="ms-2">•</span>
              <span className="ms-2">{t.tapToView}</span>
            </p>
          </div>
          
          {searchTerm && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleClearSearch}
              style={{ fontSize: "12px" }}
            >
              <i className="fas fa-times me-1"></i>
              {t.clearSearch}
            </button>
          )}
        </div>

        {/* ✅ PRODUCTS GRID - ALL PRODUCTS CLICKABLE */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">{t.noProducts}</h5>
            <p className="text-muted mb-4">
              {language === 'sw' ? 'Badilisha maneno ya utafutaji' : 'Try different search terms'}
            </p>
          </div>
        ) : (
          <div className="row g-2 g-md-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <div 
                  className="product-item"
                  style={{ 
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {/* PRODUCT IMAGE */}
                  <div style={{ 
                    width: "100%",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                    marginBottom: "8px"
                  }}>
                    <img 
                      src={(product.product_images || product.productImages)?.[0] || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      className="w-100 h-100"
                      alt={product.product_name || product.productName || 'Product'}
                      style={{ 
                        objectFit: "cover",
                        display: "block"
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                  
                  {/* PRODUCT DETAILS */}
                  <div style={{ 
                    padding: "0 4px",
                    backgroundColor: "transparent"
                  }}>
                    {/* PRODUCT NAME */}
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isTouchDevice ? "13px" : "14px",
                      fontWeight: "600",
                      color: "#333",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      <i className="fas fa-tag" style={{ 
                        fontSize: "11px", 
                        marginRight: "4px",
                        color: "#FF6B6B"
                      }}></i>
                      <span>{product.product_name || product.productName || 'Product'}</span>
                    </div>
                    
                    {/* PRICE */}
                    <div style={{ 
                      fontSize: isTouchDevice ? "13px" : "15px",
                      fontWeight: "bold",
                      color: "#FF6B6B",
                      marginBottom: "2px"
                    }}>
                      {parseInt(product.price).toLocaleString()} TZS
                    </div>
                    
                    {/* SHOP NAME */}
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isTouchDevice ? "10px" : "11px",
                      color: "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      <i className="fas fa-store" style={{ 
                        fontSize: "9px", 
                        marginRight: "4px",
                        color: "#888"
                      }}></i>
                      <span>{(product.shop_name || product.shopName) || t.shop}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      {isTouchDevice && (
        <div className="fixed-bottom bg-white shadow-lg border-top" style={{ 
          height: "60px",
          zIndex: 999,
          padding: "8px 0"
        }}>
          <div className="container">
            <div className="row">
              {/* Home */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleHomeClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-home" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.home}</small>
                </button>
              </div>
              
              {/* Products */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleProductsClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-box" style={{ fontSize: "18px", color: "#FF6B6B" }}></i>
                  <small style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: "bold" }}>
                    {t.products}
                  </small>
                </button>
              </div>
              
              {/* Add New - FIXED BUTTON */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAddProductClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-1" 
                       style={{ width: "36px", height: "36px", marginTop: "-10px" }}>
                    <i className="fas fa-plus" style={{ fontSize: "18px" }}></i>
                  </div>
                  <small style={{ fontSize: "10px", color: "#FF6B6B", fontWeight: "bold" }}>{t.addProduct}</small>
                </button>
              </div>
              
              {/* Shops */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleShopsClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <i className="fas fa-store" style={{ fontSize: "18px", color: "#666" }}></i>
                  <small style={{ fontSize: "10px", color: "#666" }}>{t.shopNav}</small>
                </button>
              </div>
              
              {/* Account */}
              <div className="col text-center">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={handleAccountClick}
                  style={{ 
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <ProfileImage size={30} showBorder={true} />
                  <small style={{ 
                    fontSize: "10px", 
                    color: user ? "#FF6B6B" : "#666",
                    fontWeight: user ? "bold" : "normal",
                    marginTop: "2px"
                  }}>
                    {t.account}
                  </small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div 
            className="mobile-backdrop show"
            onClick={() => setShowMobileMenu(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999
            }}
          ></div>
          
          <div 
            className="mobile-menu"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "280px",
              height: "100%",
              background: "white",
              zIndex: 1000,
              boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
              overflowY: "auto",
              animation: "slideInLeft 0.3s ease"
            }}
          >
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Menu</h6>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-3">
              {/* Language Selector */}
              <div className="mb-4">
                <label className="form-label fw-bold">{t.language}</label>
                <div className="btn-group w-100">
                  <button 
                    className={`btn ${language === 'sw' ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => handleLanguageChange('sw')}
                  >
                    {t.swahili}
                  </button>
                  <button 
                    className={`btn ${language === 'en' ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    {t.english}
                  </button>
                </div>
              </div>
              
              {/* User Section */}
              <div className="text-center mb-4">
                <ProfileImage size={80} showBorder={true} />
                
                {user ? (
                  <>
                    <h6 className="fw-bold mb-1 mt-2">{user?.name || user?.displayName || user?.email?.split('@')[0] || "Seller"}</h6>
                    <p className="text-muted small mb-3">{user?.email || "My Shop"}</p>
                  </>
                ) : (
                  <>
                    <h6 className="fw-bold mb-1 mt-2">{t.welcome}</h6>
                    <p className="text-muted small mb-3">{t.signInToSell}</p>
                  </>
                )}
              </div>
              
              {/* Menu Items */}
              <div className="list-group list-group-flush">
                {user ? (
                  <>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleMyProductsClick}
                    >
                      <i className="fas fa-box me-3 text-danger"></i>
                      {t.myProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleAddProductClick}
                    >
                      <i className="fas fa-plus-circle me-3 text-danger"></i>
                      {t.addProduct}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleProductsClick}
                    >
                      <i className="fas fa-store me-3 text-danger"></i>
                      {t.browseProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleShopsClick}
                    >
                      <i className="fas fa-store-alt me-3 text-danger"></i>
                      {t.shopsNav}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-3"></i>
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleLoginClick}
                    >
                      <i className="fas fa-sign-in-alt me-3 text-danger"></i>
                      {t.signIn}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleRegisterClick}
                    >
                      <i className="fas fa-user-plus me-3 text-danger"></i>
                      {t.signUp}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleProductsClick}
                    >
                      <i className="fas fa-store me-3 text-danger"></i>
                      {t.browseProducts}
                    </button>
                    <button 
                      className="list-group-item list-group-item-action border-0 py-3"
                      onClick={handleShopsClick}
                    >
                      <i className="fas fa-store-alt me-3 text-danger"></i>
                      {t.shopsNav}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ FIXED: Mobile Language Selector - WITH ALL LANGUAGES */}
      {showLanguageSelector && (
        <>
          <div 
            className="mobile-backdrop show"
            onClick={() => setShowLanguageSelector(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999
            }}
          ></div>
          
          <div 
            className="mobile-language-selector"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "280px",
              height: "100%",
              background: "white",
              zIndex: 1000,
              boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
              overflowY: "auto",
              animation: "slideInLeft 0.3s ease"
            }}
          >
            <div className="p-3 border-bottom bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">
                  <i className="fas fa-globe me-2"></i>
                  {t.selectLanguage}
                </h6>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => setShowLanguageSelector(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="list-group list-group-flush">
                {worldLanguages.map((lang) => (
                  <button 
                    key={lang.code}
                    className={`list-group-item list-group-item-action border-0 py-3 ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      console.log("🌐 Mobile language selector - changing to:", lang.code);
                      setLanguage(lang.code);
                      try {
                        localStorage.setItem('availoLanguage', lang.code);
                        console.log("✅ Language saved to localStorage:", lang.code);
                      } catch (error) {
                        console.error("❌ Error saving language:", error);
                      }
                      setShowLanguageSelector(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: language === lang.code ? "#f8f9fa" : "transparent",
                      borderLeft: language === lang.code ? "4px solid #FF6B6B" : "none"
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: "20px" }}>{lang.flag}</span>
                      <div className="text-start">
                        <div className="fw-medium">{lang.name}</div>
                        <small className="text-muted">{lang.code.toUpperCase()}</small>
                      </div>
                    </div>
                    {language === lang.code && (
                      <i className="fas fa-check text-danger"></i>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <div className="alert alert-info">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    {language === 'sw' 
                      ? 'Lugha itatumika kwa maonyesho yote ya mtandao' 
                      : language === 'ar' 
                      ? 'سيتم استخدام اللغة لجميع عروض الموقع'
                      : language === 'fr'
                      ? 'La langue sera utilisée pour tous les affichages du site'
                      : language === 'es'
                      ? 'El idioma se utilizará para todas las visualizaciones del sitio.'
                      : language === 'pt'
                      ? 'O idioma será usado para todas as exibições do site.'
                      : language === 'zh'
                      ? '语言将用于所有网站显示。'
                      : language === 'hi'
                      ? 'भाषा का उपयोग सभी वेबसाइट प्रदर्शन के लिए किया जाएगा।'
                      : language === 'ru'
                      ? 'Язык будет использоваться для всех отображений на сайте.'
                      : language === 'de'
                      ? 'Die Sprache wird für alle Website-Anzeigen verwendet.'
                      : language === 'ja'
                      ? '言語はすべてのウェブサイト表示に使用されます。'
                      : language === 'ko'
                      ? '언어는 모든 웹사이트 표시에 사용됩니다.'
                      : language === 'it'
                      ? 'La lingua sarà utilizzata per tutte le visualizzazioni del sito.'
                      : language === 'tr'
                      ? 'Dil, tüm web sitesi görünümlerinde kullanılacaktır.'
                      : language === 'nl'
                      ? 'De taal wordt gebruikt voor alle website-weergaven.'
                      : language === 'pl'
                      ? 'Język będzie używany do wszystkich wyświetleń na stronie.'
                      : 'Language will be used for all website displays'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Footer */}
      {!isTouchDevice && (
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>
                  <i className="fas fa-shopping-cart me-2"></i>
                  {t.appName} Marketplace
                </h5>
                <p className="text-light small" style={{ fontSize: "13px" }}>
                  {language === 'sw' 
                    ? "Pata kila unachohitaji kutoka kwa wauzaji wa kujiamini kote Tanzania." 
                    : "Find everything you need from trusted local sellers across Tanzania."}
                </p>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <button 
                      className="btn btn-link text-light text-decoration-none p-0"
                      onClick={handleRegisterClick}
                      style={{ fontSize: "13px" }}
                    >
                      <i className="fas fa-store me-1"></i> Become a Seller
                    </button>
                  </li>
                  <li className="mb-2">
                    <button 
                      className="btn btn-link text-light text-decoration-none p-0"
                      onClick={handleLoginClick}
                      style={{ fontSize: "13px" }}
                    >
                      <i className="fas fa-sign-in-alt me-1"></i> Seller Login
                    </button>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5 className="mb-3" style={{ fontSize: "16px" }}>Contact Us</h5>
                <ul className="list-unstyled">
                  <li className="mb-2" style={{ fontSize: "13px" }}>
                    <i className="fas fa-phone me-2"></i>
                    +255 754 AVAILO
                  </li>
                  <li className="mb-2" style={{ fontSize: "13px" }}>
                    <i className="fas fa-envelope me-2"></i>
                    support@availo.co.tz
                  </li>
                </ul>
              </div>
            </div>
            <hr className="bg-light my-4" />
            <div className="text-center">
              <small className="text-light" style={{ fontSize: "12px" }}>
                © {new Date().getFullYear()} {t.appName} Marketplace. All rights reserved.
              </small>
            </div>
          </div>
        </footer>
      )}
    </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <style>
        {`
          .product-item {
            background: transparent;
            border: none;
            box-shadow: none;
            transition: opacity 0.2s ease;
          }
          
          .product-item:hover {
            opacity: 0.9;
          }
          
          .product-item:active {
            opacity: 0.8;
          }
          
          .product-item img {
            border-radius: 0 !important;
          }
          
          .row.g-2, .row.g-md-3 {
            margin-left: -8px;
            margin-right: -8px;
          }
          
          .row.g-2 > div, .row.g-md-3 > div {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;
          }
          
          @media (min-width: 992px) {
            .col-lg-3 {
              flex: 0 0 25%;
              max-width: 25%;
            }
          }
          
          @media (min-width: 768px) and (max-width: 991px) {
            .col-md-4 {
              flex: 0 0 33.333333%;
              max-width: 33.333333%;
            }
          }
          
          @media (max-width: 767px) {
            .col-6 {
              flex: 0 0 50%;
              max-width: 50%;
            }
            
            .row.g-2 > div {
              padding-left: 6px;
              padding-right: 6px;
              padding-bottom: 12px;
            }
          }
          
          .search-input-wrapper {
            position: relative;
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            border-radius: 0;
            background-color: transparent;
            border: none;
            padding: 0;
            transition: all 0.3s ease;
          }
          
          .search-input-wrapper.focused {
            border-radius: 25px !important;
            background-color: rgba(0,0,0,0.1) !important;
            padding: 0 16px !important;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1) !important;
          }
          
          .search-input-initial {
            flex: 1;
            border: none;
            outline: none;
            background-color: transparent;
            font-size: 14px;
            color: inherit;
            padding: 8px 0;
            width: 100%;
            height: 100%;
          }
          
          .search-input-wrapper input::placeholder {
            color: inherit;
            opacity: 0.7;
          }
          
          .search-container {
            position: relative;
            width: 100%;
          }
          
          .search-suggestions-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1001;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            background-color: #ffffff;
            margin-top: 5px;
          }
          
          .suggestion-item {
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .suggestion-item:hover {
            background-color: #f8f9fa;
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0.4; }
            to { opacity: 1; }
          }
          
          .ad-slide.active {
            animation: fadeIn 0.8s ease-in-out;
          }
          
          @media (max-width: 768px) {
            .ad-carousel-inner {
              height: 200px !important;
            }
            .ad-content h2 {
              font-size: 18px !important;
            }
            .ad-content p {
              font-size: 12px !important;
            }
            .ad-content .btn {
              padding: 5px 12px !important;
              font-size: 11px !important;
            }
          }
          
          .btn-danger {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            border: none;
          }
          
          .btn-danger:hover {
            background: linear-gradient(135deg, #FF8E53, #FF6B6B);
          }
          
          .fixed-bottom .btn-link.active i,
          .fixed-bottom .btn-link.active small {
            color: #FF6B6B !important;
          }
          
          html, body {
            max-width: 100%;
            overflow-x: hidden;
          }
          
          input, select, textarea {
            font-size: 16px !important;
          }
          
          .navbar {
            transition: background-color 0.8s ease-in-out, color 0.8s ease-in-out;
          }
          
          .mobile-language-selector {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100%;
            background: white;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            animation: slideInLeft 0.3s ease;
          }

          .mobile-language-selector .list-group-item.active {
            background-color: rgba(255, 107, 107, 0.1);
            border-left: 4px solid #FF6B6B;
          }

          .mobile-language-selector .list-group-item:hover {
            background-color: #f8f9fa;
          }

          @media (max-width: 991px) {
            .search-suggestions-dropdown {
              position: fixed !important;
              top: 120px !important;
              left: 15px !important;
              right: 15px !important;
              width: auto !important;
              max-height: 60vh;
            }
          }

          @media (min-width: 992px) {
            .search-suggestions-dropdown {
              position: absolute !important;
              top: 100% !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
            }
          }
          
          .fixed-bottom .btn-link {
            cursor: pointer !important;
          }
          
          .fixed-bottom .btn-link:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </>
  );
}

export default Products;