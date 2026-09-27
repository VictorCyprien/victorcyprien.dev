# CLAUDE.md

Site vitrine statique de Victor Cyprien (freelance back-end et DevOps). Astro 7, Tailwind 4, contenu en YAML et Markdown. Voir `README.md` pour les commandes.

## Règles du projet

- Le code s'écrit en anglais (identifiants, commentaires). Le texte visible s'écrit en français.
- Le contenu vit dans `src/data/` et `src/content/`, validé par les schémas de `src/content.config.ts`. Un texte affiché passe par le type `prose` du schéma, qui pose l'espace insécable avant `: ; ? !`.
- Règles de rédaction : pas de « passionné », pas d'emoji, pas de niveau auto-évalué, pas de chiffre inventé, pas de tarif. Une affirmation sans preuve est retirée. Un fait manquant s'écrit `[À COMPLÉTER : …]`.
- Aucune requête vers un tiers : polices servies par le site, pas de Google Fonts, pas de script externe, pas de cookie, pas de statistiques.
- Thème sombre par défaut. Les couleurs viennent des jetons de `src/styles/global.css`, jamais en dur dans un composant.
- Interdits visuels : intro `whoami`, point lumineux « Disponible », badges en pastille, `##` devant les titres, mot mis en valeur au milieu d'un titre, numérotation 01 / 02 / 03, flèche `→` ajoutée aux liens, apparition animée des sections.
- `.gitignore` refuse tout par défaut : un nouveau fichier ou dossier à la racine doit y être autorisé explicitement. `docs/superpowers/` (specs et plans) ne se commite jamais.
- Tests Playwright : le serveur de prévisualisation tourne avec `--ignore-lock`, sinon Astro le passe en arrière-plan quand il détecte un agent IA.
- Jamais de push sans l'accord de Victor.
