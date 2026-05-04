# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.  
> Contient uniquement l'état courant et les prochaines étapes.  
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build
TS clean · 161 tests passants · session 2026-05-04  
**Refonte design pages** : NouveautesPage, AParaitrePage, TopVentesPage, SelectionsPage, FlashInfosPage, HistoriquePage, MonComptePage, RecherchePage, AuteurPage, ContactPage, FacturationPage, ParametresPage, EDIPage, OfficesPage ✅  
**Onboarding** : Tour guidé Driver.js 7 étapes + TooltipInfo métier + "Revoir le tour" ✅

---

## Session en cours

### Système d'onboarding — Tour guidé Driver.js + Tooltips contextuels

- [x] 1. Installer driver.js (npm)
- [x] 2. Créer `OnboardingContext` (flag `onboarding_done` localStorage, `startTour()`, `resetTour()`)
- [x] 3. Ajouter `data-tour` IDs sur les éléments cibles (SearchGroup, bloc actions, dashboard, sidebar Catalogue, CartBtn, sidebar EDI, bloc Nouveautés)
- [x] 4. Créer composant `OnboardingTour` — définit les 7 étapes Driver.js, styles cohérents navy/or
- [x] 5. Intégrer le tour dans `AppLayout` — déclenche automatiquement à la première connexion
- [x] 6. Créer composant `TooltipInfo` (icône `?` + popover) + l'utiliser sur Taux de rupture, Panier moyen, EDI, Office, PP TTC
- [x] 7. Ajouter bouton "Revoir le tour guidé" dans ParametresPage et BurgerMenu
- [x] 8. Vérification TS + 161 tests passants

---

## Prochaines étapes

