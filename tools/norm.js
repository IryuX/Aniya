String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.removeUnderScore = function() {
    return this.replace(/_/g, " ");
}


module.exports.Norm = class Norm {
    normStatus(status) {
        return status.removeUnderScore().toLowerCase().capitalizeFirstLetter();
    }

    normEpisodes(e) {
        if (e.episodes === null) {
            if (e.nextAiringEpisode === null) {
                return "-";
            } else {
                return e.nextAiringEpisode.episode - 1;
            }
        } else {
            return e.episodes;
        }
    }

    timeUntil(t) {
        //Days 
        var d = (Math.trunc(t/(60*60*24))) + "d ";
        if (Math.trunc(t/(60*60*24)) == 0 ) d = "";
        //Hours
        var h = (Math.trunc(t/(60*60) % 24)) + "h ";
        if (Math.trunc(t/(60*60)) % 24 == 0 ) h = "";
        //Minutes
        var m = (Math.trunc(t/(60) % 60)) + "m";
        if (Math.trunc(t/(60) % 60) == 0 ) m = "";
        return `${d}${h}${m}`;
    }

    createDesc(e) {
        if (e.status === "RELEASING") {
            var t = this.timeUntil(e.nextAiringEpisode.timeUntilAiring);
            return `Next episode in: ${t}`;
        } else if (e.status === "FINISHED" | "CANCELLED") {
            return e.title.english;
        } else if (e.status === "NOT_YET_RELEASED") {
            let y = e.startDate.year,
            m = e.startDate.month;
            return `Start Date: ${m}/${y}`;
        }
    }
}