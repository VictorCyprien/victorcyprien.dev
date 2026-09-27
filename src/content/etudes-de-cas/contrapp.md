---
title: "Contrapp : les contrats d'apprentissage des CFA"
summary: "Plateforme SaaS B2B qui gère les contrats d'apprentissage des centres de formation. Back-end, facturation et infrastructure, jusqu'à la mise en production."
sector: Formation professionnelle
period: { start: "2025-07", end: "2026-01" }
stack: [Python, FastAPI, Supabase, Stripe, Railway, VPS Linux, Docker, Grafana, Prometheus, Loki]
order: 1
draft: true
---

## Contexte

Les centres de formation d'apprentis (CFA) suivent chaque contrat d'apprentissage, de sa création à sa signature. [À COMPLÉTER : le problème concret du client avant Contrapp.]

## Mon rôle

Back-end et DevOps : l'API, la base de données, la facturation et toute l'infrastructure, de la conception à la mise en production.

## Décisions

### Un back-end Python sur Supabase

API en Python avec FastAPI, base PostgreSQL managée par Supabase, authentification déléguée à Supabase. Chaque table a sa règle d'accès, refusée par défaut. [À COMPLÉTER : pourquoi Supabase plutôt qu'une base gérée à la main.]

### Stripe pour la facturation

[À COMPLÉTER : le modèle de facturation et ce que Stripe a évité de développer.]

### Railway et un VPS Linux

[À COMPLÉTER : ce qui tourne sur Railway, ce qui tourne sur le VPS, et pourquoi ce partage.]

### La surveillance dès la mise en production

Grafana, Prometheus et Loki sont en place dès la première mise en ligne : les erreurs, les lenteurs et les ressources sont visibles avant le premier incident.

## Résultat

Plateforme livrée et mise en production en janvier 2026. [À COMPLÉTER : ce que la plateforme permet aux centres de formation, au présent, sans aucun chiffre.]
