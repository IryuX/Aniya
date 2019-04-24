const norm = require("./norm.js");
const Discord = require("discord.js");
const Norm = new norm.Norm();

module.exports.Query = class Query {

    anime(message, args, request) {
        var anime = args.join(' '),
        query = `
        query ($search: String) {
            Page(page:1, perPage:4) {
                media (search: $search, type: ANIME, format: TV) {
                    title {
                        romaji
                        english
                    }
                    startDate {
                        year
                        month
                    }
                    status
                    averageScore
                    duration
                    episodes
                    coverImage {
                        medium
                        color
                    }
                    siteUrl
                    nextAiringEpisode {
                        episode
                        timeUntilAiring
                    }
                }                
            }

        }
        `,
        variables = {
            search: anime,
        };

        var url = 'https://graphql.anilist.co',
        options = {

            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        request.post(url, options, (err, response, body) => {
            if(!err && response.statusCode == 200) {
                var i = JSON.parse(body);
                var j = i.data.Page.media;

                var animes = []
                var o_title = j[0].title.romaji;

                j.forEach(e => {
                    if (e.title.romaji == o_title) {
                        animes.push(e);
                    };
                });
                animes.forEach(e => {
                        var
                        t_ro = e.title.romaji,
                        status = e.status,
                        avgScore = e.averageScore,
                        duration = e.duration,
                        episodes = Norm.normEpisodes(e),
                        siteUrl = e.siteUrl,
                        o_color = e.coverImage.color, color = parseInt(o_color.slice(1), 16),
                        icon = "https://anilist.co/img/icons/favicon-32x32.png",
                    img = e.coverImage.medium;
                    var length = duration != null ? duration + 'm' : "-";
                    var ratio = avgScore != null ? avgScore + '%' : "-";
                    let data = {
                        color: color,
                        footer: {
                            text: `Average score : ${ratio}`,
                            icon_url: icon
                        },
                        image:{
                            url: img
                        },
                        title: t_ro,
                        description: Norm.createDesc(e),
                        url: siteUrl,
                        fields: [
                            {
                                name: "Status",
                                value: Norm.normStatus(status),
                                inline: true
                            },
                            {
                                name: "Number of episodes",
                                value: episodes,
                                inline: true
                            },
                            {
                                name: "Episode length",
                                value: length,
                                inline: true
                            }
                        ]
                    };
                    message.channel.send(new Discord.RichEmbed(data));
                });
               
            }
        });


    }
};