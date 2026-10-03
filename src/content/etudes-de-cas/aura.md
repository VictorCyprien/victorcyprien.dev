---
title: "AURA : le back-end et l'infrastructure d'une plateforme de coaching"
seoTitle: "AURA : back-end et infrastructure, fitness et nutrition"
seoDescription: "Coaching sport et nutrition, en marque blanche et grand public : j'en porte le back-end et l'infrastructure, trois API FastAPI sur Railway et Supabase."
summary: "Plateforme de coaching sport et nutrition, en marque blanche et grand public. J'en porte le back-end et l'infrastructure : trois API FastAPI, Railway, Supabase."
brief:
  need: "BeAble2 voulait une plateforme de coaching sport et nutrition, pour le grand public et pour des marques qui la prendraient en marque blanche."
  work: "Je porte le back-end et l'infrastructure : trois API, l'hébergement chez Railway et Supabase, la surveillance et les tests de charge."
  result: "L'application est en production, en bêta fermée, et les tests de charge valident la prochaine étape de croissance."
sector: Sport et nutrition, B2C et B2B2C
period: { start: "2026-01", end: null }
stack: [Python, FastAPI, Supabase, Railway, Sentry, Flutter, Next.js]
principles: [dimensionner, dormir, surveiller]
order: 2
draft: false
---

## Contexte

AURA est une plateforme de coaching sport et nutrition portée par BeAble2. Pour le grand public, c'est une application mobile, sur Android et iOS. Les marques peuvent la prendre en marque blanche : chacune reçoit sa version de l'application mobile et du back-office, adaptée à son image. Le projet est sous NDA : cette étude montre l'architecture et les décisions, pas les clients ni leurs données.

## Mon rôle

Je m'occupe du back-end et de l'infrastructure.

## Contraintes

- Deux développeurs sur le back-end.
- Des marques qui n'ont rien à gérer de leur côté.
- Des données séparées d'une marque à l'autre.

## Décisions

### Découper l'application en trois moteurs

L'application est découpée en trois moteurs : nutrition, fitness et communauté. Chacun est une API à part, en Python avec FastAPI, hébergée comme un service séparé sur Railway. Les applications mobiles, en Flutter, et les back-offices, en Next.js, appellent les trois. Une marque prend l'ensemble, et un particulier peut n'en utiliser qu'un, la nutrition par exemple.

### Tout héberger pour les marques

On héberge pour les marques les API et les back-offices sur Railway, et la surveillance reste chez nous. Chaque marque a sa propre base dans notre organisation Supabase : cette base lui appartient, et ses données restent séparées de celles des autres. La base du grand public, elle, appartient à BeAble2.

### Du VPS au cloud managé

Au départ, l'API et la base, un Supabase auto-hébergé, tournaient sur un VPS. Les premiers tests de charge ont montré la limite de ce montage : base, authentification et API se disputaient les mêmes processeurs. On a donc confié la base à Supabase cloud, qui gère les sauvegardes, les mises à jour et la disponibilité, et on n'est jamais revenus en arrière.

### D'AWS à Railway

Sur le conseil d'un spécialiste du cloud, l'infrastructure est ensuite passée sur AWS, décrite avec Terraform. Ce montage était taillé pour une échelle qui n'était pas la nôtre. Avec peu d'utilisateurs, les fonctions serverless démarraient à froid à presque chaque requête. Il y avait trop de services à gérer pour deux personnes, et une seule pouvait mettre en ligne. Au bout de quelques mois, on est passés sur Railway. La multi-région attendra que le trafic la justifie.

## Ce que j'ai construit

### La surveillance

Sentry remonte les erreurs et Railway fournit les métriques. Tant que ça suffit, on n'ajoute rien de plus.

### Les tests de charge

Sur Railway, j'ai mené une campagne de tests en visant la charge de la prochaine étape de croissance. Les premières mesures étaient loin du compte. J'ai trouvé trois causes : trop peu de connexions à la base par processus, un seul processus par instance au lieu de deux, et un test plus lourd que l'usage réel. Côté nutrition, une recherche lisait en plus toute la table au lieu d'utiliser son index.

## Résultat

### Ce qui a changé

Avec la base chez Supabase cloud, l'API ne partage plus ses processeurs avec la base et l'authentification. Depuis le passage sur Railway, un push déploie, n'importe qui dans l'équipe peut mettre en ligne, un clic ramène la version précédente, et la préproduction se gère au même endroit que la production. Après les corrections, le moteur fitness atteint le débit visé. Côté nutrition, la seule limite qui reste est la taille de la base, qui dépend du budget qu'on lui donne.

### Fausses pistes

Pendant les tests de charge, le code et la puissance des machines semblaient les causes évidentes. Les mesures ont montré que ce n'était ni l'un ni l'autre : les vraies causes étaient les réglages et le test lui-même.

### Résultat concret

L'application est en production, en bêta fermée, avec une préproduction séparée. Le test d'endurance a tenu deux heures sans erreur, et des créations de comptes simultanées n'ont produit aucun doublon. Prochaine étape : l'ouverture de la bêta.

## Ce que je ferais différemment

- Je confronterais un conseil d'expert à notre échelle avant de le suivre. AWS nous a coûté quelques mois sur une infrastructure taillée pour un trafic qu'on n'avait pas.
- Je passerais tout de suite au cloud managé, au lieu de refaire sur le VPS le montage auto-hébergé de [Contrapp](/etudes-de-cas/contrapp/).
