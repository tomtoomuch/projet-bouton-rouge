# Pipeline de déploiement CI/CD

La première étape après la récupération du code est d'isoler les fonctionnalités de l'application afin de pouvoir effectuer des tests unitaires efficaces.

On isole également les fonctionnalits de serveur afin de pouvoir le tester sans avoir besoin de le lancer.

## Tests unitaires

POST /login
- Accepte username et password.
- Renvoie 200 si les identifiants correspondent à admin et docker.
- Renvoie 401 si les identifiants sont incorrects.

POST /click
- Accepte un compteur entier compris entre 1 et 30.
- Renvoie le message correspondant au numéro du clic.
- Indique finished: true au 30e clic.
- Renvoie 400 si le compteur est invalide.

| Fonctionnalité | Scénarios |
| --- | --- |
| Connexion | Identifiants valides, mauvais mot de passe, mauvais utilisateur, corps vide ou absent |
| Clics | Clics 1, 5 et 30 |
| Validation | 0, -1, 31, 1.5, chaîne, null, booléen et valeur absente |
| HTTP | Route inconnue et code 404 |

es tests couvrent les identifiants valides et invalides, les bornes du compteur, les types incorrects et la fin du scénario. Ils réutilisent le tableau messages du projet pour vérifier le message renvoyé.

