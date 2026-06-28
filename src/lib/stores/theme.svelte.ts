class ThemeStore {
	current = $state<'dark' | 'light'>('dark');

	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', this.current);
			if (this.current === 'light') {
				document.body.classList.add('light-theme');
			} else {
				document.body.classList.remove('light-theme');
			}
		}
	}

	init() {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('theme');
			if (stored === 'light') {
				this.current = 'light';
				document.body.classList.add('light-theme');
			} else {
				this.current = 'dark';
				document.body.classList.remove('light-theme');
			}
		}
	}
}

export const themeStore = new ThemeStore();
