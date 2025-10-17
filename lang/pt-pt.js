const brunch = {
  withTv: 'XAPTV',
  without: 'XAPTV',
  attach: 'XAPTV',
  attachNoMaj: 'XAPTV',
}

export default {
  resellers: {
    existing: 'Existing Reseller',
    resellerEmail: 'RESELLER EMAIL ADDRESS',
    confirmPass: 'CONFIRM PASSWORD',
    newReseller: 'New Reseller Setup',
    free: 'FREE',
    product: {
      bonus: 'Bonus',
    },
    includes: {
      list: {
        1: 'Reseller Dashboard',
        2: 'API Access',
        3: 'Custom DNS',
        4: '24/7 VIP Support',
        5: 'Free  Trial Accounts',
        6: 'Data Privacy',
      },
    },
    changeEmail: 'Update',
    success: {
      titles: {
        1: 'Your Reseller Dashboard URL',
        2: 'Your reseller TOP-UP Checkout',
      },
      button: 'OPEN URL',
    },
    error: {
      notExisting: 'This account is not linked to any reseller account.',
      existing: 'This account is already linked to a reseller account.',
    },
  },
  currency: {
    id: '2',
    style: 'currency',
    currency: 'EUR',
    symbole: '€',
  },
  title: {
    home: 'XAPTV IPTV Teste 2025 - Streaming HD Grátis | Melhor Serviço IPTV',
    checkout: 'XAPTV IPTV Teste 2025 - Streaming HD Grátis | Melhor Serviço IPTV',
    payment: 'XAPTV IPTV Pagamento - Checkout Seguro | Melhor Serviço IPTV 2025',
    success: 'XAPTV IPTV Sucesso - Bem-vindo ao Streaming Premium | Melhor IPTV 2025',
  },
  seo: {
    description: 'Teste XAPTV IPTV grátis! Acesso instantâneo a 10.000+ canais de TV, filmes e séries em HD. Sem cartão de crédito. Melhor teste IPTV 2025 com suporte 24/7.',
    keywords: 'IPTV teste, IPTV teste grátis, melhor IPTV 2025, serviço IPTV, streaming TV, canais HD, IPTV Portugal, IPTV Brasil, IPTV Europa, IPTV streaming, TV ao vivo, IPTV premium, assinatura IPTV',
    ogTitle: 'XAPTV IPTV Teste 2025 - Streaming HD Grátis | Melhor Serviço IPTV',
    ogDescription: 'Teste XAPTV IPTV grátis! Acesso instantâneo a 10.000+ canais de TV, filmes e séries em HD. Sem cartão de crédito.',
    twitterTitle: 'XAPTV IPTV Teste 2025 - Streaming HD Grátis',
    twitterDescription: 'Teste XAPTV IPTV grátis! 10.000+ canais de TV, filmes e séries em HD. Sem cartão de crédito.',
  },
  success: {
    welcome: 'Bem-vindo a ' + brunch.withTv + ' Família 🎉',
    description:
      'Abaixo da sua informação de login IPTV, por favor insira-os na sua aplicação IPTV favorita, ou use-os para ligar o nosso Web TV Player, se precisar de algum apoio, basta enviar-nos um e-mail para',
    label: {
      server: 'HOSTNAME',
      username: 'USERNAME',
      password: 'PASSWORD',
      url: 'URL M3U',
      hostname: 'URL PORTAL',
      macaddress: 'MAC ADDRESS',
    },
    button: {
      download: 'DESCOBRIR M3U',
      login: 'Login no seu Painel de Clientes',
      add: 'ADD MAC',
      update: 'ACTUALIZAR MAC',
      success: 'SUCESSO!',
      failed: 'FALHADO!',
    },
    setup: 'Configuração do dispositivo MAG',
    recommanded: 'As nossas aplicações recomendadas ❤️',
    manage:
      'Para gerir a sua subscrição, pode entrar no painel de controlo dos nossos clientes clicando no botão abaixo',
    notice:
      'Vai precisar do seu endereço de correio electrónico e da palavra-passe que escolher durante a inscrição para iniciar sessão.',
    m3u: 'M3U URL',
    xtream: 'DETALHES DE LOGIN XTREAM API',
    mag: 'Configuração do dispositivo MAG',
    utilite: {
      openTicket: 'Apoio ao Contacto',
      reportChannel: 'Canal de reportagem',
      membersArea: 'Área de Membros',
      extraConnection: 'Ligação Extra',
    },
  },
  checkout: {
    monthPass: 'Mês Passe',
    monthsPass: 'Meses Passe',
    choose: 'Escolha o seu plano',
    off: 'DE DESCONTO HOJE',
    lastSold: 'Último Vendido',
    ago: 'atrás',
    perMonth: 'por mês',
    save: 'Poupe',
    optionalAddons: 'Adicionais opcionais',
    guaranteeBack: '-dias de garantia de devolução do dinheiro',
    extraConnection: {
      title: 'Conexão Extra',
      description: {
        pid: 'Múltiplos dispositivos ao mesmo tempo',
        noPid: 'Utilize a sua IPTV em múltiplos dispositivos ao mesmo tempo',
      },
    },
    connectionSelector: {
      title: 'Número de Conexões',
      description: 'Escolha quantas conexões simultâneas precisa',
      connections: 'Conexões',
    },
    proxyProtection: {
      title: 'Protecção por procuração',
      description: {
        pid: 'Proteja a sua privacidade',
        noPid:
          'Proxy incorporado para esconder o tráfego ao seu ISP e proteger a sua privacidade',
      },
    },
    promoCode: 'Tem Código Promocional? Clique aqui',
    month: 'mês',
    selectPayment: 'Seleccione o Método de Pagamento',
    emailAddress: {
      label: 'E-MAIL',
      placeholder: 'O seu endereço de correio electrónico',
    },
    password: {
      label: 'PALAVRA-PASSE',
      placeholder: 'Deve ter mais de 8 caracteres',
    },
    moneyBack:
      'É 100% apoiado pela nossa garantia de 30 dias de devolução do dinheiro.',
    total: 'Total',
    continue: 'CONTINUA',
    discount: {
      placeholder: 'Código Promocional',
    },
    gateway: {
      credit: 'Cartão de crédito | Cartão de crédito #{count}',
      crypto: 'Criptocurrency',
    },
    apply: 'Aplicar',
    includes: {
      title: 'O seu plano inclui:',
      list: {
        1: 'Acesso a mais de 6000 TV Canais',
        2: 'Milhares de Filmes & Séries',
        3: 'Configuração Fácil em Todos os seus Dispositivos',
        4: 'Entrega imediata',
        5: 'Apoio ao Cliente Gratuito',
        6: 'Money-Back Guarantee',
      },
    },
  },
  waiting: {
    awaiting: 'À espera de pagamento...',
    orderFraud:
      'A sua encomenda foi assinalada como fraude. Por favor, tente novamente ou contacte-nos!',
    orderid: 'ID do pedido',
    package: 'Pacote',
    price: 'Preço',
    cancelOrder: 'Cancelar encomenda',
  },
}
