# 🍽️ Kafe Pro POS

Restoran va kafelar uchun kassa tizimi. Brauzerda ishlaydi, ma'lumotlar Node.js serve## Kerak bo'ladi

- **Node.js 22.13 yoki yangiroq** (tavsiya: 24 LTS) — https://nodejs.org. Boshqa paket o'rnatish shart emas.
- **Google Chrome** — chekni oynasiz chiqarish uchun.

## Ishga tushirish

**Windows (kassa kompyuteri):** `Kafe-Pro.bat` faylini ikki marta bosing (ish stoliga yorliq qilib qo'ying).
U serverni kichik oynada yoqadi (**bu oynani yopmang**) va kassani Chrome'da ochadi.

**Mac / Linux:**

```bash
./start.sh
```

**Boshqa qurilmalar** (oshxona plansheti, ofitsiant telefoni) shu Wi-Fi'ga ulanib, server oynasida
ko'rsatilgan manzilni ochadi, masalan `http://192.168.1.20:3000`.

## Ma'lumotlar va zaxira

| Joy | Nima |
|---|---|
| `data/kafe.db` | Asosiy baza (buyurtmalar, menyu, xodimlar, sozlamalar) |
| `backups/kafe-YYYY-MM-DD.db` | Har kungi avtomatik zaxira, oxirgi 30 kun saqlanadi |

- Har bir amal (taom qo'shish, to'lov, oshxona holati) serverga alohida boradi — bir vaqtda ishlagan qurilmalar bir-birining o'zgarishini o'chirmaydi.
- To'lov summasi va qaytim serverda qayta hisoblanadi; bir buyurtmani ikki marta to'lab bo'lmaydi.
- PIN kodlar faqat serverda tekshiriladi va brauzerga yuborilmaydi. 5 marta xato PIN — 30 soniya kutish.
- PIN o'zgartirilsa, o'sha xodim barcha qurilmalarda tizimdan chiqariladi.
- **Zaxiradan tiklash:** serverni to'xtating, `data/kafe.db` o'rniga kerakli `backups/...db` faylini `kafe.db` nomi bilan qo'ying (yonidagi `kafe.db-wal`, `kafe.db-shm` fayllarini o'chiring), serverni qayta yoqing.
- **Sozlamalar → Zaxira nusxa yuklab olish** — barcha ma'lumotni JSON fayl qilib yuklab oladi (masalan, fleshkaga saqlash uchun).
- Eski versiyadagi `pos_data.json` birinchi ishga tushishda bazaga avtomatik ko'chiriladi va `pos_data.json.imported` deb qayta nomlanadi.

 soniyada sinxronlanadi.

## Kirish (standart PIN kodlar)

| Xodim | Ko'radigan bo'limlar | PIN |
|---|---|---|
| Admin | Admin panel, Oshxona, Stollar, Menyu, Buyurtmalar, Sozlamalar | 1111 |
| Kassir | Kassa, Buyurtmalar | 2222 |
| Oshpaz | Faqat Oshxona | 3333 |

PIN kodlarni **Sozlamalar → Xodimlar** bo'limida o'zgartiring (mijozga topshirishdan oldin albatta).

## Bo'limlar

| Bo'lim | Nima qiladi |
|---|---|
| Admin panel | Tanlangan kun/oraliqda tushum, qaysi taom qancha sotilgani, kategoriyalar, sotilmagan taomlar, taom qo'shish |
| Kassa | Joy (Zal, Ko'cha, VIP...) → stol → menyudan taom → oshxonaga yuborish → to'lov → chek |
| Oshxona | Oshpaz ekrani: Yangi → Tayyorlanmoqda → Tayyor → Berildi |
| Stollar | Joylar va ulardagi stollar soni, xizmat haqi (%) |
| Menyu | Kategoriyalar va taomlar: nom, narx, sotuvda bor/yo'q |
| Buyurtmalar | Sana bo'yicha buyurtmalar, tushum (naqd/karta), chekni qayta chiqarish, bekor qilish |
| Sozlamalar | Restoran ma'lumotlari, xodimlar va PIN, chek printer, zaxira nusxa |

## Ish jarayoni

1. **Kassa** — joyni, keyin stolni tanlang → taomlarni bosing → soni, izoh, chegirma.
2. **Oshxonaga yuborish** — buyurtma Oshxona paneliga tushadi. Oshpaz "Tayyor" bosganda kassada stol binafsha rangda "Tayyor!" deb yonadi.
3. **To'lov** — Naqd (qaytim avtomatik), Karta yoki Aralash → "To'lovni tasdiqlash".
4. **Chek** — "Chek chiqarish". Stol avtomatik bo'shaydi.

Oshxona panelini alohida ekranda (planshet yoki monitor) Oshpaz PIN kodi bilan oching. Oshxonada printer bo'lsa: **Sozlamalar → Chek va printer**da "Oshxonaga yuborilganda chek ham chiqsin" ni yoqing.

## Chek printer

**Sozlamalar → Chek va printer** bo'limida:

- qog'oz kengligi (58 / 80 mm), shrift o'lchami, nusxalar soni;
- chekdagi qatorlar: qo'shimcha yozuv (masalan, STIR), manzil, telefon, kassir, oxirgi yozuv;
- to'lovdan keyin chekni avtomatik chiqarish;
- oshxonaga yuborilganda narxsiz oshxona chekini chiqarish;
- "Sinov cheki" tugmasi va chekning jonli ko'rinishi.

### Chekni oynasiz, to'g'ridan-to'g'ri chiqarish

1. Chek printerni ulang va drayverini o'rnating.
2. Uni **asosiy (default) printer** qiling (Windows: *Sozlamalar → Printerlar*; Mac: *Tizim sozlamalari → Printerlar*).
3. Dasturni `Kafe-Pro.bat` (Windows) yoki `./kassa-chrome.sh` (Mac) orqali oching.

Chrome `--kiosk-printing` rejimida ochiladi va chek so'ramasdan darhol asosiy printerga chiqadi.
Birinchi marta oddiy chop etish oynasida qog'oz o'lchami va "Chegaralar: Yo'q" ni tanlab qo'ying.
