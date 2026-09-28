---
title: "AURA : une plateforme de coaching sport et nutrition"
summary: "Application de coaching sport et nutrition, pour le grand public et en marque blanche. J'en porte le back-end et l'infrastructure."
sector: Sport et nutrition, B2C et B2B2C
period: { start: "2026-01", end: null }
stack: [Python, FastAPI, Supabase, Railway, Sentry, Flutter, Next.js]
order: 2
draft: true
---

## Contexte

AURA est une plateforme de coaching sport et nutrition portée par BeAble2. Le grand public l'utilise depuis une application mobile, sur Android et iOS. Les marques la prennent en marque blanche : chacune reçoit sa version de l'application mobile et du back-office, adaptée à son image. Le projet est sous NDA : cette étude montre l'architecture et les décisions, pas les clients ni leurs données.

## Mon rôle

Je m'occupe du back-end et de l'infrastructure. On est deux développeurs sur le back-end.

## Décisions

### Découper l'application en trois moteurs

L'application est découpée en trois moteurs : nutrition, fitness et communauté. Chacun est une API à part, en Python avec FastAPI, hébergée comme un service séparé sur Railway. Les applications mobiles, en Flutter, et les back-offices, en Next.js, appellent les trois. Une marque prend l'ensemble, et un particulier peut n'en utiliser qu'un, la nutrition par exemple.

### Tout héberger pour les marques

Les marques n'ont presque rien à gérer de leur côté. On héberge pour elles les API et les back-offices sur Railway, et la surveillance reste chez nous. Chaque marque a sa propre base dans notre organisation Supabase : cette base lui appartient, et ses données restent séparées de celles des autres. La base du grand public, elle, appartient à BeAble2.

### Du VPS au cloud managé

Au départ, l'API et la base, un Supabase auto-hébergé, tournaient sur un VPS. Les premiers tests de charge ont montré la limite de ce montage : base, authentification et API se disputaient les mêmes processeurs. On a donc confié la base à Supabase cloud, qui gère les sauvegardes, les mises à jour et la disponibilité, et on n'est jamais revenus en arrière.

### D'AWS à Railway

Sur le conseil d'un spécialiste du cloud, l'infrastructure est ensuite passée sur AWS, décrite avec Terraform. Ce montage était taillé pour une échelle qui n'était pas la nôtre. Avec peu d'utilisateurs, les fonctions serverless démarraient à froid à presque chaque requête. Il y avait trop de services à gérer pour deux personnes, et une seule pouvait mettre en ligne.

Au bout de quelques mois, on est passés sur Railway. Un push déploie, n'importe qui dans l'équipe peut mettre en ligne, un clic ramène la version précédente, et la préproduction se gère au même endroit que la production. La multi-région attendra que le trafic la justifie.

### Voir la production dès le premier jour

Sentry remonte les erreurs et Railway fournit les métriques. Tant que ça suffit, on n'ajoute rien de plus.

### Tenir la charge

Sur Railway, j'ai mené une campagne de tests en visant la charge de la prochaine étape de croissance. Les premières mesures étaient loin du compte. Le code et la puissance des machines semblaient les causes évidentes, et les mesures ont montré que ce n'était ni l'un ni l'autre. Il y avait trop peu de connexions à la base par processus, un seul processus par instance au lieu de deux, et un test plus lourd que l'usage réel. Une fois ces points corrigés, le moteur fitness atteint le débit visé.

Côté nutrition, une recherche lisait toute la table au lieu d'utiliser son index. Après correction, la seule limite qui reste est la taille de la base, qui dépend du budget qu'on lui donne. Le test d'endurance a tenu deux heures sans erreur, et des créations de comptes simultanées n'ont produit aucun doublon.

## Résultat

L'application est en production, en bêta fermée, avec une préproduction séparée. Prochaine étape : l'ouverture de la bêta.
