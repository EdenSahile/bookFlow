# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.  
> Contient uniquement l'état courant et les prochaines étapes.  
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build
TS clean · 109/109 tests Vitest · dernière session 2026-04-26

---

## Dernière session — 2026-04-26
Masquage GLN / Identifiant Dilicom (`674ef90`) :  
7 derniers chiffres remplacés par `XXXXXXX` dans `EDIPage.tsx` et `ediUtils.ts`.

---

## Prochaines étapes — Refonte HomePage

- [x] Étape 1 — Greeting row (salutation + date/calendrier gauche/droite)
- [x] Étape 2 — Bloc "Actions en attente" (bannière rosée, 4 actions)
- [x] Étape 3 — Bilan du mois précédent (4 KPI cards avec tendances)
**Étapes 4+5+6 = 1 ligne 3 colonnes (col gauche ~45%, col milieu ~30%, col droite ~25%)**

- [x] Étape 4 — Évolution des commandes (colonne gauche)
  - Titre "Évolution des commandes" + icône calendrier (droite du titre)
  - Courbe SVG verte, axe X : 01/03 08/03 15/03 22/03 31/03, axe Y : 0→50, label "Nombre de commandes par jour"
  - À droite du graphique : 3 stats empilées avec icône + valeur + delta coloré :
    - Commandes envoyées : 32, ▲ +12% (vert)
    - Commandes annulées : 2, ▼ -33% (rouge)
    - Taux d'annulation : 6,2 %, ▼ -3,1 pts (rouge)

- [x] Étape 5 — Répartition des achats (colonne milieu)
  - Titre "Répartition de vos achats"
  - Donut chart SVG 4 segments : BD/Mangas 45% (bleu), Littérature 30% (vert), Jeunesse 15% (jaune/or), Autres 10% (gris)
  - Légende à droite du donut : point coloré + label + %

- [x] Étape 6 — Top éditeurs (colonne droite)
  - Titre "Top éditeurs" + "Voir tout →" (aligné droite)
  - 5 lignes : numéro rang | nom | % | montant €
    1. Éditeur 1 — 35% — 4 358 €
    2. Éditeur 2 — 25% — 3 113 €
    3. Éditeur 3 — 15% — 1 868 €
    4. Éditeur 4 — 10% — 1 245 €
    5. Autres éditeurs — 15% — 1 866 €
  - Pied de tableau : "Part du montant | Montant commandé" (gris, aligné droite)

**Étapes 7+8+9 = 1 ligne 3 colonnes (mêmes proportions)**

- [x] Étape 7 — Suivi des flux EDI (colonne gauche)
  - Titre "Suivi des flux EDI"
  - 4 stats en grille 2×2 avec icône colorée + valeur + label :
    - 12 Commandes envoyées (vert), 5 Expéditions en cours (bleu), 3 Factures reçues (orange), 1 Erreur EDI (rouge + icône ×)
  - 2 métriques en ligne : "Délai moyen de livraison 3,2 jours" + "Taux de réception 92%"
  - Lien bas : "Accéder au suivi EDI →" (vert)

- [x] Étape 8 — Nouveautés du mois (colonne milieu)
  - Titre "Nouveautés du mois" + "Voir tout →"
  - Carrousel horizontal de couvertures (BookCard existantes), badge catégorie coloré en haut de chaque carte
  - Flèche droite visible (comme le carrousel actuel)

- [x] Étape 9 — Raccourcis (colonne droite)
  - Titre "Raccourcis"
  - 4 lignes cliquables avec icône (fond gris clair) + label + chevron ">" :
    - Passer une commande → /fonds
    - Accéder au panier → /panier
    - Gérer mes listes → /compte
    - Consulter mon historique → /historique

- [x] Étape 10 — Footer (barre grise bas de page)
  - ⓘ + texte : "Les statistiques affichées couvrent la période du [1er mois précédent] au [dernier jour mois précédent] et seront mises à jour le [1er du mois courant+1]."
  - Date dynamique — jamais hardcodée (fix bug "1er mai" hardcodé)

---

## Règles de travail en session

1. S'arrêter après chaque tâche et demander validation avant de passer à la suivante
2. Cocher ✅ dans ce fichier dès qu'une tâche est terminée
3. Marquer 🔄 la tâche en cours
4. Marquer Case à cocher vide quand tâche à faire
5. En fin de session : mettre à jour les phases dans CLAUDE.md + réécrire ce fichier avec uniquement ce qui reste
6. Ne jamais commiter sans validation