---
title: "AURA : une plateforme de coaching sport et nutrition"
summary: "Application de coaching sport et nutrition, pour le grand public et en marque blanche. Back-end et infrastructure."
sector: Sport et nutrition, B2C et B2B2C
period: { start: "2026-01", end: null }
stack: [Python, FastAPI, Supabase, Railway, Sentry, Flutter, Next.js]
order: 2
draft: true
---

## Contexte

AURA est une plateforme de coaching sport et nutrition portée par BeAble2 : une application mobile (Android et iOS) pour le grand public, et une offre en marque blanche pour les professionnels. Le projet est sous NDA : cette étude montre l'architecture et les décisions, pas les clients ni leurs données.

## Mon rôle

Back-end et infrastructure, à deux développeurs sur le back-end.

## Décisions

### Trois moteurs plutôt qu'une application

L'application est découpée en trois moteurs : nutrition, fitness et communauté. Un client en marque blanche prend l'ensemble ; un particulier peut n'en utiliser qu'un, la nutrition par exemple. Chaque client en marque blanche a sa propre base : ses données restent séparées de celles des autres.

### Du VPS au cloud managé

Au départ, l'API et la base (Supabase auto-hébergé) tournaient sur un VPS. Nous avons confié la base à Supabase cloud : sauvegardes, mises à jour et disponibilité sont gérées par la plateforme. Nous ne sommes jamais revenus en arrière.

### D'AWS à Railway

Sur le conseil d'un spécialiste, l'infrastructure est ensuite passée sur AWS, décrite avec Terraform. Elle était taillée pour une échelle qui n'était pas la nôtre. Avec peu d'utilisateurs, les fonctions serverless démarraient à froid à presque chaque requête. Il y avait trop de services à gérer pour deux personnes, et une seule pouvait mettre en ligne. Au bout de quelques mois, nous avons migré vers Railway. Un push déploie, tout le monde dans l'équipe peut mettre en ligne, un clic revient en arrière, et la production comme la préproduction se gèrent au même endroit. La multi-région attendra que le trafic la justifie.

### Voir la production dès le premier jour

Sentry remonte les erreurs, Railway fournit les métriques. Rien de plus tant que ça suffit.

### Tenir la charge

[À COMPLÉTER : les tests de charge, à écrire après lecture des documents de Victor.]

## Résultat

L'application est en production, en bêta fermée, avec une préproduction séparée. Prochaine étape : l'ouverture de la bêta.
