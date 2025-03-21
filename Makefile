src := ${wildcard src/* src/*/*}
platform := ${wildcard platform/* platform/*/*}

all: firefox chrome

firefox: dist/firefox/firefox.zip
	echo "Firefox build complete"

dist/firefox/firefox.zip: ${src} ${platform}
	tools/make-firefox.sh

chrome: dist/chrome/chrome.zip
	echo "Chrome build complete"

dist/chrome/chrome.zip: ${src} ${platform}
	tools/make-chrome.sh