---
layout: default
title: Usage Guide
---

# Usage: yvr-cms

**yvr-cms** (Your Versatile CMS), Node.js, Express.js ve MongoDB kullanarak baştan sona özelleştirilebilir bir içerik yönetim sistemi (CMS) oluşturmanızı sağlar. Aşağıda, projeyi nasıl kullanacağınız, koleksiyonlarınızı nasıl yöneteceğiniz ve yvr-cms'in sunduğu özellikleri nasıl kullanacağınız anlatılmaktadır.

## İçindekiler

- [Proje Başlatma](#proje-başlatma)
- [Yapılandırma](#yapılandırma)
- [Koleksiyon ve Şemaların Yönetimi](#koleksiyon-ve-şemaların-yonetimi)
- [API Kullanımı](#api-kullanımı)
- [Kullanıcı Yetkilendirme ve Doğrulama](#kullanıcı-yetkilendirme-ve-doğrulama)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Hata Yönetimi ve Loglama](#hata-yonetimi-ve-loglama)
- [Ek Özellikler](#ek-ozellikler)
  
---

## Proje Başlatma

### 1. Proje Yükleme

Yvr-cms'i kullanmaya başlamak için aşağıdaki adımları izleyin:

```bash
npx yvr-cms init my-project
cd my-project
npm install