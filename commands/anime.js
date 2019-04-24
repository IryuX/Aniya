const query = require('../tools/query.js');

const Query = new query.Query();

/**
 * Afficher tous les animes dispos (en utilisant des pages)
 * Handle si jamais aucun anime n'a ete trouve
 * 
 * Handle les cas chiants genre Fruits basket, ou sao (bande de fils de putes)
 */

module.exports = {
    name: 'anime',
    description: 'infos',
    async execute(message, args, request) {
        return Query.anime(message, args, request);
    },
};