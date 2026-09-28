// ==UserScript==
// @name         KwickPOS POS Access in New Tab
// @namespace    https://kwickpos.com/
// @version      1.1
// @description  Opens KwickPOS POS Access in a new tab named for the site
// @match        https://kwickpos.com/*
// @match        https://*.kwickpos.com/*
// @grant        GM_openInTab
// @run-at       document-start
// ==/UserScript==

document.addEventListener('click', (event) => {
  const button = event.target instanceof Element
    ? event.target.closest('#po.posaccess')
    : null;

  if (!button) return;

  const site = button.dataset.site;
  if (!site) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const url = `https://kwickpos.com/POS.php?site=${encodeURIComponent(site)}`;
  GM_openInTab(url, { active: true });
}, true);

// Name the POS tab using the site's data-site value.
function setPosTabTitle() {
  const pageUrl = new URL(window.location.href);
  if (pageUrl.pathname.toLowerCase() !== '/pos.php') return;

  const site = pageUrl.searchParams.get('site');
  if (!site) return;

  const titleElement = document.querySelector('title');

  if (titleElement) {
    const observer = new MutationObserver(() => {
      if (document.title !== site) document.title = site;
    });

    observer.observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  document.title = site;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setPosTabTitle, { once: true });
} else {
  setPosTabTitle();
}