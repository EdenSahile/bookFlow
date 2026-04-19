# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Résumé
À chaque fin de session ou sur demande, ajoute un bloc daté en haut du fichier résumant : ce qui a été fait, l’état actuel du code, et les prochaines étapes.

## Contexte du projet

Application B2B **BookFlow** à destination exclusive des **libraires**, permettant de passer des commandes de livres (notamment les titres de fonds déjà parus) et de consulter les actualités éditoriales.

**Cible** : application **desktop** (interface large) ET **mobile responsive** (téléphone).
**Design source** : `/Users/macbookeden/Documents/Projets-code/ux-design-application-libraires.pdf`

---

## Charte graphique

| Élément | Valeur |
|---------|--------|
| Fond principal | Jaune `#FFC000` |
| Textes / encadrés | Bleu marine `#1E3A5F` |
| Boutons d'action | Jaune fond + texte blanc ou bleu |
| Accents | Blanc |
| Logo | "BookFlow" (cercle orange/jaune, texte bleu) |

---

## Authentification

- Accès **réservé aux libraires uniquement**
- **Inscription** : code client + email professionnel + mot de passe + confirmation
- **Double vérification** : le code client existe-t-il ? + l'email correspond-il à la librairie ?
- **Connexion** : code client ou email + mot de passe + "mot de passe oublié"
- Une fois connecté : interface liée au compte interne (remise personnalisée, adresse de livraison) via AS400 / CRM

---

## Navigation principale

**Bottom bar (mobile) / barre latérale ou top nav (desktop)** — 5 sections :

| Onglet | Contenu |
|--------|---------|
| Accueil | Scanner + recherche + Flash infos |
| Nouveautés | Titres du mois + À paraître |
| Fonds | Titres déjà parus, commandables |
| Top Ventes | Meilleures ventes par thématique |
| Sélections | Sélections éditoriales thématiques |

En permanence : **Menu Burger** (gauche) + **Panier** (droite, avec badge quantité) + **Barre de recherche**.

---

## Écrans et fonctionnalités

### Accueil
- Barre de recherche (EAN, titre, éditeur, collection) avec micro (recherche vocale)
- Zone scanner code-barres central
- Bouton "Flash infos" avec badge de notifications

### Scanner & Recherche
- **Scanner** : ouvre la caméra → lit le code-barre → affiche fiche produit → "Ajouter au panier"
- **Recherche** : écrite ou vocale, par EAN / titre / éditeur / collection
- Fiche résultat : couverture, titre, ISBN, éditeur, auteur, prix, type, format, date parution + "Pages intérieures", "Bande annonce", cœur (liste), quantité +/−, "Ajouter au panier"

### Nouveautés
- Sous-onglets : **Nouveautés du mois** / **À paraître**
- Tri par univers : BD/Mangas, Jeunesse, Littérature, Adulte-pratique
- Pages intérieures : carrousel de visuels + bouton "Recevoir par email"
- Bande annonce : lecteur vidéo intégré

### À paraître (sous Nouveautés)
- **Consultation catalogue uniquement — aucune commande possible**
- Tri par univers puis par programme (tranches 2-4 mois)
- Bouton "Recevoir le catalogue" par email
- Commande uniquement via représentant commercial

### Fonds
- Titres déjà parus, commandables directement
- Recherche + filtre par thématique (Adulte-pratique, BD/Mangas/Comics, Jeunesse, Littérature)

### Top Ventes
- Classement par thématique avec badges TOP 1, TOP 2…

### Sélections
- Sélections "Nos héros" (vignettes couverture par série)
- Thématiques saisonnières : Saint-Valentin, fêtes des mères, rentrée…
- Indicateur "Offre spéciale" (point vert)
- Tri par univers

### Flash Infos
- Classées par univers : BD/Mangas, Jeunesse, Littérature, Pratique
- Catégories : Auteurs, Fonds, Nouveautés, BookFlow
- Contenu : vidéo ou image + texte + lien + possibilité d'ajouter au panier directement

### Panier
- Code client affiché automatiquement
- Récap en haut : Montant HT, Remise (%), Net HT, TVA 5,5%, Total TTC, nb articles
- Date de livraison : délai habituel (1-3 jours) ou date spécifique
- Remises appliquées automatiquement par thématique (liaison AS400/CRM)
- Modification quantité / suppression avant validation
- Après validation : résumé de commande → bouton "Confirmer" pour envoi

### Menu Burger
- Photo + nom librairie en en-tête
- Mon compte | Mon historique | Contact | Inscription Newsletter | Paramètres | Aide | CGV | Se déconnecter
- **Mon historique** : liste des commandes passées + duplication en 1 clic
- **Contact** : envoi email vers représentant ou service clients
- **Paramètres** : préférences notifications par univers
- **Aide** : lien vers onboarding
- Réseaux sociaux en pied : Site web, Facebook, Instagram, YouTube

---

## Règles métier importantes

- Les **titres à paraître ne sont PAS commandables** via l'app — consultation catalogue uniquement
- Les **titres de fonds et nouveautés du mois sont commandables** directement
- Les remises sont **personnalisées par libraire** et s'appliquent automatiquement selon la thématique
- L'app est **B2B exclusif** : aucun accès grand public

---

## Stack technique

> **Stratégie** : développement initial en **React + Vite** (itération rapide, pas de SSR), migration vers **Next.js 14** en Phase 12 (SSR, API routes, NextAuth, next-pwa).

| Couche | Phase 1–11 (transitoire) | Phase 12+ (production) |
|--------|--------------------------|------------------------|
| Framework | **Vite 5 + React 18** | **Next.js 14** (App Router) |
| Routing | **React Router v6** | Next.js App Router |
| Langage | **TypeScript** (strict) | TypeScript (strict) |
| Style | **Styled-components v6** | Styled-components v6 |
| Auth | **Mock JWT** (localStorage) | **NextAuth.js v5** (httpOnly cookie) |
| BDD | **Prisma ORM** installé — branché à la migration | **PostgreSQL** via Prisma (Supabase) |
| Validation | **Zod** (tous les inputs) | Zod |
| PWA | **vite-plugin-pwa** | **next-pwa** |
| Déploiement | Local / Vercel (build Vite) | **Vercel** (Next.js) |
---

## Sécurité — règles non négociables

- Mots de passe hashés avec **bcrypt** (cost factor ≥ 12) — actif dès Phase 3
- JWT avec expiration courte — refresh token en **httpOnly cookie** uniquement (Phase 12, migration Next.js)
- Rate limiting sur `/api/auth/*` : max 5 tentatives/minute par IP (Phase 12)
- Toute donnée entrante validée avec **Zod** avant traitement
- Prix et remises toujours recalculés **côté serveur** (Phase 12)
- Toutes les routes `/api/*` vérifient le token JWT (Phase 12)
- Un libraire ne peut accéder qu'à ses propres données (vérification `codeClient`)
- Headers HTTP sécurisés (CSP, X-Frame-Options, HSTS…) — `next.config.mjs` en Phase 12, `vite.config.ts` en dev
- **Prisma** exclusivement — jamais de SQL brut avec interpolations
- Variables d'environnement dans `.env` — jamais dans le code, `.env` dans `.gitignore`

---

## Phases de développement

| Phase | Contenu | Statut |
|-------|---------|--------|
| 1 | Setup projet + structure + `.env` + Prisma schema | ✅ Fait |
| 1bis | **Migration React/Vite** — remplacement Next.js par Vite + React Router | ✅ Fait |
| 2 | Layout global (nav bottom mobile / sidebar desktop) + design system | ⬜ À faire |
| 3 | Authentification mock (inscription + connexion + mot de passe oublié) | ⬜ À faire |
| 4 | Accueil (recherche + scanner UI) | ⬜ À faire |
| 5 | Catalogue Fonds + Nouveautés (liste, filtres, fiche produit) | ⬜ À faire |
| 6 | Panier + commande | ⬜ À faire |
| 7 | Flash Infos | ⬜ À faire |
| 8 | Menu Burger + Mon compte + Historique | ⬜ À faire |
| 9 | Scanner caméra (lecture code-barres réelle) | ⬜ À faire |
| 10 | PWA — vite-plugin-pwa (manifest + service worker + icônes) | ⬜ À faire |
| 11 | Tests + recette fonctionnelle | ⬜ À faire |
| 12 | **Migration Next.js 14** — SSR, App Router, NextAuth.js v5, next-pwa, API routes, Supabase live | ⬜ À faire |
| 13 | Audit sécurité + déploiement Vercel production | ⬜ À faire |
