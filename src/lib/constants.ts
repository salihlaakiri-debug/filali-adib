export const STORE = {
  name: "Filali Adib - Artiste Joaillier",
  phone: "+212 6 44 69 08 61",
  phoneRaw: "212644690861",
  email: "contact@filali-adib.ma",
  address: {
    ar: "الطالعة الكبيرة 42، فاس المرينية، فاس 30000، المغرب",
    fr: "42 Talaa Kebira, Fès el-Bali, Fès 30000, Maroc",
    street: "42 Talaa Kebira, Fès el-Bali",
    city: "Fès",
    country: "Morocco",
    postalCode: "30000",
  },
  hours: {
    ar: "السبت - الخميس: 9:00 - 19:00\nالأحد: مغلق",
    fr: "Sam - Jeu: 9h00 - 19h00\nDim: Fermé",
  },
  taxId: "12345678",
  social: {
    facebook: "https://www.facebook.com/filaliadib",
    instagram: "https://www.instagram.com/filaliadib",
    whatsapp: "https://wa.me/212644690861",
  },
} as const;

export const WHATSAPP_URL = `https://wa.me/${STORE.phoneRaw}`;
