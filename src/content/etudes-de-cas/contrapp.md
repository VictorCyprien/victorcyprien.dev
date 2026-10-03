---
title: "Contrapp : reprise d'API et mise en production d'un SaaS pour CFA"
summary: "SaaS conçu pour que les CFA créent et fassent signer leurs contrats d'alternance en ligne. J'ai repris l'API, amélioré la base Supabase et monté l'infrastructure jusqu'en production."
brief:
  need: "Un CFA voulait créer ses contrats d'alternance et les faire signer sans se battre avec le logiciel qu'il utilisait."
  work: "J'ai repris l'API, amélioré la base Supabase, intégré Stripe, puis monté le serveur et sa surveillance."
  result: "Plateforme livrée et mise en production en janvier 2026. Le CFA y a créé ses contrats et les a envoyés en signature à l'entreprise et à l'alternant."
sector: Formation professionnelle
period: { start: "2025-07", end: "2026-01" }
stack: [Python, FastAPI, Supabase, Stripe, DocuSign, VPS Linux, Docker, Grafana, Prometheus, Loki, React, Vite]
principles: [surveiller, fermer]
order: 1
draft: false
---

## Contexte

Un entrepreneur qui travaillait dans un CFA voyait son équipe buter sur le logiciel du marché qu'elle utilisait pour créer les contrats d'alternance : interface peu intuitive, comptes en double pour une même adresse email. Avec le CEO de BeAble2, il a lancé Contrapp, un SaaS sur mesure pour créer et signer un contrat d'alternance en quelques clics.

## Mon rôle

Back-end et DevOps. J'ai repris l'API, amélioré la base Supabase et intégré Stripe, puis monté le serveur et sa surveillance jusqu'à la mise en production.

## Contraintes

- Une API déjà commencée, à reprendre sans repartir de zéro.
- Une équipe qui découvrait encore le cloud.
- Un contrat que deux parties doivent signer : l'entreprise et l'alternant.
- Un tarif propre à chaque CFA, selon sa taille.

## Décisions

### Remettre l'API au propre avant d'ajouter des fonctionnalités

L'API existait déjà, sous forme de démo écrite sans conventions : la même logique copiée d'une route à l'autre, des accès à la base un peu partout. J'ai repris sa structure avant d'y ajouter quoi que ce soit.

### Supabase pour ne pas tout développer

On a choisi Supabase parce qu'il apporte, avec PostgreSQL, l'authentification, le stockage de fichiers et les règles d'accès par ligne. Ce sont des briques qu'on n'a pas eu à développer ni à héberger à part.

### Stripe pour la facturation

La facturation se fait au contrat, par paliers, avec un tarif adapté à la taille de chaque CFA. On a pris Stripe pour les paiements, car c'est un acteur de référence et son SDK est très bien documenté. On n'a eu aucun module de paiement à écrire ni à sécuriser nous-mêmes.

### Un seul serveur, tout au même endroit

Front, API, base Supabase et surveillance sur un même VPS Linux, dans des conteneurs Docker. Pour une équipe qui découvrait le cloud, c'était le montage le plus simple à comprendre et à maîtriser.

## Ce que j'ai construit

### Une API en couches

J'ai repris les points d'entrée un par un. La route reçoit la requête, un service porte la logique métier, et l'accès aux données est regroupé au même endroit.

### La surveillance dès la mise en production

Grafana, Prometheus et Loki sont en place dès la première mise en ligne. Les erreurs, les lenteurs et l'usage des ressources du serveur sont visibles avant le premier incident.

## Résultat

### Ce qui a changé

Avant la reprise, chaque route refaisait sa propre vérification d'accès, avec sa requête à la base. Maintenant, cette logique vit dans un service, et une nouvelle fonctionnalité s'appuie dessus au lieu de la recopier. L'API est plus simple à maintenir et à faire évoluer.

### Fausses pistes

Pour savoir quelle charge la plateforme tient, j'ai d'abord lancé les tests de charge depuis mon Mac. Les résultats étaient pires que sur le VPS, qui avait pourtant moins de ressources. La mesure était faussée : sur macOS, Docker tourne dans une machine virtuelle, plus lente sur le disque et le réseau, et l'outil qui envoyait les requêtes partageait le processeur avec l'API. J'ai arrêté les tests sur le Mac.

### Résultat concret

Plateforme livrée et mise en production en janvier 2026. Un CFA y a créé ses contrats d'alternance et les a envoyés en signature à l'entreprise et à l'alternant, via DocuSign. Son équipe y a travaillé à plusieurs, chacun avec son rôle.

## Ce que je ferais différemment

- J'écrirais les conventions de code dès le premier jour. Sans règle écrite, le code dérive : la même logique copiée partout, et des appels à la base dans les routes.
- Je confierais la base à Supabase cloud dès la mise en production. Sur un même serveur, la base et l'API se disputent le processeur.
- Je testerais la charge sur la vraie cible, avec l'outil qui envoie les requêtes sur une autre machine.
