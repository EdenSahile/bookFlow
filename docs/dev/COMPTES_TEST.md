# Comptes de test — Base CRM fictive

> Ces comptes simulent la base AS400/CRM du distributeur.
> Ils permettent de tester la **connexion** et la **création d'accès** dans l'app.

---

## Connexion directe

Les comptes suivants sont pré-enregistrés avec le mot de passe `Libraire123!`.  
Identifiant accepté : **code client** ou **email**.

| Librairie | Code client | Email | Mot de passe |
|-----------|-------------|-------|-------------|
| Librairie Lira — Paris | `LIB001` | `marie.lecomte@librairie-lira.fr` | `Libraire123!` |
| Les Mots Voyageurs — Lyon | `LIB002` | `thomas.beaumont@motsvoyageurs.fr` | `Libraire123!` |
| La Page Tournée — Bordeaux | `LIB003` | `sophie.girard@lapageturne.fr` | `Libraire123!` |

---

## Création d'un accès (inscription)

Pour tester l'inscription, utiliser le **code client** et **l'email exact** du tableau ci-dessus,  
puis choisir un **nouveau mot de passe** (règles : 8 car. min, 1 majuscule, 1 chiffre, 1 caractère spécial).

Exemple avec LIB002 :
- Code client : `LIB002`
- Email : `thomas.beaumont@motsvoyageurs.fr`
- Mot de passe : `MonNouveauMdp1!`

> L'email doit correspondre exactement à celui enregistré dans le CRM — c'est la double vérification qui simule le contrôle AS400.

---

## Détails des comptes

### LIB001 — Librairie Lira
- Adresse de livraison : 12 rue du Parc, 75001 Paris
- Remise : 15 %
- Téléphone : 01 23 45 67 89

### LIB002 — Les Mots Voyageurs
- Adresse de livraison : 8 place Bellecour, 69002 Lyon
- Remise : 20 %
- Téléphone : 04 56 78 90 12

### LIB003 — La Page Tournée
- Adresse de livraison : 3 allée des Fleurs, 33000 Bordeaux
- Remise : 12 %
- Téléphone : 05 56 12 34 56
