# Sabrille — Site vitrine (nettoyage & entretien)

Site web moderne, responsive et statique pour **Sabrille**, service de nettoyage
et d'entretien en Suisse. Il reprend l'offre du site de réservation existant
([SimplyBook](https://sabrille.simplybook.it/v2/)) en l'améliorant : présentation
soignée, services détaillés, tarifs clairs, avis clients et formulaire de devis.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et contenu de la page |
| `assets/styles.css` | Design system, mise en page, responsive |
| `assets/script.js` | Menu mobile, animations au défilement, formulaire de devis |

## Aperçu local

Aucune dépendance. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Prestations mises en avant

- Nettoyage résidentiel (flexible & intermédiaire)
- Entretien de bureaux et locaux commerciaux
- Nettoyage à fond / fin de bail
- Vitres, espaces fitness, conteneurs & sanitaires mobiles

Le bouton **Réserver** pointe vers la réservation en ligne SimplyBook existante.
Le formulaire de devis ouvre un email pré-rempli (`contact@sabrille.ch`).

## À personnaliser

- Email / téléphone / adresse réels
- Photos et logo de Sabrille
- Avis clients authentiques
- Éventuel hébergement (GitHub Pages, Netlify…)
