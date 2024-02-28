const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOGARE_KEY = 'KHIEMAM';

const heading = $('header h2');
const cdThumb = $('.cd-thumb'); 
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Thiên Lý Ơi',
            singer: 'J97',
            path: './assets/music/thienlyoi.mp3',
            image: './assets/img/thienlyoi.png'
        },

        {
            name: 'Nguyện Làm Gió Theo Mây',
            singer: 'Thái Huệ Ft. Việt Quất',
            path: './assets/music/nguyenlamgiotheomay.mp3',
            image: './assets/img/nguyenlamgiotheomay.png'
        },

        {
            name: 'Kết Duyên',
            singer: 'YuniBoo x Goctoi Mixer',
            path: './assets/music/ketduyen.mp3',
            image: './assets/img/ketduyen.png'
        },

        {
            name: 'Vô Duyên',
            singer: 'NIT Ft TĂNG DUY TÂN',
            path: './assets/music/voduyen.mp3',
            image: './assets/img/voduyen.png'
        },
        
        {
            name: 'Hữu Duyên Thiên Lý Năng Tương Ngộ',
            singer: 'NIT FT. HƯNG CACAO',
            path: './assets/music/huuduyenthienlynangtuongngo.mp3',
            image: './assets/img/huuduyenthienlynangtuongngo.png'
        },

        {
            name: 'Kém Duyên',
            singer: 'RUM X NIT X MASEW',
            path: './assets/music/kemduyen.mp3',
            image: './assets/img/kemduyen.png'
        },

        {
            name: 'Kém Duyên',
            singer: 'RUM X NIT X MASEW',
            path: './assets/music/kemduyen.mp3',
            image: './assets/img/kemduyen.png'
        },

        {
            name: 'Kém Duyên',
            singer: 'RUM X NIT X MASEW',
            path: './assets/music/kemduyen.mp3',
            image: './assets/img/kemduyen.png'
        },

        {
            name: 'Kém Duyên',
            singer: 'RUM X NIT X MASEW',
            path: './assets/music/kemduyen.mp3',
            image: './assets/img/kemduyen.png'
        },

        {
            name: 'Kém Duyên',
            singer: 'RUM X NIT X MASEW',
            path: './assets/music/kemduyen.mp3',
            image: './assets/img/kemduyen.png'
        },

    ],

    rander: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //Xử lý CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý nút play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //when the song time changes
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lý khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //Khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.rander();
            _this.scrollToActiveSong();
        }

        //Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.rander();
            _this.scrollToActiveSong();
        }

        //Random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý khi song ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.rander();
                    audio.play();
                }

                if(e.target.closest('.option')) {

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 0);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        this.loadConfig();

        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();

        this.rander();
    }
}

app.start();