---
title: "Contrapp : les contrats d'alternance des CFA"
summary: "Plateforme SaaS où les CFA créent leurs contrats d'alternance et les font signer en ligne. J'ai pris en charge l'API, la base de données, la facturation et l'infrastructure, jusqu'à la mise en production."
sector: Formation professionnelle
period: { start: "2025-07", end: "2026-01" }
stack: [Python, FastAPI, Supabase, Stripe, DocuSign, VPS Linux, Docker, Grafana, Prometheus, Loki, React, Vite]
order: 1
draft: true
---

## Contexte

Un entrepreneur qui travaillait dans un CFA voyait son équipe buter sur le logiciel du marché qu'elle utilisait pour créer les contrats d'alternance : interface peu intuitive, comptes en double pour une même adresse email. Avec le CEO de BeAble2, il a lancé Contrapp, un SaaS sur mesure pour créer et signer un contrat d'alternance en quelques clics.

## Mon rôle

Back-end et DevOps. J'ai repris l'API, conçu la base Supabase et intégré Stripe, puis monté le serveur et sa surveillance jusqu'à la mise en production.

## Décisions

### Reprendre l'API avant d'ajouter des fonctionnalités

L'API existait déjà, sous forme de démo écrite sans conventions : la même logique copiée d'une route à l'autre, des accès à la base un peu partout. J'ai repris les points d'entrée un par un pour séparer les rôles. La route reçoit la requête, un service porte la logique métier, et l'accès aux données est regroupé. L'API est devenue plus simple à maintenir et à faire évoluer.

### Supabase pour ne pas tout développer

On a choisi Supabase parce qu'il apporte, avec PostgreSQL, l'authentification, le stockage de fichiers et les règles d'accès par ligne. Ce sont des briques qu'on n'a pas eu à développer ni à héberger à part.

### Stripe pour la facturation

La facturation se fait au contrat, par paliers, avec un tarif adapté à la taille de chaque CFA. On a pris Stripe pour les paiements, car c'est un acteur de référence et son SDK est très bien documenté. On n'a eu aucun module de paiement à écrire ni à sécuriser nous-mêmes.

### Un seul serveur, tout au même endroit

Front, API, base Supabase et surveillance tournent sur un même VPS Linux, dans des conteneurs Docker. L'équipe découvrait encore le cloud : c'était le montage le plus simple à comprendre et à maîtriser.

### La surveillance dès la mise en production

Grafana, Prometheus et Loki sont en place dès la première mise en ligne. Les erreurs, les lenteurs et l'usage des ressources du serveur sont visibles avant le premier incident.

## Résultat

Plateforme livrée et mise en production en janvier 2026. Un CFA y crée ses contrats d'alternance et les envoie en signature à l'entreprise et à l'alternant, via DocuSign. Son équipe y travaille à plusieurs, chacun avec son rôle.
