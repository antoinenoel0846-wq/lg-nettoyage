# LG Nettoyage Figeac — Contexte projet

## Vue d'ensemble
- **Client** : Bryan, ami d'Antoine, exploitant LG Nettoyage sur le secteur de Figeac (même groupe/marque que LG Nettoyage Saint-Céré — https://lg-nettoyage.fr)
- **Objectif** : site vitrine one-page (page d'accueil dans un premier temps) avec formulaire de contact simple, pour réduire les appels téléphoniques inutiles
- **Domaine envisagé** : `figeac.lg-nettoyage.fr` (sous-domaine du site principal — accès DNS à obtenir auprès de qui gère lg-nettoyage.fr)
- **Fiche Google** : "LG NETTOYAGE FIGEAC", 5,0★ (15 avis), créée le 23/03/2026
- **Adresse** : 53 Av. du Faubourg du Pin, 46100 Figeac
- **Téléphone** : 06 03 43 74 79
- **Zone d'intervention** : Figeac et proche périphérie
- **Cible prioritaire** : professionnels (bureaux, commerces, après-travaux), sans exclure les particuliers
- **Ton** : dynamique et moderne

## Assets disponibles dans ce dossier
- `logo1_blue.png` — logo LG Nettoyage Figeac, version bleue (à utiliser sur fond clair)
- `logo1_white.png` — logo LG Nettoyage Figeac, version blanche (à utiliser sur fond bleu foncé, header/footer)
- `lg-nettoyage-vitre-avant-aprés-5.jpg` — visuel avant/après nettoyage de vitres
- `personnel-le-nettoyage.jpg` — photo de Bryan en intervention
- `unnamed-3.jpg`, `unnamed-4.jpg`, `unnamed-5.jpg` — autres photos d'intervention (à identifier/trier)

## Charte graphique

### Couleurs
| Couleur | Rôle | Usage |
|---|---|---|
| `#043866` | Couleur principale (marque) | Logo, titres de premier niveau, CTA principaux, fond header/footer |
| `#1A4679` | Bleu secondaire | Hover/états actifs des boutons et liens, sous-titres, navigation |
| `#2E548D` | Bleu d'accent médium | Icônes de services, liens dans le texte, séparateurs, fonds de section alternés en aplat léger |
| `#5B7CC3` | Accent léger | Badges (ex. "5,0★"), petits éléments décoratifs, survols discrets — à utiliser avec parcimonie |
| `#FDF6F0` | Fond principal | Fond des sections (remplace un blanc pur), touche chaleureuse/moderne |

Usage sobre et professionnel : `#FDF6F0` en fond dominant partout, `#043866` réservé aux éléments à forte importance, `#5B7CC3`/`#2E548D` en touches ponctuelles seulement (jamais en aplat de fond sur une section entière). Contraste : texte foncé sur fond clair, texte blanc sur fond bleu foncé. Pas plus de 2-3 couleurs de la palette visibles par section.

### Typographie
- **Titres** : Poppins (SemiBold/Bold) — moderne, légèrement affirmée
- **Texte courant** : Inter (Regular/Medium) — très lisible, neutre et professionnel
- Corps de texte en `#043866` ou une variante gris-bleu foncé plutôt qu'un noir pur

## Structure de la page d'accueil (brouillon)
1. **Header** : logo, navigation (Accueil / Services / Avis / Contact), téléphone cliquable, CTA "Demander un devis"
2. **Hero** : accroche "Nettoyage professionnel de vitres et de locaux à Figeac" (sous-titre : "LG Nettoyage accompagne les entreprises et commerces du secteur de Figeac avec un service rapide et fiable.") — direct, orienté référencement local ; visuel (photo intervention) ; CTA principal ("Demander un devis") + secondaire ("Appeler")
3. **Présentation** de Bryan / de l'activité, rattachement au groupe LG Nettoyage, secteur Figeac
4. **Services** : éventail complet présenté à égalité (ménage général, vitres & vitrines, travaux, événement, déménagement)
5. **Zoom nettoyage de vitres** : section dédiée mise en avant — c'est le service que Bryan préfère réaliser — avec le visuel avant/après (`lg-nettoyage-vitre-avant-aprés-5.jpg`) et un CTA vers le contact
6. **Avantages différenciants** : réactivité, proximité locale, sérieux du réseau LG Nettoyage, devis en ligne rapide
7. **Avis clients** : reprendre 3-4 avis Google 5★ (Stéphane Mamoul, Yanis Ai, Léo Couderc...) + badge 5,0★ sur 15 avis
8. **Contact** : formulaire simple (nom, téléphone, email, message)
9. **Footer** : logo, navigation, lien vers le site du groupe, mentions légales

## Points encore ouverts
- [ ] Accès DNS de lg-nettoyage.fr pour créer le sous-domaine
- [ ] Statut juridique / SIRET de Bryan pour les mentions légales
- [ ] Identifier/trier les photos unnamed-3.jpg, unnamed-4.jpg, unnamed-5.jpg

## Prochaine étape : maquette visuelle
- **Format demandé** : une page HTML/CSS statique et autonome (un seul fichier ou un petit dossier `index.html` + `style.css`), facile à ouvrir dans un navigateur pour la faire valider par Bryan avant de la convertir en Elementor pour la version finale du site
- Utiliser les assets présents dans ce dossier (`logo1_blue.png`, `logo1_white.png`, les photos) et respecter la charte graphique et la structure de section décrites ci-dessus
- Responsive (mobile/desktop) même pour cette maquette, pour que Bryan juge le rendu sur son téléphone aussi

## Historique
Ce fichier reprend le contenu élaboré avec Claude (contenu détaillé de la page d'accueil dans le projet Claude "SITE ANTOINE NOEL", doc `lg-nettoyage-figeac-homepage.md`).
