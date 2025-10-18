// 1. 基础工具函数
const util = {
    getCurrentTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
    },
    // 格式化会员到期时间（精准到秒）
    formatVipTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
    },
    getRandomEmoji() {
        const bqt = ["🎵", "🎶", "🎼", "🎤", "🎧", "📻", "🎸", "🎹", "🎷", "🎺", "🥁", "🎻"];
        return bqt[Math.floor(Math.random() * bqt.length)];
    },
    toast(msg, duration = 3000) {
        const toastEl = document.getElementById('toast');
        toastEl.textContent = msg;
        toastEl.style.display = 'block';
        setTimeout(() => toastEl.style.display = 'none', duration);
    },
    copyToClipboard: function(text, successMsg = '复制成功', failMsg = '复制失败') {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textarea);
            result ? this.toast(successMsg) : this.toast(failMsg);
        } catch (err) {
            this.toast(failMsg);
            console.error('复制异常：', err);
        }
    },
    showLoading() { document.getElementById('loadingBox').style.display = 'block'; },
    hideLoading() { document.getElementById('loadingBox').style.display = 'none'; },
    showChoiceWithControl(title, list, callback) {
        const choiceTitle = document.getElementById('choiceTitle');
        const choiceList = document.getElementById('choiceList');
        const choiceOverlay = document.getElementById('choiceOverlay');
        const choiceBox = document.getElementById('choiceBox');
        
        choiceList.innerHTML = '';
        choiceOverlay.onclick = null;
        choiceTitle.textContent = title;
        
        list.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn secondary menu-item';
            btn.style.animationDelay = `${index * 0.05}s`;
            btn.textContent = item;
            btn.onclick = () => {
                callback(index + 1);
                if (index === 0) {
                    choiceOverlay.style.display = 'none';
                    choiceBox.style.display = 'none';
                }
            };
            choiceList.appendChild(btn);
        });
        
        choiceOverlay.onclick = () => {
            choiceOverlay.style.display = 'none';
            choiceBox.style.display = 'none';
        };
        choiceOverlay.style.display = 'block';
        choiceBox.style.display = 'block';
    },
    showChoice(title, list) {
        return new Promise((resolve) => {
            const choiceTitle = document.getElementById('choiceTitle');
            const choiceList = document.getElementById('choiceList');
            const choiceOverlay = document.getElementById('choiceOverlay');
            const choiceBox = document.getElementById('choiceBox');
            
            choiceTitle.textContent = title;
            choiceList.innerHTML = '';
            list.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.className = 'btn secondary menu-item';
                btn.style.animationDelay = `${index * 0.05}s`;
                btn.textContent = item;
                btn.onclick = () => {
                    choiceOverlay.style.display = 'none';
                    choiceBox.style.display = 'none';
                    resolve(index + 1);
                };
                choiceList.appendChild(btn);
            });
            
            choiceOverlay.style.display = 'block';
            choiceOverlay.onclick = () => {
                choiceOverlay.style.display = 'none';
                choiceBox.style.display = 'none';
                resolve(null);
            };
            choiceBox.style.display = 'block';
        });
    },
    showPrompt(title, defaultVal = ['', '10']) {
        return new Promise((resolve) => {
            const promptTitle = document.getElementById('promptTitle');
            const songNameInput = document.getElementById('songName');
            const showCountInput = document.getElementById('showCount');
            const promptOverlay = document.getElementById('promptOverlay');
            const promptBox = document.getElementById('promptBox');
            const confirmBtn = document.getElementById('promptConfirm');
            const cancelBtn = document.getElementById('promptCancel');
            
            confirmBtn.removeEventListener('click', () => {});
            cancelBtn.removeEventListener('click', () => {});
            
            promptTitle.textContent = title;
            songNameInput.value = defaultVal[0] || '';
            showCountInput.value = defaultVal[1] || '10';
            
            const confirmHandler = () => {
                const songName = songNameInput.value.trim();
                const showCount = showCountInput.value.trim();
                if (!songName) { this.toast('请输入歌曲名'); return; }
                if (isNaN(showCount) || showCount < 1 || showCount > 100) { this.toast('显示数量需为1-100的整数'); return; }
                promptOverlay.style.display = 'none';
                promptBox.style.display = 'none';
                resolve([songName, showCount]);
            };
            const cancelHandler = () => {
                promptOverlay.style.display = 'none';
                promptBox.style.display = 'none';
                resolve(null);
            };
            
            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
            promptOverlay.style.display = 'block';
            promptOverlay.onclick = cancelHandler;
            promptBox.style.display = 'block';
        });
    },
    showLinkPrompt() {
        return new Promise((resolve) => {
            const linkOverlay = document.getElementById('linkOverlay');
            const linkPromptBox = document.getElementById('linkPromptBox');
            const linkConfirm = document.getElementById('linkConfirm');
            const linkCancel = document.getElementById('linkCancel');
            const musicLinkInput = document.getElementById('musicLink');
            
            linkConfirm.removeEventListener('click', () => {});
            linkCancel.removeEventListener('click', () => {});
            
            const confirmHandler = () => {
                const link = musicLinkInput.value.trim();
                if (!link) { this.toast('请输入直链'); return; }
                linkOverlay.style.display = 'none';
                linkPromptBox.style.display = 'none';
                resolve(link);
            };
            const cancelHandler = () => {
                linkOverlay.style.display = 'none';
                linkPromptBox.style.display = 'none';
                resolve(null);
            };
            
            musicLinkInput.value = '';
            linkConfirm.addEventListener('click', confirmHandler);
            linkCancel.addEventListener('click', cancelHandler);
            linkOverlay.style.display = 'block';
            linkOverlay.onclick = cancelHandler;
            linkPromptBox.style.display = 'block';
        });
    },
    showFilePathPrompt() {
        return new Promise((resolve) => {
            const filePathOverlay = document.getElementById('filePathOverlay');
            const filePathPromptBox = document.getElementById('filePathPromptBox');
            const filePathConfirm = document.getElementById('filePathConfirm');
            const filePathCancel = document.getElementById('filePathCancel');
            const selectFileBtn = document.getElementById('selectFileBtn');
            const fileInput = document.getElementById('fileInput');
            const filePathInput = document.getElementById('filePath');
            
            filePathConfirm.removeEventListener('click', () => {});
            filePathCancel.removeEventListener('click', () => {});
            selectFileBtn.onclick = null;
            fileInput.onchange = null;
            
            selectFileBtn.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file); 
                    filePathOverlay.style.display = 'none';
                    filePathPromptBox.style.display = 'none';
                    fileInput.value = '';
                }
            };
            
            const confirmHandler = () => {
                const path = filePathInput.value.trim();
                if (!path) { this.toast('请输入文件路径'); return; }
                filePathOverlay.style.display = 'none';
                filePathPromptBox.style.display = 'none';
                resolve({ type: 'path', value: path });
            };
            const cancelHandler = () => {
                filePathOverlay.style.display = 'none';
                filePathPromptBox.style.display = 'none';
                resolve(null);
                fileInput.value = '';
            };
            
            filePathInput.value = '';
            filePathConfirm.addEventListener('click', confirmHandler);
            filePathCancel.addEventListener('click', cancelHandler);
            filePathOverlay.style.display = 'block';
            filePathOverlay.onclick = cancelHandler;
            filePathPromptBox.style.display = 'block';
        });
    },
    storage: {
        get(key) {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : null;
        },
        set(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        }
    }
};

// 2. 会员核心逻辑（新增）
const vip = {
    state: {
        vipKey: "musicVipInfo", // 本地存储键名
        expireTime: 0, // 会员到期时间戳（毫秒）
        todayGetKey: "musicVipTodayGet", // 今日领取记录键名
        vipDuration: 12 * 60 * 60 * 1000 // 单次领取时长：12小时（毫秒）
    },
    // 初始化会员状态
    init() {
        const vipInfo = util.storage.get(this.state.vipKey) || {};
        this.state.expireTime = vipInfo.expireTime || 0;
        this.updateVipBtnStatus();
        this.updateVipExpireText();
        // 每秒刷新一次到期时间显示
        setInterval(() => this.updateVipExpireText(), 1000);
    },
    // 检查是否可领取今日会员
    canGetTodayVip() {
        const today = new Date().toLocaleDateString(); // 格式：年/月/日（区分每日）
        const lastGetDay = util.storage.get(this.state.todayGetKey);
        return lastGetDay !== today;
    },
    // 领取今日会员（12小时）
    getTodayVip() {
        if (!this.canGetTodayVip()) {
            util.toast('今日已领取过会员，明天再来吧～');
            return false;
        }
        
        const now = Date.now();
        // 若当前有未过期会员，在原有基础上叠加12小时；否则从现在开始算
        this.state.expireTime = Math.max(now, this.state.expireTime) + this.state.vipDuration;
        
        // 保存状态到本地存储
        util.storage.set(this.state.vipKey, { expireTime: this.state.expireTime });
        util.storage.set(this.state.todayGetKey, new Date().toLocaleDateString());
        
        // 更新UI和按钮状态
        this.updateVipExpireText();
        this.updateVipBtnStatus();
        util.toast('领取成功！获得12小时会员时长～');
        return true;
    },
    // 检查会员是否有效
    isVipValid() {
        return Date.now() < this.state.expireTime;
    },
    // 更新会员到期时间显示文本
    updateVipExpireText() {
        const expireEl = document.getElementById('vipExpireTime');
        if (!this.isVipValid()) {
            expireEl.textContent = '会员到期时间：已过期';
            return;
        }
        const formatTime = util.formatVipTime(this.state.expireTime);
        expireEl.textContent = `会员到期时间：${formatTime}`;
    },
    // 更新领取按钮状态（是否可点击）
    updateVipBtnStatus() {
        const btn = document.getElementById('getVipBtn');
        if (!this.canGetTodayVip()) {
            btn.disabled = true;
            btn.textContent = '今日已领取';
        } else {
            btn.disabled = false;
            btn.textContent = '领取今日会员';
        }
    }
};

// 3. 音乐核心功能（新增会员校验逻辑）
const music = {
    state: {
        sel: null,
        gqlb: ["请先搜索歌曲"],
        idb: ["1010"],
        configKey: "musicToolConfig",
        currentAudioUrl: "",
        downloadPath: "/storage/emulated/0/AndroLua/Download/obj/wo3DlMOGwrbDjj7DisKw/",
        tempFileUrl: "",
        proxyUrl: "https://api.codetabs.com/v1/proxy/?quest="
    },
    init() {
        this.state.sel = util.storage.get(this.state.configKey) || ["", "10"];
        window.onbeforeunload = () => {
            if (this.state.tempFileUrl) URL.revokeObjectURL(this.state.tempFileUrl);
        };
    },
    // 检查会员权限（新增）
    checkVipPermission() {
        if (!vip.isVipValid()) {
            util.toast('会员已过期，请领取今日会员后再使用～');
            return false;
        }
        return true;
    },
    async searchSong(name, limit) {
        if (!this.checkVipPermission()) return null; // 校验会员
        
        try {
            const originUrl = `http://music.163.com/api/search/get?s=${encodeURIComponent(name)}&type=1&offset=0&total=true&limit=${limit}`;
            const proxyRequestUrl = this.state.proxyUrl + encodeURIComponent(originUrl);
            
            const res = await fetch(proxyRequestUrl);
            if (!res.ok) throw new Error(`状态码：${res.status}`);
            return await res.json();
        } catch (err) {
            util.toast(`搜索失败：${err.message}`);
            return null;
        }
    },
    parseSongData(jsonData, searchName, limit) {
        if (!jsonData || !jsonData.result) return false;
        const songCount = jsonData.result.songCount || 0;
        const showCount = songCount < limit ? songCount : limit;
        this.state.gqlb = [];
        this.state.idb = [];
        
        for (let i = 0; i < showCount; i++) {
            const song = jsonData.result.songs[i];
            const singer = song.artists[0].name;
            const duration = Math.floor(song.duration / 1000);
            const timeStr = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
            this.state.gqlb.push(`${song.name} - ${singer}（${timeStr}）`);
            this.state.idb.push(song.id);
        }
        return `找到《${searchName}》相关歌曲${songCount}首（显示前${showCount}首）`;
    },
    playSong(id, name) {
        if (!this.checkVipPermission()) return; // 校验会员
        
        this.stopSong();
        this.state.currentAudioUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        const audio = document.getElementById('audioPlayer');
        audio.src = this.state.currentAudioUrl;
        audio.style.display = 'block';
        audio.play().then(() => util.toast(`正在播放：${name}`))
            .catch(err => util.toast(`播放失败：${err.message}`));
    },
    async playByLink(link) {
        if (!this.checkVipPermission()) return; // 校验会员
        
        this.stopSong();
        util.showLoading();
        const audio = document.getElementById('audioPlayer');
        try {
            this.state.currentAudioUrl = link;
            audio.src = link;
            audio.style.display = 'block';
            await audio.play();
            util.toast('直链播放中');
        } catch (err) {
            util.toast(`播放失败：${err.message}`);
        } finally {
            util.hideLoading();
        }
    },
    playByFile(fileInfo) {
        if (!this.checkVipPermission()) return; // 校验会员
        
        this.stopSong();
        const audio = document.getElementById('audioPlayer');
        if (this.state.tempFileUrl) {
            URL.revokeObjectURL(this.state.tempFileUrl);
            this.state.tempFileUrl = "";
        }
        
        if (fileInfo instanceof File) {
            this.state.tempFileUrl = URL.createObjectURL(fileInfo);
            audio.src = this.state.tempFileUrl;
            audio.style.display = 'block';
            audio.play().then(() => util.toast(`正在播放文件：${fileInfo.name}`))
                .catch(err => util.toast(`文件播放失败：${err.message}`));
        } else if (fileInfo?.type === 'path') {
            audio.src = fileInfo.value;
            audio.style.display = 'block';
            audio.play().then(() => util.toast(`按路径播放中`))
                .catch(err => util.toast(`路径播放失败：${err.message}`));
        }
    },
    stopSong() {
        const audio = document.getElementById('audioPlayer');
        audio.pause();
        audio.src = '';
        this.state.currentAudioUrl = "";
        if (this.state.tempFileUrl) {
            URL.revokeObjectURL(this.state.tempFileUrl);
            this.state.tempFileUrl = "";
        }
        audio.style.display = 'none';
        util.toast('已停止播放');
    },
    async playHotSong() {
        if (!this.checkVipPermission()) return; // 校验会员
        
        util.showLoading();
        try {
            const res = await fetch('https://api.uomg.com/api/rand.music?sort=热歌榜&format=json');
            if (!res.ok) throw new Error('获取热歌失败');
            const data = await res.json();
            if (!data.data || !data.data.url) throw new Error('热歌链接无效');
            
            this.stopSong();
            this.state.currentAudioUrl = data.data.url;
            const audio = document.getElementById('audioPlayer');
            audio.src = data.data.url;
            audio.style.display = 'block';
            await audio.play();
            util.toast(`热歌推荐：${data.data.name} - ${data.data.singer}`);
        } catch (err) {
            util.toast(`热歌播放失败：${err.message}`);
        } finally {
            util.hideLoading();
        }
    },
    async selectAndPlay() {
        if (!this.checkVipPermission()) return; // 校验会员
        
        if (this.state.gqlb.length === 0 || this.state.gqlb[0] === "请先搜索歌曲") {
            util.toast('请先搜索歌曲');
            return;
        }
        
        const songIndex = await util.showChoice('选择歌曲', this.state.gqlb);
        if (!songIndex) return;
        
        const selectedSong = this.state.gqlb[songIndex - 1];
        const selectedSongId = this.state.idb[songIndex - 1];
        const songUrl = `https://music.163.com/song/media/outer/url?id=${selectedSongId}.mp3`;
        const downloadPath = this.state.downloadPath;
        const _this = this;
        
        util.showChoiceWithControl(`操作：${selectedSong}`, [
            '🎵播放歌曲',
            '📝复制音乐直链',
            '📤复制下载保存路径'
        ], function(actionIndex) {
            switch (actionIndex) {
                case 1:
                    _this.playSong(selectedSongId, selectedSong);
                    break;
                case 2:
                    util.copyToClipboard(songUrl, '音乐直链复制成功', '音乐直链复制失败');
                    break;
                case 3:
                    util.copyToClipboard(downloadPath, '下载路径复制成功', '下载路径复制失败');
                    break;
            }
        });
    },
    async searchAndShow() {
        if (!this.checkVipPermission()) return; // 校验会员
        
        const input = await util.showPrompt('搜索歌曲', this.state.sel);
        if (!input) return;
        
        const [searchName, showCount] = input;
        util.storage.set(this.state.configKey, [searchName, showCount]);
        this.state.sel = [searchName, showCount];
        
        util.showLoading();
        const songData = await this.searchSong(searchName, showCount);
        util.hideLoading();
        
        if (!songData) return;
        const title = this.parseSongData(songData, searchName, showCount);
        if (title) await this.selectAndPlay();
    }
};

// 4. 主应用逻辑
const app = {
    async mainMenu() {
        const emoji = util.getRandomEmoji();
        const menuTitle = `${emoji} 音乐小助手 ${emoji}`;
        const choice = await util.showChoice(menuTitle, [
            "🔍搜索歌曲",
            "💠选择已搜歌曲",
            "♨️播放热歌",
            "⛔️停止播放",
            "🔗输入直链播放",
            "📁本地文件播放",
            "🔄刷新菜单"
        ]);
        
        switch (choice) {
            case 1:
                await music.searchAndShow();
                break;
            case 2:
                await music.selectAndPlay();
                break;
            case 3:
                await music.playHotSong();
                break;
            case 4:
                music.stopSong();
                break;
            case 5:
                const link = await util.showLinkPrompt();
                if (link) await music.playByLink(link);
                break;
            case 6:
                const fileInfo = await util.showFilePathPrompt();
                if (fileInfo) music.playByFile(fileInfo);
                break;
            case 7:
                await this.mainMenu();
                break;
        }
    },
    init() {
        // 初始化会员和音乐功能
        vip.init();
        music.init();
        
        // 时间显示更新
        const updateTime = () => {
            document.getElementById('currentTime').textContent = util.getCurrentTime();
        };
        updateTime();
        setInterval(updateTime, 1000);
        
        // 领取会员按钮点击事件
        document.getElementById('getVipBtn').addEventListener('click', () => {
            vip.getTodayVip();
        });
        
        // 主功能按钮点击事件
        document.getElementById('mainBtn').addEventListener('click', async () => {
            await this.mainMenu();
        });
    }
};

// 页面加载完成后初始化
window.onload = () => {
    app.init();
};