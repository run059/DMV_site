# 📱 Mobil Erişim Talimatları

## 🌐 Bilgisayarının IP Adresi

**192.168.1.49**

## 📲 Telefondan Nasıl Erişilir?

### Ön Koşul
✅ Telefon ve bilgisayar **aynı WiFi ağına** bağlı olmalı

### Adımlar

1. **Telefon tarayıcını aç** (Safari, Chrome, vb.)

2. **Bu adresi yaz:**
   ```
   http://192.168.1.49:8000
   ```

3. **Enter'a bas**

4. Site açılacak! 🎉

---

## ⚠️ Sorun Giderme

### "Site açılmıyor" hatası?

**Kontrol Et:**

1. ✅ Her iki cihaz da aynı WiFi'de mi?
   - Telefon: Ayarlar → WiFi → Ağ adını kontrol et
   - Bilgisayar: WiFi simgesine tıkla, ağ adını kontrol et

2. ✅ Server çalışıyor mu?
   - Bilgisayarda terminal açık mı?
   - Port 8000'de server var mı?
   ```bash
   lsof -ti:8000
   ```

3. ✅ Firewall engelliyor mu?
   - Mac: Sistem Tercihleri → Güvenlik → Güvenlik Duvarı
   - Python'a izin ver

---

## 🔥 Firewall Sorunu mu?

Mac'te geçici olarak devre dışı bırak:

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

Test ettikten sonra geri aç:

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

---

## 🎯 Başka IP Adresleri

Eğer 192.168.1.49 çalışmazsa, diğer adresleri dene:

```bash
ifconfig | grep "inet "
```

Çıkan adreslerden birini dene (127.0.0.1 hariç)

---

## 📱 PWA Olarak Yükle

Mobil tarayıcıda:

**Safari (iOS):**
1. Siteyi aç
2. Paylaş butonuna bas
3. "Ana Ekrana Ekle"
4. Uygulama gibi kullan! 📲

**Chrome (Android):**
1. Siteyi aç
2. Menü (⋮)
3. "Ana ekrana ekle"
4. Uygulama gibi kullan! 📲

---

## ✅ Test

Açılması gereken:
- ✅ Ana sayfa (dark mode)
- ✅ State selection (51 eyalet)
- ✅ Practice tests
- ✅ Quiz arayüzü
- ✅ Tüm özellikler

---

**IP Adres:** http://192.168.1.49:8000
**Server Durumu:** Çalışıyor ✅
