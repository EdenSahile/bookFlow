# Commit 7 — Composants UI réutilisables

**Date :** 2026-04-25
**Statut :** Approuvé

## Objectif

Éliminer trois catégories de duplication UI : modales de confirmation, icônes SVG inline, logique d'export CSV.

---

## 1. ConfirmDialog

**Fichier :** `src/components/ui/ConfirmDialog.tsx`

**Source :** extraction de l'implémentation existante dans `CartPage.tsx` (lignes 72–100), qui est la plus complète : gestion Escape, focus automatique sur le bouton d'action, aria-modal.

**Interface :**
```ts
interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string   // défaut : 'Confirmer'
  cancelLabel?: string    // défaut : 'Annuler'
  destructive?: boolean   // bouton rouge si true, défaut : false
  onConfirm: () => void
  onCancel: () => void
}
```

**Sites de remplacement :**
- `Sidebar.tsx` : confirmation déconnexion (destructive)
- `BurgerMenu.tsx` : confirmation déconnexion (destructive)
- `Header.tsx` : confirmation suppression liste (destructive)
- `CartPage.tsx` : suppression item + vider panier (destructive, déjà utilisé localement)

---

## 2. Icons centralisées

**Fichier :** `src/components/ui/icons/index.tsx`

**Périmètre :** uniquement les icônes dupliquées entre plusieurs fichiers ou structurellement importantes.

| Icône | Présente dans |
|-------|--------------|
| `IconTrash` | CartPage + Header |
| `IconCart` | CartPage + Header (IconCartSvg) |
| `IconSearch` | Header |
| `IconLogout` | Sidebar + BurgerMenu (tailles différentes) |
| `IconChevronLeft` | CartPage |
| `IconStar` | BookCardRow |

**Props communes :** `size?: number` (défaut 16), `color?: string` (défaut `currentColor`). `IconCart` accepte en plus `filled?: boolean`.

**Exclusions :** icônes de nav BurgerMenu (Instagram, Facebook, YouTube, etc.) — contextuelles, pas de raison d'être globales.

---

## 3. csv.ts

**Fichier :** `src/lib/csv.ts`

**Signature :**
```ts
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void
```

**Implémentation :** basée sur la version `HistoriquePage` (plus robuste) :
- BOM UTF-8 (`﻿`) pour Excel
- Séparateur `;` (convention française)
- CRLF entre lignes
- Escape des guillemets doubles dans les valeurs

**Consommateurs :**
- `Header.tsx` : export listes wishlist (remplace `exportListCSV` inline)
- `HistoriquePage.tsx` : export commandes (remplace `buildCSVRows` + `downloadCSV` inline)

---

## Tests

- Test unitaire `src/lib/__tests__/csv.test.ts` : BOM présent, valeurs avec guillemets échappés, filename sanitisé.
- `ConfirmDialog` : pas de test unitaire (composant purement UI), vérifié manuellement.
- Build TypeScript doit rester propre.
