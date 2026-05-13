# 🛡 BillSafe — Guide de déploiement complet

Votre application est prête. Suivez ces 4 étapes pour la mettre en ligne **gratuitement**.

---

## ÉTAPE 1 — Créer votre compte Supabase

1. Allez sur **https://supabase.com** et cliquez "Start your project"
2. Créez un compte gratuit (avec GitHub ou email)
3. Cliquez **"New project"**
   - Nom: `billsafe`
   - Mot de passe base de données: choisissez-en un fort et **sauvegardez-le**
   - Région: choisissez **Europe West** (plus proche du Cameroun)
4. Attendez ~2 minutes que le projet se crée

---

## ÉTAPE 2 — Configurer la base de données

### 2a. Exécuter le script SQL

1. Dans votre projet Supabase, cliquez **"SQL Editor"** dans le menu gauche
2. Cliquez **"New query"**
3. Copiez-collez tout le contenu du fichier **`supabase-setup.sql`**
4. Cliquez **"Run"** — vous devriez voir "Success"

### 2b. Créer le bucket de stockage

1. Dans le menu gauche, cliquez **"Storage"**
2. Cliquez **"New bucket"**
   - Nom: `bills`
   - Cochez **"Public bucket"** ✅
3. Cliquez **"Create bucket"**
4. Allez dans **Policies** du bucket `bills`, ajoutez cette politique:
   - Policy name: `Users upload own files`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `(auth.uid()::text) = (storage.foldername(name))[1]`

### 2c. Activer l'authentification SMS (pour connexion par téléphone)

1. Allez dans **Authentication → Providers**
2. Activez **Phone** et choisissez un provider SMS
   - **Twilio** (recommandé) — créez un compte gratuit sur twilio.com
   - Entrez votre Account SID et Auth Token Twilio
3. Pour les tests, activez **"Enable phone confirmations"** peut être désactivé

---

## ÉTAPE 3 — Connecter votre code à Supabase

### Trouver vos clés API

1. Dans Supabase, allez dans **Settings → API**
2. Copiez:
   - **Project URL** (commence par `https://`)
   - **anon / public** key (longue chaîne)

### Remplacer les clés dans le code

Ouvrez **`pages/auth.html`** et **`pages/dashboard.html`**.

Dans chaque fichier, remplacez ces deux lignes :

```javascript
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';
```

Par vos vraies valeurs, par exemple :

```javascript
const SUPABASE_URL  = 'https://abcdefghij.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## ÉTAPE 4 — Déployer sur Netlify

1. Allez sur **https://netlify.com** et créez un compte gratuit
2. Cliquez **"Add new site → Deploy manually"**
3. Glissez-déposez le **dossier entier `billsafe/`** dans la zone de dépôt
4. Netlify vous donne une URL gratuite comme `https://billsafe-xyz.netlify.app`

### Optionnel — Connecter un domaine personnalisé

Si vous avez un domaine (ex: `billsafe.cm`), vous pouvez le connecter dans les settings Netlify → Domain management.

---

## Structure du projet

```
billsafe/
├── index.html              ← Page d'accueil (redirige vers auth)
├── _redirects              ← Config Netlify
├── supabase-setup.sql      ← Script SQL à exécuter dans Supabase
├── js/
│   └── supabase.js         ← Config Supabase (référence)
└── pages/
    ├── auth.html           ← Connexion / Inscription
    └── dashboard.html      ← Tableau de bord principal
```

---

## Tables Supabase créées

| Table | Description |
|-------|-------------|
| `bills` | Toutes les factures des utilisateurs |
| `profiles` | Informations des utilisateurs |

---

## Prochaines étapes (Step 3)

- 📱 Page dédiée liste de toutes les factures avec recherche
- 🔔 Système d'alertes SMS (rappels de paiement)
- 📸 Scan automatique des factures avec OCR
- 📊 Rapports PDF téléchargeables

---

*BillSafe — Fait avec ❤️ pour le Cameroun*
