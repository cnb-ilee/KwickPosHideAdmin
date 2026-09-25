// ==UserScript==
// @name         Resize & Toggle KwickPoS Admin Frameset
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Script to hide the admin side of the KwickPoS agent which takes too much space.
// @match        *://kwickpos.com/*
// @match        *://*.kwickpos.com/*
// @run-at       document-start
// @license      MIT 
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    let isCollapsed = true;
    let observedWinFrame = null;
    let observedWinDocument = null;
    let winDocumentObserver = null;
    const collapsedCols = '1%, 99%';
    const expandedCols = '20%, 80%';

    function getTopDocument() {
        try {
            return window.top.document;
        } catch (e) {
            return null;
        }
    }

    function hasMyLogFrame() {
        const topDocument = getTopDocument();
        return !!topDocument?.querySelector(
            'frame[name="mylog"], frame[id="mylog"], frame[src*="mylog"]'
        );
    }

    function getMyWinFrame() {
        const topDocument = getTopDocument();
        return topDocument?.querySelector('frame[name="mywin"], frame[id="mywin"]') || null;
    }

    function getMyWinDocument() {
        try {
            return getMyWinFrame()?.contentDocument || null;
        } catch (e) {
            return null;
        }
    }

    function setFramesetCols(collapsed) {
        if (!hasMyLogFrame()) return;

        isCollapsed = collapsed;
        const targetCols = isCollapsed ? collapsedCols : expandedCols;
        const topDocument = getTopDocument();

        topDocument?.querySelectorAll('frameset').forEach((frameset) => {
            if (frameset.getAttribute('cols') !== targetCols) {
                frameset.setAttribute('cols', targetCols);
            }
        });

        const button = getMyWinDocument()?.getElementById('kwick-compact-toggle');
        const buttonLabel = isCollapsed ? '▶' : '◀';
        if (button && button.innerText !== buttonLabel) {
            button.innerText = buttonLabel;
        }
    }

    function injectCompactButton() {
        if (!hasMyLogFrame()) return false;

        const winDocument = getMyWinDocument();
        if (!winDocument?.body) return false;

        if (winDocument.getElementById('kwick-compact-toggle')) return true;

        const button = winDocument.createElement('button');
        button.id = 'kwick-compact-toggle';
        button.type = 'button';
        button.innerText = isCollapsed ? '▶' : '◀';
        button.style.cssText = [
            'position: fixed !important',
            'top: 36px !important',
            'left: 6px !important',
            'z-index: 2147483647 !important',
            'width: 26px !important',
            'height: 26px !important',
            'line-height: 24px !important',
            'padding: 0 !important',
            'background: #28a745 !important',
            'color: #ffffff !important',
            'border: 1px solid #ffffff !important',
            'border-radius: 4px !important',
            'cursor: pointer !important',
            'font-size: 12px !important',
            'font-weight: bold !important',
            'text-align: center !important',
            'box-shadow: 0 2px 4px rgba(0,0,0,0.4) !important',
            'opacity: 0.35 !important'
        ].join(';');

        button.onmouseover = () => { button.style.opacity = '1.0'; };
        button.onmouseout = () => { button.style.opacity = '0.35'; };
        button.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setFramesetCols(!isCollapsed);
        };

        winDocument.body.appendChild(button);
        return true;
    }

    function observeWinDocument() {
        const winFrame = getMyWinFrame();
        const winDocument = getMyWinDocument();
        if (!winFrame || !winDocument) return;

        if (winFrame !== observedWinFrame) {
            observedWinFrame?.removeEventListener('load', handleWinFrameLoad);
            winFrame.addEventListener('load', handleWinFrameLoad);
            observedWinFrame = winFrame;
        }

        if (winDocument !== observedWinDocument) {
            winDocumentObserver?.disconnect();
            winDocumentObserver = new MutationObserver(() => {
                injectCompactButton();
            });
            winDocumentObserver.observe(winDocument, { childList: true, subtree: true });
            observedWinDocument = winDocument;
        }
    }

    function handleWinFrameLoad() {
        observeWinDocument();
        injectCompactButton();
    }

    function initialize() {
        if (!hasMyLogFrame() || !getMyWinFrame()) return false;

        setFramesetCols(isCollapsed);
        observeWinDocument();
        injectCompactButton();
        return true;
    }

    const topDocument = getTopDocument();
    if (!initialize() && topDocument) {
        const frameObserver = new MutationObserver(() => {
            if (initialize()) frameObserver.disconnect();
        });
        frameObserver.observe(topDocument, { childList: true, subtree: true });
    }
})();

