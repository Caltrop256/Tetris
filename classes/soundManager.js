class SoundManager {
    constructor(arr) {
        this.AudioHolder = class extends Audio {
            constructor(name) {
                super();
                this.src = './assets/audio/' + name + '.ogg';
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
        this.muted = true;
        this.toggleMute();
    }

    toggleMute = () => {
        for (let i = 0; i < this.audioHolders.length; ++i) {
            this.audioHolders[i].volume = +this.muted;
        }
        document.getElementById('muteButton').innerHTML = this.muted
            ? `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 469.333 469.333" style="enable-background:new 0 0 469.333 469.333;" xml:space="preserve"><g> <g><g><path style="fill: white" d="M206.885,43.544c-3.875-1.698-8.448-0.896-11.542,2.042L85.49,149.336H10.667C4.771,149.336,0,154.107,0,160.002v149.333 c0,5.896,4.771,10.667,10.667,10.667H85.49l109.854,103.75c2.021,1.917,4.656,2.917,7.323,2.917c1.427,0,2.865-0.281,4.219-0.875 c3.917-1.677,6.448-5.531,6.448-9.792V53.336C213.333,49.075,210.802,45.221,206.885,43.544z" /><path style="fill: white" d="M262.452,174.884l-15.199,15.199c-3.505,3.505-4.44,9.168-1.513,13.168c6.449,8.819,10.26,19.682,10.26,31.418 c0,11.736-3.811,22.599-10.26,31.417c-2.927,4-1.992,9.664,1.513,13.169l15.199,15.198c4.655,4.656,12.259,3.939,16.28-1.276 c12.495-16.208,19.935-36.505,19.935-58.508c0-22.004-7.44-42.301-19.935-58.509 C274.711,170.945,267.107,170.228,262.452,174.884z" /><path style="fill: white" d="M338.423,114.575c-4.01-4.53-11.151-4.512-15.428-0.234l-15.092,15.092c-4.043,4.042-4.005,10.395-0.27,14.721 c20.991,24.307,33.701,55.954,33.701,90.514c0,34.56-12.71,66.207-33.701,90.516c-3.736,4.326-3.772,10.677,0.27,14.719 l15.092,15.092c4.277,4.279,11.418,4.296,15.43-0.233C366.771,322.755,384,280.686,384,234.669 C384,188.651,366.771,146.582,338.423,114.575z" /><path style="fill: white" d="M398.764,54.138c-4.082-4.43-11.151-4.417-15.409-0.158l-15.112,15.112c-4.053,4.053-4.033,10.451-0.167,14.685 c36.376,39.84,58.59,92.822,58.59,150.892s-22.214,111.051-58.59,150.892c-3.865,4.234-3.887,10.632,0.167,14.685l15.112,15.111 c4.259,4.26,11.328,4.272,15.41-0.158c43.79-47.529,70.568-110.961,70.568-180.53 C469.333,165.099,442.555,101.666,398.764,54.138z" /></g></g></g></svg>`
            : `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384 384" style="enable-background:new 0 0 384 384;" xml:space="preserve"><g><g><g><path style="fill: white" d="M288,192c0-37.653-21.76-70.187-53.333-85.867v47.147l52.373,52.373C287.68,201.173,288,196.587,288,192z"/><path style="fill: white" d="M341.333,192c0,20.053-4.373,38.933-11.52,56.32l32.32,32.32C376,254.08,384,224,384,192 c0-91.307-63.893-167.68-149.333-187.093V48.96C296.32,67.307,341.333,124.373,341.333,192z"/><polygon style="fill: white" points="192,21.333 147.413,65.92 192,110.507 			"/><path style="fill: white" d="M27.2,0L0,27.2L100.8,128H0v128h85.333L192,362.667V219.2l90.773,90.773c-14.293,10.987-30.4,19.84-48.107,25.173V379.2 c29.333-6.72,56.107-20.16,78.613-38.613L356.8,384l27.2-27.2l-192-192L27.2,0z"/></g></g></g></svg>`;
        this.muted = !this.muted;
    }

    play = str => {
        if (str.includes('mus_main3')) return;
        let a = this.audio[str];
        if (a.playing) this.stop(str);
        let promise = a.play();
        if (typeof promise != 'undefined') {
            promise.catch(() => { });
        }
    };
    loop = str => {
        let a = this.audio[str];
        let promise = a.play();
        if (typeof promise != 'undefined') {
            promise.catch(() => { });
        }
        a.loop = true;
    }
    stop = str => {
        let a = this.audio[str];
        let promise = a.pause();
        if (typeof promise != 'undefined') {
            promise.catch(() => { });
        }
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