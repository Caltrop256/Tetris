class MobileControls {
    constructor() {
        this.active = false;
        this.inMenu = true;
        this.inputs = {
            left: false,
            right: false,
            up: false,
            down: false,
            rotate: false
        };
        (this.loop = () => {
            window.setTimeout(this.loop, this.active ? 10 : 1000);
            if (!this.active) {
                this.active = this.checkMobile();
                if (this.active) {
                    this.addDomElements();
                }
            } else {
                this.injectInputData();
            }
        })();

        const touchActivate = () => {
            if (this.active) return;
            this.active = true;
            this.addDomElements();
        }

        window.addEventListener('touchstart', touchActivate);
        window.addEventListener('touchend', touchActivate);
        window.addEventListener('touchmove', touchActivate);
        window.addEventListener('touchcancel', touchActivate);
    }
    setMenu = b => {
        if (b == this.inMenu || !this.active) return;
        else if (!b) {
            this.wrapper.style.top = 'calc((100vh - min(35vh, 35vw)) + min(35vh, 35vw) * 0.33)';
            this.inMenu = b;
            this.rows[0].style.display = 'none';
            Array.from(this.rows[2].childNodes)[0].innerHTML = this.svgs[5];
            Array.from(this.rows[1].childNodes)[1].innerHTML = this.svgs[1];
        } else {
            this.inMenu = b;
            this.wrapper.style.top = 'calc(100vh - min(35vh, 35vw))';
            this.rows[0].style.display = 'flex';
            Array.from(this.rows[2].childNodes)[0].innerHTML = this.svgs[4];
            Array.from(this.rows[1].childNodes)[1].innerHTML = this.svgs[2];
        }
    }
    buttonPress = (y, x, pressed) => {
        switch (y) {
            case 2:
                this.inputs[this.inMenu ? 'up' : 'rotate'] = pressed;
                break;
            case 1:
                switch (x) {
                    case 0:
                        this.inputs.left = pressed;
                        break;
                    case 1:
                        this.inputs[this.inMenu ? 'rotate' : 'down'] = pressed;
                        break;
                    case 2:
                        this.inputs.right = pressed;
                        break;
                }
                break;
            case 0:
                this.inputs.down = pressed;
                break;
        }
        this.injectInputData();
    }
    addDomElements = () => {
        this.wrapper = window.document.createElement('div');
        this.wrapper.classList.add('mobilectrl-wrapper');
        this.rows = new Array(3);
        let i = this.rows.length;
        while (i-- > 0) {
            this.rows[i] = window.document.createElement('div')
            this.wrapper.appendChild(this.rows[i]);
        }
        this.rows[0].innerHTML = '<div></div>';
        this.rows[1].innerHTML = '<div></div><div></div><div></div>';
        this.rows[2].innerHTML = '<div></div>';
        window.document.body.appendChild(this.wrapper);

        for (let i = 0; i < this.rows.length; ++i) {
            const els = Array.from(this.rows[i].childNodes);
            for (let j = 0; j < els.length; ++j) {
                els[j].addEventListener('touchstart', e => this.buttonPress(i, j, true));
                els[j].addEventListener('touchend', e => this.buttonPress(i, j, false));
                els[j].addEventListener('touchcancel', e => this.buttonPress(i, j, false));

                switch (i) {
                    case 2:
                        els[j].innerHTML = this.svgs[4];
                        break;
                    case 1:
                        switch (j) {
                            case 0:
                                els[j].innerHTML = this.svgs[0];
                                break;
                            case 1:
                                els[j].innerHTML = this.svgs[2];
                                break;
                            case 2:
                                els[j].innerHTML = this.svgs[3];
                                break;
                        }
                        break;
                    case 0:
                        els[j].innerHTML = this.svgs[1];
                }
            }
        }
    }
    injectInputData = () => {
        if (typeof game != "undefined") {
            game.pInputs = {
                up: this.inputs.up,
                down: this.inputs.down,
                rot: +this.inputs.rotate,
                horizontal: this.inputs.left ? -1 : (this.inputs.right ? 1 : 0),
            }
        }
    }
    checkMobile = () => ((a) => (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))))(navigator.userAgent || navigator.vendor || window.opera);
    svgs = [
        `<svg style="z-index: 200;" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve"><g><g> <path style="fill:#FCFCFC;" d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12 C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084 c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864 l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z" /></g></g></svg>`,
        `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;" xml:space="preserve"><g><path style="fill:#FCFCFC;" d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"/></g></svg>`,
        `<svg id="Capa_1" enable-background="new 0 0 374.706 374.706" height="512" viewBox="0 0 374.706 374.706" width="512" xmlns="http://www.w3.org/2000/svg"><path style="fill:#FCFCFC;" d="m321.176 53.529h-107.058v53.529h107.059v80.294l-214.111-.007 40.141-40.141-40.147-40.147-107.06 107.061 107.059 107.059 40.147-40.147-40.153-40.153 214.124-.02c29.522 0 53.529-24.007 53.529-53.529v-80.268c0-29.523-24.007-53.53-53.53-53.531z"/></svg>`,
        `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve"><g><g><path style="fill:#FCFCFC;" d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12 c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028 c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265 c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/></g></g></svg>`,
        `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="284.929px" height="284.929px" viewBox="0 0 284.929 284.929" style="enable-background:new 0 0 284.929 284.929;" xml:space="preserve"><g><path style="fill:#FCFCFC;" d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,195.285 C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,4.093,2.854,6.567,2.854 c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,4.093,2.848,6.563,2.848 c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.566 C284.929,199.378,283.984,197.188,282.082,195.285z"/></g></svg>`,
        `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.264 55.264" style="enable-background:new 0 0 55.264 55.264;" xml:space="preserve"><g><path style="fill:#FCFCFC;" d="M30.264,2.632c-1.657,0-3,1.343-3,3s1.343,3,3,3c10.477,0,19,8.523,19,19s-8.523,19-19,19 c-8.317,0-15.469-5.463-18.009-12.985c0.035,0.038,0.079,0.071,0.113,0.109c2.047,2.349,3.934,1.574,4.087-1.735 c0.031-0.672,0.06-1.37,0.083-2.078c0.107-3.312-0.145-8.659-0.723-11.888c-0.579-3.228-3.373-4.094-5.802-1.841 c-1.624,1.506-3.387,3.246-4.745,4.855c-1.401,1.66-2.959,3.778-4.303,5.688c-1.907,2.71-0.887,4.472,2.167,3.857 c0.72-0.144,1.502-0.169,2.3-0.103c1.444,12.403,12.107,22.121,24.832,22.121c13.785,0,25-11.215,25-25S44.05,2.632,30.264,2.632z"/></g></svg>`
    ]
}