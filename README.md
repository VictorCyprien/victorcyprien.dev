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
| Les services de « Ce que je fais » | `src/data/services.yaml` |
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

Hébergement Hostinger. Hostinger ne construit pas le site : il recopie une branche déjà construite par GitHub, `deploy`.

```
develop ──► GitHub Action ──► deploy/preview/  ──► preview.victorcyprien.dev
main    ──► GitHub Action ──► deploy/ (racine) ──► victorcyprien.dev
```

`develop` et `main` contiennent le code source. `deploy` ne contient que le site construit (`dist/`), et ne se modifie jamais à la main.

### À chaque push

1. Un push sur `develop` ou `main` lance la GitHub Action `Test and deploy` (`.github/workflows/deploy.yml`).
2. Elle lance tous les contrôles et construit le site. Si un contrôle échoue, rien n'est publié et les deux sites restent tels quels.
3. Elle publie `dist/` sur la branche `deploy` : à la racine pour `main`, dans `preview/` pour `develop`. Chaque push ne remplace que sa partie, l'autre reste intacte, même quand les deux publient en même temps.
4. Hostinger voit le changement de `deploy` et le recopie dans `public_html`, sans clic.

### Pourquoi une seule branche pour deux sites

Hostinger n'accepte qu'un déploiement Git par site, et range un sous-domaine dans un dossier de `public_html`. La préproduction vit donc dans `public_html/preview`, à l'intérieur du dossier de production. En faire un site Hostinger à part, avec son propre Git, demande une offre supérieure.

Ce qui la sépare de la production, ajouté à son `.htaccess` par l'étape « Keep the preview out of search engines » du workflow (jamais dans `public/.htaccess`) :

- elle refuse (403) toute adresse autre que preview.victorcyprien.dev : `victorcyprien.dev/preview/` ne montre rien ;
- elle envoie `X-Robots-Tag: noindex, nofollow`.

### À ne jamais faire

- Forcer la branche `deploy` (`push --force`) ou réécrire son historique : Hostinger fait un simple pull, il ne suivrait plus.
- Déposer ou supprimer un fichier à la main dans `public_html` : il resterait en ligne, ou absent, sans que le dépôt le montre.
- Créer une page ou un dossier `preview` dans le site (`src/pages/preview/`, `public/preview/`) : il écraserait la préproduction. Le workflow refuse de publier dans ce cas.
- Cocher « Use public_html directory » sur le sous-domaine : la préproduction afficherait la production.
- Toucher aux enregistrements DNS MX, SPF, DKIM et DMARC : ils font marcher la boîte mail du domaine. MX attendus : `mx1.hostinger.com` (priorité 5) et `mx2.hostinger.com` (priorité 10).

### Retour arrière

Dans GitHub, onglet Actions, ouvrir le run d'un commit précédent sur `main` et cliquer « Re-run all jobs » : l'ancienne production est republiée, la préproduction ne bouge pas. Seulement vers la version 1.0.1 ou plus récente : avant, le workflow effaçait `preview/`.

En secours : `git revert` sur `main`, puis push.

### Réinstaller l'hébergement

Hostinger ne fait sa première copie que dans un dossier vide, d'où cet ordre. Dans hPanel, site victorcyprien.dev :

1. Files → File Manager : vider `public_html`, fichiers cachés compris (`.htaccess`).
2. Advanced → GIT : dépôt `https://github.com/VictorCyprien/victorcyprien.dev.git`, branche `deploy`, champ dossier vide (c'est `public_html`). Create, puis Deploy.
3. Activer le déploiement automatique. Il passe par l'application GitHub de Hostinger : aucun webhook n'apparaît dans les réglages du dépôt, c'est normal.
4. Domains → Subdomains : `preview`, cocher « Custom folder for subdomain », dossier `preview`. Si Hostinger y dépose un fichier par défaut, le supprimer. Le 3 octobre 2026, le sous-domaine a été créé avant que `deploy` contienne `preview/` : vérifier que hPanel accepte un dossier déjà rempli.
5. Vérifier : les deux adresses répondent 200, `victorcyprien.dev/preview/` répond 403, et `dig +short MX victorcyprien.dev` donne toujours les deux MX ci-dessus.
