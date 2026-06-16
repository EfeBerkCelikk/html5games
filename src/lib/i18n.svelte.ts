const dict: Record<string, Record<string, string>> = {
	en: {
		'nav.games': 'Games',
		'nav.settings': 'Settings',
		'hero.subtitle': 'A curated collection of high-quality HTML5 games, ready to play in your browser.',
		'hero.explore': 'Explore Games',
		'featured.title': 'Featured Games',
		'featured.subtitle': 'Newly added titles',
		'games.search': 'Search games...',
		'games.recently': 'Recently Added Games',
		'games.no_results': 'No games found for',
		'games.play': 'Play',
		'search.clear': 'Clear',
		'settings.title': 'Settings',
		'settings.language': 'Language',
		'settings.english': 'English',
		'settings.turkish': 'Turkish',
		'settings.showbar': 'Show-Bar Button Position',
		'settings.bottom_left': 'Bottom Left',
		'settings.bottom_center': 'Bottom Center',
		'settings.bottom_right': 'Bottom Right',
		'play.no_game': 'No Game Selected',
		'play.use_id': 'Use ?id= to load a game',
		'play.not_found': 'Game Not Found',
		'play.not_available': 'is not available',
		'play.back_home': 'Back to Home',
		'play.start': 'Start Game',
		'play.hide_bar': 'Hide Bar',
		'play.show_bar': 'Show Bar',
		'play.exit_fs': 'Exit Fullscreen',
		'play.fullscreen': 'Fullscreen',
		'play.home': 'Home',
		'footer.repo': 'GitHub Repo',
	},
	tr: {
		'nav.games': 'Oyunlar',
		'nav.settings': 'Ayarlar',
		'hero.subtitle': 'Bir dizi elle seçilmiş yüksek kaliteli HTML5 oyun portu.',
		'hero.explore': 'Oyunları Keşfet',
		'featured.title': 'Öne Çıkan Oyunlar',
		'featured.subtitle': 'Yeni eklenen oyunlar',
		'games.search': 'Oyun Ara...',
		'games.recently': 'Son Eklenen Oyunlar',
		'games.no_results': 'ile eşleşen oyun bulunamadı',
		'games.play': 'Oyna',
		'search.clear': 'Temizle',
		'settings.title': 'Ayarlar',
		'settings.language': 'Dil',
		'settings.english': 'İngilizce',
		'settings.turkish': 'Türkçe',
		'settings.showbar': 'Bar Göster Butonu Konumu',
		'settings.bottom_left': 'Sol Alt',
		'settings.bottom_center': 'Orta Alt',
		'settings.bottom_right': 'Sağ Alt',
		'play.no_game': 'Oyun Seçilmedi',
		'play.use_id': 'Bir oyun yüklemek için ?id= kullan',
		'play.not_found': 'Oyun Bulunamadı',
		'play.not_available': 'mevcut değil',
		'play.back_home': 'Anasayfaya Dön',
		'play.start': 'Oyunu Başlat',
		'play.hide_bar': 'Barı Gizle',
		'play.show_bar': 'Barı Göster',
		'play.exit_fs': 'Tam Ekrandan Çık',
		'play.fullscreen': 'Tam Ekran',
		'play.home': 'Ana Sayfa',
		'footer.repo': 'GitHub Repo',
	},
};

class I18n {
	locale = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en'
	);

	t = $derived.by(() => dict[this.locale] ?? dict['en']);

	setLocale(l: string) {
		this.locale = l;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('locale', l);
		}
	}
}

export const i18n = new I18n();
