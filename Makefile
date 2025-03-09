src := ${wildcard src/* src/*/*}
platform := ${wildcard platform/* platform/*/*}

firefox: dist/firefox/firefox.zip
	echo "Firefox build complete"

dist/firefox/firefox.zip: ${src} ${platform}
	tools/make-firefox.sh