class SiteFooter extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    
    connectedCallback() {
        // Listen for PJAX navigation events
        window.addEventListener('pjax:complete', () => {
            // The footer shouldn't need to change content, but we can ensure it's properly rendered
            this.render();
        });
        
        // Listen for language change events
        window.addEventListener('storage', (event) => {
            if (event.key === 'sitcon-lang') {
                this.render();
            }
        });
    }
    
    render() {
        // Check current language preference
        const currentLang = localStorage.getItem('sitcon-lang') || 'zh';
        const isEnglish = currentLang === 'en' || window.location.pathname.includes('_en');
        
        // Update localStorage if needed based on URL
        if (isEnglish && currentLang !== 'en') {
            localStorage.setItem('sitcon-lang', 'en');
        } else if (!isEnglish && window.location.pathname.includes('_en')) {
            localStorage.setItem('sitcon-lang', 'en');
        }
        
        this.innerHTML = isEnglish ? this.renderEnglish() : this.renderChinese();
    }
    
    renderChinese() {
        return `
            <footer>
                <div class="footer-container">
                    <div>
                        <h3>
                            學生計算機年會<br />
                            Students' Information Technology Conference
                        </h3>
                        <h3>聯繫我們</h3>
                        <p>
                            合作聯繫：<a href="mailto:contact@sitcon.org">contact@sitcon.org</a><br />
                            報名事宜：<a href="mailto:ask@sitcon.camp">ask@sitcon.camp</a>
                        </p>
                    </div>
                    <div>
                        <h3>社群媒體</h3>
                        <div class="social">
                            <a href="https://www.facebook.com/SITCONtw/" target="_blank" class="link">
                                <img src="img/icon/facebook.svg" alt="Facebook" />
                            </a>
                            <a href="https://www.flickr.com/photos/sitcon" target="_blank" class="link">
                                <img src="img/icon/flickr.svg" alt="Flickr" />
                            </a>
                            <a href="https://telegram.me/SITCONgeneral" target="_blank" class="link">
                                <img src="img/icon/telegram.svg" alt="Telegram" />
                            </a>
                            <a href="https://x.com/sitcontw" target="_blank" class="link">
                                <img src="img/icon/x.svg" alt="X" />
                            </a>
                            <a href="https://www.youtube.com/c/SITCONArchive" target="_blank" class="link">
                                <img src="img/icon/youtube.svg" alt="YouTube" />
                            </a>
                            <a href="https://www.plurk.com/SITCON" target="_blank" class="link">
                                <img src="img/icon/plurk.svg" alt="Plurk" />
                            </a>
                        </div>
                        <h3>歷年網站</h3>
                        <div class="history">
                            <a href="https://sitcon.camp/2024" target="_blank" class="link">2024</a>
                            <a href="https://sitcon.camp/2023" target="_blank" class="link">2023</a>
                            <a href="https://sitcon.camp/2021" target="_blank" class="link">2021</a>
                            <a href="https://sitcon.camp/2019" target="_blank" class="link">2019</a>
                            <a href="https://sitcon.camp/2017" target="_blank" class="link">2017</a>
                            <a href="https://sitcon.camp/2016" target="_blank" class="link">2016</a>
                            <a href="https://sitcon.camp/2015" target="_blank" class="link">2015</a>
                            <a href="https://sitcon.camp/2014" target="_blank" class="link">2014</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
    
    renderEnglish() {
        return `
            <footer>
                <div class="footer-container">
                    <div>
                        <h3>
                            Students' Information Technology Conference
                        </h3>
                        <h3>Contact Us</h3>
                        <p>
                            Collaboration: <a href="mailto:contact@sitcon.org">contact@sitcon.org</a><br />
                            Registration: <a href="mailto:ask@sitcon.camp">ask@sitcon.camp</a>
                        </p>
                    </div>
                    <div>
                        <h3>Social Media</h3>
                        <div class="social">
                            <a href="https://www.facebook.com/SITCONtw/" target="_blank" class="link">
                                <img src="img/icon/facebook.svg" alt="Facebook" />
                            </a>
                            <a href="https://www.flickr.com/photos/sitcon" target="_blank" class="link">
                                <img src="img/icon/flickr.svg" alt="Flickr" />
                            </a>
                            <a href="https://telegram.me/SITCONgeneral" target="_blank" class="link">
                                <img src="img/icon/telegram.svg" alt="Telegram" />
                            </a>
                            <a href="https://x.com/sitcontw" target="_blank" class="link">
                                <img src="img/icon/x.svg" alt="X" />
                            </a>
                            <a href="https://www.youtube.com/c/SITCONArchive" target="_blank" class="link">
                                <img src="img/icon/youtube.svg" alt="YouTube" />
                            </a>
                            <a href="https://www.plurk.com/SITCON" target="_blank" class="link">
                                <img src="img/icon/plurk.svg" alt="Plurk" />
                            </a>
                        </div>
                        <h3>Previous Websites</h3>
                        <div class="history">
                            <a href="https://sitcon.camp/2024" target="_blank" class="link">2024</a>
                            <a href="https://sitcon.camp/2023" target="_blank" class="link">2023</a>
                            <a href="https://sitcon.camp/2021" target="_blank" class="link">2021</a>
                            <a href="https://sitcon.camp/2019" target="_blank" class="link">2019</a>
                            <a href="https://sitcon.camp/2017" target="_blank" class="link">2017</a>
                            <a href="https://sitcon.camp/2016" target="_blank" class="link">2016</a>
                            <a href="https://sitcon.camp/2015" target="_blank" class="link">2015</a>
                            <a href="https://sitcon.camp/2014" target="_blank" class="link">2014</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter); 