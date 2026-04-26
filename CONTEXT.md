# CONTEXT.md

> Fichier vivant — réécrit par Claude en fin de session ou sur demande.  
> Contient uniquement l'état courant et les prochaines étapes.  
> Ne pas y mettre de contexte projet permanent (→ CLAUDE.md).

---

## État du build
TS clean · 109/109 tests Vitest · dernière session 2026-04-26

---

## Session en cours — 2026-04-26

Refonte HomePage terminée (étapes 1→10, commit `d3a3a45`).

Corrections post-refonte appliquées :
- Étape 8 : limité à 4 nouveautés (au lieu de 8)
- Bloc "Actions en attente" :
  - Carte 1 : libellé → "Ouvrage(s) dans le panier", compteur branché sur `useCart().totalItems`, singulier/pluriel dynamique, clic → `/panier`
  - Carte 2 : libellé → "commandes à vérifier"
  - Carte 3 : libellé → "erreur EDI à corriger"
  - Carte 4 : libellé → "expéditions en retard"

---

## Prochaines étapes

Aucune étape planifiée — toutes les phases actives sont ✅ ou 🚫.

---

## Règles de travail en session

1. S'arrêter après chaque tâche et demander validation avant de passer à la suivante
2. Cocher ✅ dans ce fichier dès qu'une tâche est terminée
3. Marquer 🔄 la tâche en cours
4. Marquer Case à cocher vide quand tâche à faire
5. En fin de session : mettre à jour les phases dans CLAUDE.md + réécrire ce fichier avec uniquement ce qui reste
6. Ne jamais commiter sans validation
