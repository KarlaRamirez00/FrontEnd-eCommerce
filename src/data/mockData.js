// Aquí poníamos datos ficticios para rellenar, pero ahora no se usa porque conectamos con el backend

const categoriasMock = [
  {
    id: 1,
    nombre: "Tecnología",
    subcategorias: [
      {
        id: 10,
        nombre: "Smartphones",
        productos: [
          { id: 101, nombre: "Samsung Galaxy S24 Ultra", precio: 899990 },
          { id: 102, nombre: "iPhone 15 Pro Max", precio: 929990 },
          { id: 103, nombre: "Xiaomi 14 Pro", precio: 299990 },
          { id: 104, nombre: "Google Pixel 8 Pro", precio: 249990 },
          { id: 105, nombre: "Motorola Edge 50 Pro", precio: 499990 },
          { id: 106, nombre: "Huawei Pura 70 Pro", precio: 699990 },
          { id: 107, nombre: "Samsung Galaxy A55", precio: 449990 },
          { id: 108, nombre: "Xiaomi Redmi Note 13 Pro+", precio: 259990 },
          { id: 109, nombre: "Motorola Moto G Power (2024)", precio: 189990 },
          { id: 110, nombre: "Huawei Nova 12 SE", precio: 429990 },
        ],
      },
      {
        id: 11,
        nombre: "Impresoras",
        productos: [
          { id: 111, nombre: "HP Smart Tank 515", precio: 229990 },
          { id: 112, nombre: "Epson EcoTank L3250", precio: 199990 },
          { id: 113, nombre: "Brother DCP-T420W", precio: 179990 },
          { id: 114, nombre: "HP LaserJet Pro M1132", precio: 149990 },
          { id: 115, nombre: "Epson WorkForce WF-C5290", precio: 459990 },
          { id: 116, nombre: "Brother MFC-L2750DW", precio: 289990 },
          { id: 117, nombre: "HP OfficeJet Pro 9015e", precio: 349990 },
          {
            id: 118,
            nombre: "Epson Expression Premium XP-6100",
            precio: 219990,
          },
          { id: 119, nombre: "Brother HL-L2350DW", precio: 159990 },
          { id: 120, nombre: "HP DeskJet Ink Advantage 2775", precio: 99990 },
        ],
      },
      {
        id: 12,
        nombre: "Notebooks",
        productos: [
          { id: 121, nombre: "Apple MacBook Air (M3, 2024)", precio: 1299990 },
          { id: 122, nombre: "HP Spectre x360 14", precio: 1499990 },
          {
            id: 123,
            nombre: "Lenovo Yoga Slim 7i Carbon Gen 9",
            precio: 1199990,
          },
          { id: 124, nombre: "Dell XPS 15 (9530)", precio: 1699990 },
          { id: 125, nombre: "ASUS Zenbook 14 OLED (UX3404)", precio: 1099990 },
          { id: 126, nombre: "Acer Swift Go 14", precio: 899990 },
          { id: 127, nombre: "HP Pavilion Aero 13", precio: 799990 },
          { id: 128, nombre: "Lenovo IdeaPad 5i", precio: 699990 },
          { id: 129, nombre: "ASUS Vivobook 15 OLED (K3504)", precio: 749990 },
          { id: 130, nombre: "Acer Aspire 5", precio: 599990 },
        ],
      },
      {
        id: 13,
        nombre: "Accesorios Tecnología",
        productos: [
          { id: 131, nombre: "Base Carga Inalámbrica", precio: 29990 },
          { id: 132, nombre: "Power Bank 10000mAh", precio: 34990 },
          { id: 133, nombre: "Protector Pantalla Vidrio", precio: 9990 },
          { id: 134, nombre: "Kit Limpieza Pantallas", precio: 7990 },
          { id: 135, nombre: "Funda Notebook Zip 16", precio: 20990 },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: "Audio",
    subcategorias: [
      {
        id: 20,
        nombre: "Audífonos",
        productos: [
          {
            id: 201,
            nombre: "Sony WH-1000XM5 Noise Cancelling",
            precio: 349990,
          },
          { id: 202, nombre: "Logitech G Pro X Gamer", precio: 129990 },
          { id: 203, nombre: "Sennheiser HD 599 Hi-Fi", precio: 179990 },
          { id: 204, nombre: "Apple AirPods Pro (2da Gen)", precio: 279990 },
          {
            id: 205,
            nombre: "HyperX Cloud II Gamer Alámbricos",
            precio: 89990,
          },
          { id: 206, nombre: "JBL Tune 770NC Over-Ear", precio: 99990 },
          { id: 207, nombre: "Razer BlackShark V2 X Gamer", precio: 59990 },
          { id: 208, nombre: "Bose QC SE Noise Cancelling", precio: 299990 },
          {
            id: 209,
            nombre: "Audio-Technica ATH-M50x Monitoreo",
            precio: 159990,
          },
          { id: 210, nombre: "Samsung Galaxy Buds FE", precio: 79990 },
        ],
      },
      {
        id: 21,
        nombre: "Parlantes",
        productos: [
          { id: 211, nombre: "JBL Flip 6 Portátil Bluetooth", precio: 79990 },
          { id: 212, nombre: "Sony SRS-XB13 Extra Bass", precio: 44990 },
          { id: 213, nombre: "Bose SoundLink Flex Bluetooth", precio: 129990 },
          { id: 214, nombre: "Ultimate Ears Wonderboom 3", precio: 69990 },
          { id: 215, nombre: "Sonos Roam SL Portátil Wifi", precio: 199990 },
          { id: 216, nombre: "Tribit XSound Go Bluetooth", precio: 34990 },
          { id: 217, nombre: "Anker Soundcore 3 Bluetooth", precio: 54990 },
          { id: 218, nombre: "Marshall Emberton II Portátil", precio: 159990 },
        ],
      },
    ],
  },
  {
    id: 3,
    nombre: "Periféricos",
    subcategorias: [
      {
        id: 30,
        nombre: "Teclados",
        productos: [
          { id: 301, nombre: "Logitech Ergo K860 Ergonómico", precio: 129990 },
          { id: 302, nombre: "Corsair K70 RGB MK.2 Mecánico", precio: 189990 },
          {
            id: 303,
            nombre: "Logitech G915 Lightspeed Inalámbrico",
            precio: 219990,
          },
          {
            id: 304,
            nombre: "Microsoft Sculpt Ergonómico Inalámbrico",
            precio: 89990,
          },
          {
            id: 305,
            nombre: "Redragon K552 Kumara USB Compacto",
            precio: 49990,
          },
          { id: 306, nombre: "Keychron K2 Pro Inalámbrico", precio: 149990 },
          {
            id: 307,
            nombre: "HP HyperX Alloy Origins Mecánico",
            precio: 119990,
          },
          { id: 308, nombre: "Logitech MX Keys Inalámbrico", precio: 99990 },
        ],
      },
      {
        id: 31,
        nombre: "Mouses",
        productos: [
          { id: 311, nombre: "Logitech G Pro X Superlight", precio: 159990 },
          { id: 312, nombre: "Razer DeathAdder V2 Mini", precio: 49990 },
          {
            id: 313,
            nombre: "Logitech MX Master 3S Inalámbrico",
            precio: 99990,
          },
          { id: 314, nombre: "Corsair Harpoon RGB Wireless", precio: 69990 },
          { id: 315, nombre: "Razer Basilisk V3 Chroma", precio: 79990 },
          {
            id: 316,
            nombre: "Anker Vertical Ergonómico Inalámbrico",
            precio: 39990,
          },
          { id: 317, nombre: "SteelSeries Rival 3 Gamer", precio: 34990 },
          {
            id: 318,
            nombre: "Microsoft Bluetooth Ergonomic Mouse",
            precio: 59990,
          },
        ],
      },
      {
        id: 32,
        nombre: "Micrófonos",
        productos: [
          { id: 321, nombre: "Blue Yeti USB Versátil", precio: 149990 },
          { id: 322, nombre: "Rode Lavalier GO Inalámbrico", precio: 219990 },
          { id: 323, nombre: "HyperX SoloCast USB", precio: 69990 },
          { id: 324, nombre: "Shure SM58 Vocal Dinámico", precio: 99990 },
          { id: 325, nombre: "Fifine K669B USB Condensador", precio: 49990 },
          { id: 326, nombre: "Boya BY-M1 Solapa Universal", precio: 24990 },
          {
            id: 327,
            nombre: "Audio-Technica AT2020 Condensador",
            precio: 129990,
          },
          { id: 328, nombre: "Samson Q2U USB/XLR", precio: 89990 },
        ],
      },
    ],
  },

  {
    id: 4,
    nombre: "Accesorios Varios",
    subcategorias: [
      {
        id: 40,
        nombre: "Cables",
        productos: [
          { id: 401, nombre: "USB-C a USB-C Carga Rápida", precio: 9990 },
          { id: 402, nombre: "HDMI 2.1 8K Ultra HD", precio: 12990 },
          { id: 403, nombre: "USB-A a USB-C 3.1", precio: 7990 },
          { id: 404, nombre: "DisplayPort a DisplayPort 1.4", precio: 11990 },
          { id: 405, nombre: "Cable Ethernet Cat 6A", precio: 6990 },
          { id: 406, nombre: "USB-C a Lightning Carga", precio: 14990 },
          { id: 407, nombre: "Cable de Poder Notebook", precio: 8990 },
          { id: 408, nombre: "Cable SATA Datos Interno", precio: 5990 },
          { id: 409, nombre: "Adaptador USB 3.0 Extensión", precio: 6990 },
          { id: 410, nombre: "Cable Audio Jack 3.5mm", precio: 4990 },
        ],
      },
      {
        id: 41,
        nombre: "Adaptadores",
        productos: [
          {
            id: 411,
            nombre: "Adaptador USB 3.0 a Gigabit Ethernet",
            precio: 15990,
          },
          {
            id: 412,
            nombre: "Adaptador Mini DisplayPort a HDMI 4K",
            precio: 18990,
          },
          { id: 413, nombre: "Adaptador USB-C a USB-A 3.0", precio: 11990 },
          { id: 414, nombre: "Adaptador HDMI a VGA con Audio", precio: 19990 },
          { id: 415, nombre: "Adaptador USB-C a Jack 3.5mm", precio: 13990 },
          { id: 416, nombre: "Adaptador DisplayPort a DVI", precio: 16990 },
          {
            id: 417,
            nombre: "Adaptador USB-C Hub Multiport 6 en 1",
            precio: 29990,
          },
          {
            id: 418,
            nombre: "Adaptador Alimentación CA Universal",
            precio: 24990,
          },
        ],
      },
      {
        id: 42,
        nombre: "Soportes",
        productos: [
          { id: 421, nombre: "Soporte Ajustable para Tablet", precio: 12990 },
          {
            id: 422,
            nombre: "Soporte Magnético para Smartphone Auto",
            precio: 9990,
          },
          {
            id: 423,
            nombre: "Soporte Ergonómico para Notebook",
            precio: 19990,
          },
          {
            id: 424,
            nombre: "Soporte de Escritorio para Monitor",
            precio: 25990,
          },
          {
            id: 425,
            nombre: "Soporte Universal para Audífonos",
            precio: 14990,
          },
          {
            id: 426,
            nombre: "Soporte con Carga Inalámbrica Smartphone",
            precio: 22990,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    nombre: "Gaming",
    subcategorias: [
      {
        id: 50,
        nombre: "Consolas",
        productos: [
          { id: 501, nombre: "PlayStation 5", precio: 649990 },
          { id: 502, nombre: "Xbox Series X", precio: 629990 },
          { id: 503, nombre: "Nintendo Switch OLED", precio: 389990 },
        ],
      },
      {
        id: 51,
        nombre: "Accesorios Gamer",
        productos: [
          { id: 511, nombre: "Control PS5", precio: 59990 },
          { id: 512, nombre: "Silla Gamer Ergonómica", precio: 139990 },
          { id: 513, nombre: "Auriculares Gamer RGB", precio: 45990 },
        ],
      },
    ],
  },
  {
    id: 6,
    nombre: "Domótica",
    subcategorias: [
      {
        id: 60,
        nombre: "Iluminación",
        productos: [
          { id: 601, nombre: "Ampolleta WiFi RGB Inteligente", precio: 16990 },
          { id: 602, nombre: "Tira LED Inteligente 2m RGB", precio: 19990 },
          { id: 603, nombre: "Pack 2 Ampolletas Inteligentes", precio: 24990 },
          { id: 604, nombre: "Lámpara de Mesa Inteligente", precio: 32990 },
          { id: 605, nombre: "Enchufe Inteligente con Luz", precio: 19990 },
          { id: 606, nombre: "Controlador LED WiFi RGBW", precio: 12990 },
        ],
      },
      {
        id: 61,
        nombre: "Seguridad",
        productos: [
          { id: 611, nombre: "Cámara IP Exterior WiFi", precio: 69990 },
          {
            id: 612,
            nombre: "Sensor de Movimiento Inalámbrico",
            precio: 29990,
          },
          { id: 613, nombre: "Alarma Inteligente WiFi Kit", precio: 99990 },
          { id: 614, nombre: "Cerradura Inteligente WiFi", precio: 119990 },
          { id: 615, nombre: "Sensor de Puerta/Ventana WiFi", precio: 14990 },
          { id: 616, nombre: "Cámara Interior con Visión", precio: 49990 },
        ],
      },
    ],
  },
];

export default categoriasMock;
