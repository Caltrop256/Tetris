class SoundManager {
    constructor(arr) {
        this.AudioHolder = class extends Audio {
            constructor(name) {
                super();
                this.src = './assets/audio/' + name + '.ogg'//(name.startsWith('mus') ? '.wav' : '.ogg');
                this.name = name;
            }

            get playing() {
                return this.currentTime || !this.paused;
            }
        }
        this.audioHolders = arr.map(s => new this.AudioHolder(s));
        this.audio = {};
        for (let i = 0; i < this.audioHolders.length; ++i) {
            this.audio[this.audioHolders[i].name] = this.audioHolders[i];
        }
    }

    play = str => {
        let a = this.audio[str];
        if (a.playing) this.stop(str);
        a.play()
    };
    loop = str => {
        let a = this.audio[str];
        a.play();
        a.loop = true;
    }
    stop = str => {
        let a = this.audio[str];
        a.pause();
        a.loop = false;
        a.currentTime = 0;
    }

    stopAllMusic = () => {
        for (let i = 0; i < this.audioHolders.length; ++i) {
            if (this.audioHolders[i].name.startsWith('mus_')) {
                this.stop(this.audioHolders[i].name)
            }
        }
    }
    stopAllSound = () => {
        for (let i = 0; i < this.audioHolders.length; ++i) {
            if (this.audioHolders[i].name.startsWith('snd_')) {
                this.stop(this.audioHolders[i].name)
            }
        }
    }
    getCurrentBgMusic = () => {
        for (let i = 0; i < this.audioHolders.length; ++i) {
            if (this.audioHolders[i].name.startsWith('mus_') && this.audioHolders[i].playing) {
                return (this.audioHolders[i].name)
            }
        }
    }
}