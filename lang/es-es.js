const brunch = {
  withTv: 'XAPTV',
  without: 'XAPTV',
  attach: 'XAPTV',
  attachNoMaj: 'XAPTV',
}

export default {
  resellers: {
    existing: 'Revendedor existente',
    resellerEmail: 'DIRECCIÓN DE CORREO ELECTRÓNICO DEL DISTRIBUIDOR',
    confirmPass: 'CONFIRMAR CONTRASEÑA',
    newReseller: 'Configuración de un nuevo distribuidor',
    free: 'GRATIS',
    product: {
      bonus: 'Bono',
    },
    includes: {
      list: {
        1: 'Panel del distribuidor',
        2: 'Acceso API',
        3: 'DNS personalizado',
        4: 'Asistencia VIP 24/7',
        5: 'Cuentas de prueba gratuitas',
        6: 'Protección de datos',
      },
    },
    changeEmail: 'Actualización',
    success: {
      titles: {
        1: 'URL de su panel de revendedor',
        2: 'Su revendedor TOP-UP Checkout',
      },
      button: 'ABRIR URL',
    },
    error: {
      notExisting:
        'Esta cuenta no está vinculada a ninguna cuenta de revendedor.',
      existing: 'Esta cuenta ya está vinculada a una cuenta de revendedor.',
    },
  },
  currency: {
    id: '2',
    style: 'currency',
    currency: 'EUR',
    symbole: '€',
  },
  title: {
    home: brunch.withTv + ' - El mejor proveedor de TV de España',
    checkout: brunch.withTv + ' - Checkout',
    payment: brunch.withTv + ' - Payment',
    success: brunch.withTv + ' - Success',
  },
  success: {
    welcome: 'Bienvenido a la familia ' + brunch.withTv + ' 🎉',
    description:
      'Debajo encontrará su información de inicio de sesión de IPTV, insértelos en su aplicación de IPTV favorita o utilícelos para conectar nuestro Web TV Player, si necesita ayuda, envíenos un correo electrónico a',
    label: {
      server: 'NOMBRE DE HOST DEL SERVIDOR',
      username: 'NOMBRE DE USUARIO',
      password: 'CONTRASEÑA',
      url: 'URL de M3U',
      hostname: 'NOMBRE DE HOST DEL SERVIDOR',
      macaddress: 'MAC',
    },
    button: {
      download: 'DESCARGAR M3U',
      login: 'Inicie sesión en su panel de control del cliente',
      add: 'AÑADIR MAC',
      update: 'ACTUALIZAR MAC',
      success: '¡ÉXITO!!',
      failed: 'FALLADO!!',
    },
    setup: 'Configuración del dispositivo MAG',
    recommanded: 'Nuestras Aplicaciones Recomendadas ❤️',
    manage:
      'Para administrar su suscripción, puede iniciar sesión en el panel de control de nuestro cliente haciendo clic en el botón a continuación',
    notice:
      'Necesitará su dirección de correo electrónico y la contraseña que eligió durante el registro para iniciar sesión.',
    m3u: 'M3U URL',
    xtream: 'XTREAM API DETALLES DE ACCESO',
    mag: 'Configuración del dispositivo MAG',
    utilite: {
      openTicket: 'Contacte al Soporte',
      reportChannel: 'Problema de Canal',
      membersArea: 'Área de Miembros',
      extraConnection: 'Dispositivo adicional',
    },
  },
  checkout: {
    monthPass: 'Mes Pase',
    monthsPass: 'Meses Pase',
    choose: 'Elija su plan',
    off: 'DE DESCUENTO HOY',
    lastSold: 'último vendido',
    ago: 'hace',
    perMonth: 'por mes',
    save: 'Ahorre',
    optionalAddons: 'Complementos Opcionales',
    guaranteeBack: '-day money-back guarantee',
    extraConnection: {
      title: 'Dispositivo adicional',
      description: {
        pid: 'Varios dispositivos al mismo tiempo',
        noPid: 'Use su IPTV en múltiples dispositivos al mismo tiempo',
      },
    },
    proxyProtection: {
      title: 'Protección del proxy',
      description: {
        pid: 'Proteja su privacidad',
        noPid:
          'Proxy incorporado para ocultar el tráfico a su ISP y proteger su privacidad',
      },
    },
    promoCode: 'Have Promo Code? Click Here',
    month: 'mes',
    selectPayment: 'Seleccionar método de pago',
    emailAddress: {
      label: 'CORREO ELECTRÓNICO',
      placeholder: 'Tu Correo Electrónico',
    },
    password: {
      label: 'CONTRASEÑA',
      placeholder: 'Debe tener más de 8 caracteres',
    },
    moneyBack:
      'Estás 100% respaldado por nuestra garantía de devolución de dinero de 30 días.',
    total: 'Total',
    continue: 'SEGUIR',
    discount: {
      placeholder: 'Código Promo',
    },
    gateway: {
      credit: 'Tarjeta de crédito | Tarjeta de crédito #{count}',
      crypto: 'Criptomoneda',
    },
    apply: 'Aplicar',
    includes: {
      title: 'Tu plan incluye:',
      list: {
        1: 'Acceso a 9000+ canales de TV',
        2: 'Miles de películas y series',
        3: 'Configuración sencilla en todos sus dispositivos',
        4: 'Entrega instantánea',
        5: 'Atención al cliente gratuita',
        6: 'Garantía de devolución de dinero',
      },
    },
  },
  waiting: {
    awaiting: 'Esperando pago…',
    orderFraud:
      'Su pedido ha sido marcado como fraude. ¡Inténtelo de nuevo o contáctenos!',
    orderid: 'Solicitar ID',
    package: 'Plan',
    price: 'Precio',
    cancelOrder: 'Cancelar orden',
  },
}
