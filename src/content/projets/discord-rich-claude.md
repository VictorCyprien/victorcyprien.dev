---
name: discord-rich-claude
period: { start: "2026-09", end: "2026-09" }
summary: "Affiche sur un profil Discord la session Claude Code en cours : activité, modèle, tokens, durée. Un daemon local reçoit les hooks de Claude Code par un socket Unix, et rien ne part sur le réseau. L'installation montre ses changements et attend une confirmation avant d'écrire."
stack: [Python, pypresence, launchd]
featured: false
personal: true
order: 5
---
