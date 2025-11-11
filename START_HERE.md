# 🚀 Siteyi Başlatma Talimatları

## ⚠️ ÖNEMLİ: Local Server Gerekli!

Bu web sitesi JSON dosyalarını yüklemek için **mutlaka bir local web server** ile çalıştırılmalıdır.

Dosyayı doğrudan tarayıcıda açarsanız (file:// protokolü), **CORS hatası** alırsınız ve state'ler yüklenmez.

---

## ✅ Doğru Kullanım (3 Seçenek)

### Seçenek 1: Hazır Script (En Kolay) ⭐

```bash
cd /Users/onur/Documents/GitHub/IOS-DMV/site
./test-server.sh
```

Tarayıcıda aç: **http://localhost:8000**

---

### Seçenek 2: Python ile

```bash
cd /Users/onur/Documents/GitHub/IOS-DMV/site
python3 -m http.server 8000
```

Tarayıcıda aç: **http://localhost:8000**

---

### Seçenek 3: Node.js ile

```bash
cd /Users/onur/Documents/GitHub/IOS-DMV/site
npx http-server -p 8000
```

Tarayıcıda aç: **http://localhost:8000**

---

## 🐛 Sorun Giderme

### "Loading states..." Yazıyor, Yüklenmiyor

**Sebep:** Local server çalışmıyor veya CORS hatası

**Çözüm:**
1. Terminal'i aç
2. Yukarıdaki komutlardan birini çalıştır
3. **http://localhost:8000** adresini kullan (file:// DEĞİL!)
4. Tarayıcı konsolunu aç (F12) ve hataları kontrol et

---

### Browser Console Nasıl Açılır?

- **Chrome/Edge:** F12 veya Cmd+Option+I (Mac)
- **Firefox:** F12 veya Cmd+Option+K (Mac)
- **Safari:** Cmd+Option+C (önce Develop menüsünü aktif et)

---

### Beklenen Console Çıktısı

```
🚀 Initializing DMV Test App...
✅ Loaded 51 states
✅ App initialized successfully
States available: 51
```

---

### CORS Hatası Görüyorsan

```
Access to fetch at 'file:///.../data/states-index.json'
from origin 'null' has been blocked by CORS policy
```

**Çözüm:** Yukarıdaki yöntemlerle local server başlat!

---

## ✅ Test

1. Server başlat
2. http://localhost:8000 aç
3. Site dark mode'da açılmalı ✅
4. "Select Your State" ekranı geldiğinde 51 eyalet görünmeli ✅
5. Bir eyalet seç (örn. California)
6. Practice Tests'i başlat ✅
7. Soruları cevapla ✅

---

## 📱 Mobilde Test

1. Bilgisayarında server başlat
2. IP adresini bul: `ifconfig | grep inet` (Mac/Linux) veya `ipconfig` (Windows)
3. Telefonundan: **http://[IP-ADRESI]:8000**
   - Örnek: http://192.168.1.100:8000
4. Bilgisayar ve telefon aynı WiFi'de olmalı!

---

## 🎉 Başarı!

Eğer 51 eyalet görüyorsan, **herşey çalışıyor demektir!** 🚀

Dark mode ✅
State selection ✅
Quiz engine ✅
AI features ✅
Statistics ✅

---

**Sorun devam ediyorsa:** Browser console'u (F12) aç ve hataları kontrol et!
