# Spec — EDI : Statut métier + Viewer split-view

**Date :** 2026-04-26  
**Périmètre :** `EDIPage` historique table + `EDIMessageModal` → `EDIViewer`  
**Types couverts :** ORDERS, ORDRSP, DESADV, INVOIC (STOCK exclu du périmètre)

---

## 1. Contexte

La page EDI affiche un tableau "Historique des échanges" avec une colonne Statut basée sur des valeurs techniques (`SENT`, `RECEIVED`, `PENDING`). Le bouton 👁 ouvre un modal simple (JSON seul, monozone). L'objectif est de remplacer ces deux éléments par :

- Un **statut métier** lisible par une librairie, dérivé du type de message
- Un **viewer split-view** JSON métier / EDIFACT brut, avec style terminal

---

## 2. Décisions d'architecture

**Approche retenue : B — nouveau composant `EDIViewer` + utilitaires centralisés**

- `getBusinessStatus(type)` et `generateEdifactPlaceholder(msg)` vivent dans `ediUtils.ts`
- `EDIViewer.tsx` est le composant de rendu autonome (header + split body + footer)
- `EDIMessageModal.tsx` devient un wrapper `<Overlay> + <EDIViewer>` — interface externe inchangée
- `EDIPage.tsx` : aucune modification du composant parent sauf colonne Statut + suppression onglet STOCK

**Source de vérité unique :** `getBusinessStatus(type)` est utilisé identiquement dans le tableau et dans le viewer. Aucune variante `displayStatus`, aucun appel à `formatEDIStatusLabel` dans les zones métier.

---

## 3. `ediUtils.ts` — modifications

### 3.1 Suppression de STOCK

```ts
// Avant
export type EDIMessageType = 'ORDERS' | 'ORDRSP' | 'DESADV' | 'INVOIC' | 'STOCK'

// Après
export type EDIMessageType = 'ORDERS' | 'ORDRSP' | 'DESADV' | 'INVOIC'
```

Conséquences : retirer STOCK de `TYPE_LABELS`, `filterEDIMessages` (type guard), et tout fallback associé.

### 3.2 Nouvelle fonction `getBusinessStatus`

```ts
const BUSINESS_STATUS: Record<EDIMessageType, string> = {
  ORDERS: 'Commande envoyée',
  ORDRSP: 'Réponse commande reçue',
  DESADV: 'Info expédition reçue',
  INVOIC: 'Facture reçue',
}

export function getBusinessStatus(type: EDIMessageType): string {
  return BUSINESS_STATUS[type]
}
```

### 3.3 Nouvelle fonction `generateEdifactPlaceholder`

Génère un string EDIFACT illustratif à partir du message. Segments par type :

| Type | Segments caractéristiques |
|------|--------------------------|
| ORDERS | UNB, UNH, BGM+220, DTM+137, LIN×n, UNZ |
| ORDRSP | UNB, UNH, BGM+231, DTM+137, DOC, UNZ |
| DESADV | UNB, UNH, BGM+351, DTM+137, CPS, QTY, UNZ |
| INVOIC | UNB, UNH, BGM+380, DTM+137, MOA, TAX, UNZ |

Le documentRef et createdAt du message alimentent les segments BGM et DTM. Valeurs GLN fictives fixes.

---

## 4. `EDIViewer.tsx` — nouveau composant

**Chemin :** `src/components/edi/EDIViewer.tsx`

**Props :**
```ts
interface Props {
  message: EDIMessage
  onClose: () => void
}
```

### 4.1 Header

```
[TypeLabel]  [documentRef mono]        [badge getBusinessStatus(type)]
ID : {msg.id} en mono gris                                      [× Fermer]
```

- `formatEDITypeLabel(type)` pour le label type
- `getBusinessStatus(type)` pour le badge (même style que `StatusBadgeTable` dans le tableau)
- `msg.id` affiché sous le titre en `fontFamilyMono`, `gray[400]`

### 4.2 Body — split 50/50

**Colonne gauche — JSON métier**
- Fond : `theme.colors.gray[50]`
- Texte : `theme.colors.navy`
- Contenu : `JSON.stringify(msg.payload, null, 2)` dans un `<pre>`
- Scroll vertical indépendant
- Label en-tête : "Données métier"

**Colonne droite — EDIFACT brut**
- Fond : `#000000`
- Texte : `#00FF41` (vert terminal)
- Font : `theme.typography.fontFamilyMono`
- Contenu : `generateEdifactPlaceholder(msg)` dans un `<pre>`
- Scroll vertical indépendant
- Label en-tête : "Message EDIFACT"

### 4.3 Footer

Bouton "Fermer" aligné à droite, même style que `BtnClose` actuel.

### 4.4 Dimensions

- `max-width: 860px` (contre 560px actuel — nécessaire pour le split)
- `max-height: 80vh`
- Body : `height: 400px` fixe, scroll interne par colonne

---

## 5. `EDIMessageModal.tsx` — refactor wrapper

```tsx
export function EDIMessageModal({ message, onClose }: Props) {
  if (!message) return null
  return (
    <Overlay onClick={onClose}>
      <EDIViewer message={message} onClose={onClose} />
    </Overlay>
  )
}
```

Tout le JSX `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`, `StatusBadge`, `Pre` existants sont supprimés. `Overlay` conservé.

---

## 6. `EDIPage.tsx` — modifications tableau

### 6.1 Colonne Statut

- `<Th>Statut</Th>` : inchangé
- `<Td>` : remplace `<StatusBadgeTable $status={msg.status}>{formatEDIStatusLabel(msg.status)}</StatusBadgeTable>` par badge basé sur `getBusinessStatus(msg.type)`
- Couleurs du badge par type :
  - `ORDERS` → fond `accentLight`, texte `#8B6914`
  - `ORDRSP` / `DESADV` / `INVOIC` → fond `primaryLight`, texte `success`
  - Override erreur (msg.status === 'ERROR') → fond `#FDECEA`, texte `error` — couleur seule, texte reste `getBusinessStatus(type)`

### 6.2 Colonne Voir

- Déplacée dans sa propre `<Th>Voir</Th>` et `<Td>` (retirée de la colonne Détail)
- Le bouton 👁 (`EyeBtn`) reste identique

### 6.3 Onglets

- Suppression de `{ key: 'STOCK', label: 'Stocks (STOCK)' }` du tableau de tabs
- 5 onglets restants : Tous / Commandes / Accusés (ORDRSP) / Expéditions (DESADV) / Factures (INVOIC)

---

## 7. Fichiers touchés

| Fichier | Action |
|---------|--------|
| `src/lib/ediUtils.ts` | Retirer STOCK, ajouter `getBusinessStatus`, `generateEdifactPlaceholder` |
| `src/components/edi/EDIViewer.tsx` | Créer (nouveau) |
| `src/components/edi/EDIMessageModal.tsx` | Refactor → wrapper Overlay + EDIViewer |
| `src/pages/edi/EDIPage.tsx` | Badge Statut, col Voir, onglet STOCK |
| `src/data/mockEDIMessages.ts` | Retirer tout message de type STOCK si présent |
| `src/pages/edi/__tests__/ediUtils.test.ts` | Ajouter tests `getBusinessStatus`, `generateEdifactPlaceholder` |

---

## 8. Règles métier non négociables

- **Interdit** : afficher SENT / RECEIVED / PENDING dans l'UI métier
- **Interdit** : exposer une notion technique ICD, direction de flux, ou middleware
- **Obligatoire** : `getBusinessStatus(type)` comme unique source du label statut (tableau + viewer)
- **Obligatoire** : STOCK absent de toute l'application (type TS, UI, mocks, utils)
