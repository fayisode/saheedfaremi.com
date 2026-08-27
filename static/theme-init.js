(function () {
	try {
		var stored = localStorage.getItem('theme');
		// Default matches the prerendered HTML/CSS (dark) so first paint never flashes.
		var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
		document.documentElement.setAttribute('data-theme', theme);
	} catch {
		document.documentElement.setAttribute('data-theme', 'dark');
	}
})();
