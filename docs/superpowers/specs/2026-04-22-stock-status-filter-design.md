# Spec — Statuts de disponibilité, filtre Fonds, typographie BookCard

**Date :** 2026-04-22
**Scope :** StockStatus inline, filtre disponibilité FondsPage, typo BookCard/BookCardRow, labels Cart/Historique
**Contraintes :** ne pas toucher à `computeTotals` ni aux tests Vitest existants

---

## 1. Modèle de données

### 1.1 Ajout `delaiReimp` sur `Book`

```ts
// mockBooks.ts — interface Book
delaiReimp?: string   // ex: "2 semaines" | "15 mai 2026"
```

Attribuer `delaiReimp` à certains livres `en_reimp` :
- `f-lit-bovary` → `"2 semaines"`
- `f-lit-gatsby` → `"15 mai 2026"`
- `f-lit-alchimiste` → `"3 semaines"`
- `f-lit-millenium` et `f-bd-onepiece` → pas de `delaiReimp` (tooltip "Délai non communiqué")

### 1.2 Statuts déjà en place

`StockStatut`, `MOCK_BOOKS` avec `STOCK_OVERRIDES`, règles nouveauté/fonds : aucun changement requis.

---

## 2. `StockStatus.tsx` (nouveau composant)

**Chemin :** `src/components/ui/StockStatus.tsx`

### Comportement visuel

| Statut | Icône | Libellé | Couleur texte | Tooltip ⓘ |
|--------|-------|---------|---------------|-----------|
| disponible | ✅ | Disponible | #2E7D32 | aucun |
| stock_limite | ⚠️ | Stock limité | #C17E00 | aucun |
| sur_commande | 🔄 | Sur commande | #5B7A9E | "Commande spéciale auprès de l'éditeur — délai 7 à 15 jours ouvrés" |
| en_reimp | 🔁 | En réimpression | #A07040 | "Délai prévu : {delaiReimp}" ou "Délai non communiqué" |
| epuise | ❌ | Épuisé | #999999 | aucun |

### Règles de style

- Police : `Roboto, arial, sans-serif` — 11.5px / weight 500
- Pas de fond coloré, pas de bordure, pas de border-radius
- Le ⓘ est un caractère Unicode `ⓘ` stylé en gris, curseur `help`
- Tooltip : fond navy `#1E3A5F`, texte blanc, 11px, `border-radius: 6px`, `padding: 6px 10px`, max-width 240px
- Tooltip positionné en `position: fixed` calculé au hover (évite overflow card)

### Props

```ts
interface StockStatusProps {
  statut: StockStatut
  delaiReimp?: string
  className?: string
}
```

---

## 3. Remplacement de `StockBadge` par `StockStatus`

`StockBadge` n'est plus utilisé directement dans les vues — le fichier reste dans le repo mais n'est plus importé par BookCard, BookCardRow, FicheProduitPage.

### 3.1 `BookCard.tsx`

- Remplacer `<StockBadge statut={book.statut} />` par `<StockStatus statut={book.statut} delaiReimp={book.delaiReimp} />`
- Passer `book.delaiReimp` dans l'appel
- Typo unifiée (voir §5)

### 3.2 `BookCardRow.tsx`

- Supprimer `<StockBadge>` dans Col 1 → `<StockStatus>`
- Remplacer la section `AvailStatus` (dot vert + "Available" hardcodé) par `<StockStatus statut={book.statut ?? 'disponible'} delaiReimp={book.delaiReimp} />`
- Pour les `a-paraitre` : afficher "À paraître" (texte simple, pas de StockStatus)

---

## 4. Filtre disponibilité — `FondsPage.tsx`

### Layout

```
[Tous] [BD/Mangas] [Jeunesse] [Littérature] [Adulte-pratique]   |   [Tous] [✅ Disponible] [⚠️ Stock limité] [🔄 Sur commande] [🔁 En réimpression] [❌ Épuisé]       6 titres →
```

- La ligne de filtres est une `FilterRow` flex avec le séparateur `|` (`VDivider`) entre les deux groupes
- Le compteur "X titres" est aligné à droite de la même ligne
- Style pills : sélectionné = fond navy / texte blanc ; non sélectionné = fond blanc / bordure gris / texte navy — même style que `UniverseFilter`

### Logique

```ts
const [statut, setStatut] = useState<StockStatut | null>(null)

let books = /* filtre univers + recherche existants */
if (statut) books = books.filter(b => b.statut === statut)
```

Les deux filtres sont cumulatifs (ET). Pas de modification du `ResultCount` existant — il reflète déjà le bon nombre après filtrage.

---

## 5. Typographie unifiée — BookCard

| Élément | Taille | Poids | Couleur |
|---------|--------|-------|---------|
| Titre | 14px | 700 | #1A2332 |
| Auteur | 12px | 400 italic | #555555 |
| Éditeur · Collection | 11px | 400 | #888888 |
| ISBN | 12px | 400 | #666666 |
| Prix | 20px | 800 | #1A2332 |
| Label "Prix public TTC" | 10px | 400 | #AAAAAA |
| Statut dispo | 11.5px | 500 | (couleur statut) |

- `MetaPill` : supprimer `font-family: 'Roboto', sans-serif` → hérite `system-ui`
- `Title` : 15px → **14px**, weight 500 → **700**, couleur → `#1A2332`
- `Authors` : inchangé (déjà italic 12px gris)
- `Publisher` : couleur → `#888888`
- `IsbnLine` (BookCardRow) : 11px → **12px**, couleur → `#666666`
- `Price` : weight 500 → **800**, couleur → `#1A2332`
- `PriceLabel` : 11px → **10px**, couleur → `#AAAAAA`

---

## 6. CartPage — labels statut

Sous chaque `CartItem` avec `enReliquat === true` (en_reimp) :
```
🔁 Reliquat — expédition dès disponibilité
```

Sous chaque `CartItem` avec `statut === 'sur_commande'` :
```
🔄 Commande spéciale — délai 7-15 jours
```

Style : `font-size: 11px`, `color: #888888`, `font-style: italic`, `margin-top: 2px`.

### Toast reliquat

À la validation d'une commande contenant `hasReliquatItems === true`, afficher un toast après le toast de confirmation :
```
📧 Vous serez notifié par email dès l'expédition des titres en reliquat.
```

---

## 7. HistoriquePage — labels statut

Pour chaque ligne d'historique où un `CartItem` a un statut spécial (persisté dans `mockOrders`) :

- `en_reimp` : `🔁 En attente de réimpression`
- `sur_commande` : `🔄 Commande spéciale en cours`

Style identique à Cart (11px, italic, gris).

> Note : les `mockOrders` existants n'ont pas de champ `statut` par item. L'affichage sera conditionnel sur `item.statut` si présent — pas de rétroactivité sur les commandes mockées existantes.

---

## 8. Composants à créer / modifier

| Fichier | Action |
|---------|--------|
| `src/components/ui/StockStatus.tsx` | Créer |
| `src/data/mockBooks.ts` | Ajouter `delaiReimp` interface + mocks |
| `src/components/catalogue/BookCard.tsx` | Remplacer StockBadge + typo |
| `src/components/catalogue/BookCardRow.tsx` | Remplacer StockBadge + AvailStatus |
| `src/pages/fonds/FondsPage.tsx` | Ajouter filtre disponibilité |
| `src/pages/cart/CartPage.tsx` | Labels reliquat/commande spéciale + toast |
| `src/pages/historique/HistoriquePage.tsx` | Labels statut |
| `src/pages/catalogue/FicheProduitPage.tsx` | Remplacer StockBadge → StockStatus |

---

## 9. Contraintes

- `computeTotals` : intouchable
- Tests Vitest existants : intouchables
- Couleurs : jamais hardcodées en dehors de StockStatus (qui gère sa propre palette par statut)
- Commits : un par bloc fonctionnel (statuts/filtre/typo) pour faciliter le rollback
- `/verification-before-completion` avant chaque commit
