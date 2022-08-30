# Babyfoot Manager

Babyfoot Manager est une petite application permettant d'enregistrer la liste des parties entre tous vos amis ! Tout est en temps réel pour une meilleure réactivité.

Un tchat est également présent pour pouvoir discuter librement.

## Installation

Tout d'abord, vérifier si vous avez installé les différents packages nécessaires :

* NodeJS => 16.0.0 (lastest LTS)
* NPM
* PostGresSQL

1. Récupérer le dossier ou faire un clone de ce répertoire.

2. Ouvrir un terminal dans le dossier précédemment téléchargé, et installer les packages de l'application via la commande `npm install`

3. Créer un fichier `.env` et reprendre les informations du fichier `.env.exemple` ou simplement renommer le fichier. Les informations sont nécessaires pour le fonctionnement de l'application.

4. Sur votre base de données PostgresSQL, ajouter le script SQL contenu dans le dossier `config/migrations`

5. Si tout est ok jusqu'à maintenant, vous pouvez lancer l'application via la commande `npm start`


## Utilisation

Connectez vous sur l'adresse que le serveur s'est lancé puis admirez !

Vous pouvez ainsi créer une partie via le champ prévu, terminer la partie ou la supprimer.
Ensuite, vous avez accès au tchat après avoir renseigné un nom d'utilisateur. Rien n'est sauvegardé après rechargement de la page (sauf les parties évidemment).


