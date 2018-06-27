import { map } from 'lodash';
import { secondsToHms } from './util.js';

const AVTYPE_AUDIO = 'audio';
const AVTYPE_VIDEO = 'video';
const DIST_CHANNEL_TELEVISION = 'televisie';
const SUBTITLE_TYPE = 'http://example.org/tt888/subtitle';
const TRANSCRIPT_TYPE = 'http://example.org/transcript';

function getHitType(hit) {
    if (hit.class.includes(SUBTITLE_TYPE)) {
        return 'subtitle';
    } else if (hit.class.includes(TRANSCRIPT_TYPE)) {
        return 'transcript';
    } else {
        return null;
    }
}

function parseProgram(program) {
    const attrs = program.attributes;

    return Object.assign(attrs, {
        title : attrs.maintitles || null,
        description : attrs.description || attrs.summary || null
    });
}

function parseHit(hit) {
    const type = getHitType(hit);
    const attrs = hit.attributes;

    attrs.type = type;

    if (type === 'transcript') {
        return Object.assign(attrs, {
            title : attrs.maintitles || null,
            description : attrs.description || attrs.summary
        });
    } else if (type === 'subtitle') {
        return Object.assign(attrs, {
            title : null,
            description : attrs.TextField
        });
    }
}

export class MediaItem {
    constructor(item) {
        this.program = parseProgram(item.tuple[0]);
        this.hit = parseHit(item.tuple[1]);

        if (this.program) {
            this.item = this.program.attributes;
        } else {
            throw new Error('Could not find a proper type for this item');
        }
    }

    getData() {
        return {
            hit : this.hit,
            media : this.media,
            program : this.program
        };
    }

    get avtype() {
        if (!this.hasPublication) {
            return null;
        } else if (
            this.publication.distributionchannel === DIST_CHANNEL_TELEVISION &&
            this.program.carrierreference
        ) {
            return AVTYPE_VIDEO;
        } else if (this.program.dmguid) {
            return AVTYPE_AUDIO;
        } else {
            return null;
        }
    }

    get broadcasters() {
        if (this.hasPublication) {
            return map(this.publication.broadcaster, 'name');
        }
    }

    get date() {
        if (this.hasPublication) {
            return this.publication.startdate.split('-').reverse().join('-');
        } else {
            return null;
        }
    }

    get distributionchannel() {
        return this.hasPublication ? this.publication.distributionchannel : null;
    }

    get duration() {
        return this.program.duration ? secondsToHms(this.program.duration / 1000) : null;
    }

    get externalId() {
        return this.program.externalID || null;
    }

    get hasPublication() {
        return this.program.publication &&
               this.program.publication.length > 0;
    }

    get media() {
        return {
            avtype : this.avtype,
            broadcasters : this.broadcasters,
            distributionchannel : this.distributionchannel,
            date : this.date,
            duration : this.duration,
            externalId : this.externalId,
            playerId : this.playerId,
            startInSeconds : this.startTime / 1000,
            startInHms : secondsToHms(this.startTime / 1000)
        };
    }

    get playerId() {
        if (this.avtype === AVTYPE_VIDEO) {
            return this.program.carrierreference;
        } else if (this.avtype === AVTYPE_AUDIO) {
            return this.program.dmguid;
        } else {
            return null;
        }
    }

    get publication() {
        if (this.hasPublication) {
            return this.program.publication[0];
        } else {
            return null;
        }
    }

    get startTime() {
        if (this.playerId) {
            if (this.hit.type === 'subtitle') {
                return this.hit.TimeCodeIn - this.publication.starttime;
            } else if (this.hit.type === 'transcript') {
                return this.hit.starttime - this.publication.starttime;
            }
        } else {
            return null;
        }
    }
}