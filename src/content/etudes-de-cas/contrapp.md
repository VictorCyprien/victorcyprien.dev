---
title: "Contrapp : les contrats d'alternance des CFA"
summary: "Plateforme SaaS qui simplifie la création et la signature des contrats d'alternance pour les CFA. API, base de données, facturation et infrastructure, jusqu'à la mise en production."
sector: Formation professionnelle
period: { start: "2025-07", end: "2026-01" }
stack: [Python, FastAPI, Supabase, Stripe, DocuSign, VPS Linux, Docker, Grafana, Prometheus, Loki]
order: 1
draft: true
---

## Contexte

Un entrepreneur, qui travaillait dans un CFA, voyait son équipe buter sur le logiciel du marché utilisé pour créer les contrats d'alternance : interface peu intuitive, comptes en double pour une même adresse email. Avec le CEO de BeAble2, il a lancé Contrapp : un SaaS sur mesure pour créer et signer un contrat d'alternance en quelques clics.

## Mon rôle

Back-end et DevOps : j'ai repris l'API, conçu la base Supabase, intégré Stripe, puis monté le serveur et sa surveillance, jusqu'à la mise en production.

## Décisions

### Reprendre l'API avant d'ajouter des fonctionnalités

L'API existait déjà, sous forme de démo écrite sans conventions : logique dupliquée d'une route à l'autre, accès à la base dispersés. J'ai repris chaque point d'entrée pour séparer les rôles : la route reçoit la requête, un service porte la logique métier, l'accès aux données est regroupé. L'API est devenue plus simple à maintenir et à faire évoluer.

### Supabase pour ne pas tout réécrire

Supabase apporte PostgreSQL, et avec lui l'authentification, le stockage de fichiers et les règles d'accès par ligne. Autant de briques à ne pas développer ni héberger à part.

### Stripe pour la facturation

La facturation se fait au contrat, par paliers, avec un tarif adapté à la taille de chaque CFA. Stripe gère les paiements : un acteur de référence, avec un SDK très bien documenté. Aucun module de paiement à écrire ni à sécuriser nous-mêmes.

### Un seul serveur, tout au même endroit

Front, API, base Supabase et surveillance tournent sur un même VPS Linux, dans des conteneurs Docker. Pour une équipe qui découvrait encore le cloud, c'était le montage le plus simple à comprendre et à maîtriser.

### La surveillance dès la mise en production

Grafana, Prometheus et Loki sont en place dès la première mise en ligne : erreurs, lenteurs et ressources du serveur sont visibles avant le premier incident.

## Résultat

Plateforme livrée et mise en production en janvier 2026. Un CFA y crée ses contrats d'alternance et les envoie en signature à l'entreprise et à l'alternant. Son équipe y travaille à plusieurs, chacun avec son rôle.
