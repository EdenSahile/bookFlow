# Notifications — Design Spec

## Résumé

Panneau de notifications accessible via l'icône cloche dans le header. Feed chronologique d'items horodatés couvrant 3 types d'événements métier. État lu/non-lu éphémère (réinitialisé à chaque ouverture de l'app).

---

## Comportement général

- **Ouverture** : clic sur l'icône cloche → panneau dropdown s'ouvre sous la cloche
- **Fermeture** : clic à l'extérieur du panneau
- **Clic sur un item** : navigation directe vers la page concernée + fermeture du panneau + item marqué comme lu
- **"Tout marquer comme lu"** : tous les items passent en état lu, badge disparaît
- **Auto-lu à la visite** : visiter la page associée à une notif la marque automatiquement comme lue
- **Persistance** : éphémère — l'état lu/non-lu repart à zéro à chaque session (pas de localStorage)

---

## Les 3 notifications

| ID | Emoji | Titre | Sous-titre | Déclencheur | Route | Auto-lu à |
|----|-------|-------|------------|-------------|-------|-----------|
| `nouveautes` | 📚 | "N nouveautés ajoutées" | Univers concernés | Livres avec `publicationDate` dans le mois courant | `/nouveautes` | Visite de NouveautesPage |
| `panier` | ⏳ | "Panier en attente" | "N articles non commandés" | `items.length > 0` dans CartContext | `/panier` | Visite de CartPage |
| `topventes` | 🏆 | "Top Ventes mis à jour" | "Nouveau classement disponible" | Mock statique — toujours actif | `/top-ventes` | Visite de TopVentesPage |

**Ordre d'affichage** : panier (urgence rouge) en premier, puis nouveautés et top ventes (info or).

---

## Design visuel

### Icône cloche

- Cercle border `gray.200`, fond `white`, icône `gray.800`
- **Non-lus > 0** : badge rouge (`#e74c3c`) en haut à droite avec compteur, border `2px solid` couleur du fond header
- **Non-lus = 0** : pas de badge, icône grisée (`gray.400`)

### Panneau dropdown

- Largeur 280px, `border-radius: 12px`, `box-shadow` prononcé
- Fond `white`, border `gray.200`
- **Header panneau** : fond `#fafaf8`, titre "Notifications" à gauche, bouton "Tout marquer lu" en or à droite
- **Items** : fond `#fffdf7` (légèrement chaud), séparateurs `gray.50`

### Item de notification

```
[Icône 36×36 arrondie] [Titre bold]          [Temps]  [• point]
                        [Sous-titre gris]
                        [Lien "Voir →" en or]
```

- **Point non-lu** : rouge (`#e74c3c`) pour panier, or (`#C9A84C`) pour les autres
- **Item lu** : opacité 0.5, titre barré, point absent
- Icône background : vert pâle (`#E6EFE9`) pour nouveautés, jaune pâle (`#FFF3CD`) pour panier, rouge pâle (`#FDE8E8`) pour top ventes

---

## Architecture

### Nouveau composant : `NotificationsContext`

Hook `useNotifications()` exposant :

```typescript
interface Notification {
  id: 'nouveautes' | 'panier' | 'topventes'
  emoji: string
  title: string
  subtitle: string
  time: string
  route: string
  isRead: boolean
}

interface NotificationsContextValue {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: Notification['id']) => void
  markAllAsRead: () => void
}
```

État `useState` uniquement — pas de localStorage. Les notifications sont calculées au montage à partir de :
- `MOCK_BOOKS` (filtrage par mois pour nouveautés)
- `CartContext.items` (pour panier)
- Constante mock pour top ventes

### Nouveau composant : `NotificationBell`

Bouton cloche + badge + panneau dropdown. Gère son propre `showPanel` (useState), fermeture au clic extérieur (useEffect + mousedown). Consomme `useNotifications()`.

### Intégration auto-lu dans les pages

Chaque page concernée appelle `markAsRead(id)` dans un `useEffect` au montage :
- `NouveautesPage` → `markAsRead('nouveautes')`
- `CartPage` → `markAsRead('panier')`
- `TopVentesPage` → `markAsRead('topventes')`

### Intégration dans le Header

`NotificationBell` remplace l'actuel `<IconBell />` + prop `hasNotif` dans `Header.tsx`. La prop `hasNotif` est supprimée.

---

## Fichiers impactés

| Fichier | Action |
|---------|--------|
| `src/contexts/NotificationsContext.tsx` | Créer |
| `src/components/layout/NotificationBell.tsx` | Créer |
| `src/components/layout/Header.tsx` | Remplacer IconBell + supprimer prop `hasNotif` |
| `src/pages/nouveautes/NouveautesPage.tsx` | Ajouter `markAsRead('nouveautes')` |
| `src/pages/cart/CartPage.tsx` | Ajouter `markAsRead('panier')` |
| `src/pages/top-ventes/TopVentesPage.tsx` | Ajouter `markAsRead('topventes')` |
| `src/App.tsx` | Envelopper avec `NotificationsProvider` |

---

## Hors scope

- Notifications persistantes (localStorage / API)
- Flash infos ou autres types de notifications
- Animations d'entrée du panneau (hors scope pour l'instant)
- Son ou vibration
