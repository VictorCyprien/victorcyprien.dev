---
title: "AURA : une plateforme de coaching sport et nutrition"
summary: "Application de coaching sport et nutrition avec coach IA, pour le grand public et en marque blanche. Back-end, coach IA et infrastructure."
sector: Sport et nutrition, B2C et B2B2C
period: { start: "2026-01", end: null }
stack: [Python, Supabase, Railway, Sentry, Next.js]
order: 2
draft: true
---

## Contexte

AURA regroupe une application de coaching (GymAura), trois moteurs métier, une offre en marque blanche et un programme partenaires. Le projet est porté par BeAble2 et reste sous NDA : cette étude montre l'architecture et les décisions, pas le client ni ses données.

## Mon rôle

Back-end, intégration du coach IA et infrastructure.

## Décisions

### Mesurer avant de choisir la base

Avant le lancement, un benchmark de charge a comparé PostgreSQL auto-hébergé et cloud managé. Pour un MVP, le cloud managé l'a emporté : simple, rapide à mettre en place, sans serveur à maintenir. [À COMPLÉTER : ce que le benchmark mesurait, avec les unités.]

### Un coach IA contextualisé

[À COMPLÉTER : ce que le coach sait de l'utilisateur, et comment les appels au modèle sont protégés.]

### D'AWS à Railway

L'infrastructure a d'abord tourné sur AWS, décrite avec Terraform. Elle a ensuite migré vers Railway : un push déploie, un clic revient en arrière, aucun serveur à patcher. [À COMPLÉTER : ce qui a motivé la migration.]

### Voir la prod dès le premier jour

Sentry remonte les erreurs, Railway fournit les métriques. Rien de plus tant que ça suffit.

## Résultat

[À COMPLÉTER : l'état actuel du projet et ce que la plateforme permet aujourd'hui.]
