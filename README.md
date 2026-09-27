# victorcyprien.dev

Site vitrine de Victor Cyprien, développeur freelance back-end et DevOps à Toulouse.

Site statique construit avec [Astro](https://astro.build) et Tailwind. Aucun serveur, aucun cookie, aucune statistique de visite.

## Lancer le site en local

```bash
npm ci
npm run dev        # http://localhost:4321
```

Node 22.18 ou plus récent.

## Modifier le contenu

Tout le contenu est dans des fichiers texte. Aucun code à toucher.

| Contenu | Fichier |
|---|---|
| Nom, titre, accroche, à propos, liens, adresse du bouton d'appel | `src/data/site.yaml` |
| Les principes de « Comment je décide » | `src/data/principes.yaml` |
| Le parcours | `src/data/parcours.yaml` |
| La stack | `src/data/stack.yaml` |
| Un projet | un fichier dans `src/content/projets/` |
| Une étude de cas | un fichier dans `src/content/etudes-de-cas/` |

- Une étude ou un projet en `draft: true` apparaît en local et sur la préproduction, jamais en production.
- Un fait manquant s'écrit `[À COMPLÉTER : ce qui manque]`. La production refuse de se publier tant qu'il en reste un dans une page publiée.
- Les dates s'écrivent `AAAA-MM`. Une date de fin vide (`null`) veut dire « en cours ».
- Une erreur de format (champ manquant, date invalide) fait échouer le build avec le nom du fichier en cause.

Le texte et les couleurs de l'image d'aperçu vivent dans `scripts/og.mjs`. Après un changement du nom, du titre ou des couleurs, modifier ce fichier, puis lancer `npm run og`.

## Tester

```bash
npm run check        # types et schémas de contenu
npm run test:unit    # fonctions pures
npm run build
npm run test:build   # contenu du build (brouillons exclus)
npm run test:e2e     # navigateur : pages, liens, thème, accessibilité
npm run check:todo   # marques [À COMPLÉTER] restantes
```

Pour tester le mode préproduction : préfixer `build`, `test:build` et `test:e2e` par `PUBLIC_SITE_ENV=preview`.

## Déploiement

Hébergement Hostinger, avec son déploiement Git.

1. Un push sur `develop` ou `main` lance la GitHub Action `Test and deploy`.
2. Elle lance tous les contrôles, construit le site, puis publie `dist/` sur une branche de publication : `deploy-preview` pour `develop`, `deploy` pour `main`.
3. Hostinger suit ces branches : `deploy-preview` pour preview.victorcyprien.dev, `deploy` pour victorcyprien.dev.

Retour arrière : dans GitHub, onglet Actions, ouvrir le run d'un commit précédent sur `main` et cliquer « Re-run all jobs ». En secours : `git revert` sur `main`, puis push.
