const AVTYPE_AUDIO = 'audio';
const AVTYPE_VIDEO = 'video';
const DIST_CHANNEL_TELEVISION = 'televisie';

export class MediaItem {
    constructor(item) {
        this.item = item.tuple[1].attributes;
    }

    getData() {
        return {
            'avtype' : this.avtype,
            'date' : this.date,
            'description' : this.description,
            'playerId' : this.playerId,
            'startTime' : this.startTime,
            'title' : this.title
        };
    }

    get avtype() {
        if (!this.hasPublication) {
            return null;
        } else if (
            this.publication.distributionchannel === DIST_CHANNEL_TELEVISION &&
            this.item.carrierreference
        ) {
            return AVTYPE_VIDEO;
        } else if (this.item.dmguid) {
            return AVTYPE_AUDIO;
        } else {
            return null;
        }
    }

    get date() {
        if (this.hasPublication) {
            return this.publication.startdate.split('-').reverse().join('-');
        } else {
            return null;
        }
    }

    get description() {
        return this.item.description;
    }

    get hasPublication() {
        return Boolean(
            this.item.program &&
            this.item.program.publication &&
            this.item.program.publication[0]
        );
    }

    get playerId() {
        if (this.avtype === AVTYPE_VIDEO) {
            return this.item.carrierreference;
        } else if (this.avtype === AVTYPE_AUDIO) {
            return this.item.dmguid;
        } else {
            return null;
        }
    }

    get publication() {
        if (this.hasPublication) {
            return this.item.program.publication[0];
        }
    }

    get startTime() {
        if (this.playerId) {
            let start = this.item.startoncarrier - this.item.startoffset;

            if (isNaN(start)) {
                start = 0;
            }

            return start;
        } else {
            return null;
        }
    }

    get title() {
        return this.item.maintitles;
    }
}