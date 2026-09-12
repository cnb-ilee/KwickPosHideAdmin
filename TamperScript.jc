// ==UserScript==
// @name         Resize & Toggle KwickPOS Frameset (Conditional Collapse)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Starts collapsed only if mylog frame exists, uses compact arrow inside mywin
// @match        *://kwickpos.com/*
// @match        *://*.kwickpos.com/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let isCollapsed = true;
    const collapsedCols = "1%, 99%";
    const expandedCols = "20%, 80%";

    // Safely check if mylog frame exists in top document
    function hasMyLogFrame() {
        try {
            return !!window.top.document.querySelector('frame[name="mylog"], frame[id="mylog"], frame[src*="mylog"]');
        } catch (e) {
            return false;
        }
    }

    // Function to resize frames from top context
    function setFramesetCols(collapsed) {
        if (!hasMyLogFrame()) return; // Exit if mylog frame does not exist

        isCollapsed = collapsed;
        const targetCols = isCollapsed ? collapsedCols : expandedCols;

        const framesets = window.top.document.querySelectorAll('frameset');
        framesets.forEach(fs => {
            fs.cols = targetCols;
            fs.setAttribute('cols', targetCols);
        });

        // Update button arrow symbol
        const winDoc = getMyWinDocument();
        if (winDoc) {
            const btn = winDoc.getElementById('kwick-compact-toggle');
            if (btn) {
                btn.innerText = isCollapsed ? '▶' : '◀';
            }
        }
    }

    // Safely retrieve mywin frame document
    function getMyWinDocument() {
        try {
            const winFrame = window.top.document.querySelector('frame[name="mywin"], frame[id="mywin"]');
            if (winFrame && winFrame.contentDocument) {
                return winFrame.contentDocument;
            }
        } catch (e) {
            // Context/cross-origin safety guard
        }
        return null;
    }

    // Inject compact arrow button directly into mywin frame
    function injectCompactButton() {
        if (!hasMyLogFrame()) return;

        const winDoc = getMyWinDocument();
        if (!winDoc || !winDoc.body || winDoc.getElementById('kwick-compact-toggle')) return;

        const btn = winDoc.createElement('button');
        btn.id = 'kwick-compact-toggle';
        btn.innerText = isCollapsed ? '▶' : '◀';

        btn.style.cssText = `
            position: fixed !important;
            top: 36px !important;
            left: 6px !important;
            z-index: 2147483647 !important;
            width: 26px !important;
            height: 26px !important;
            line-height: 24px !important;
            padding: 0 !important;
            background: #28a745 !important;
            color: #ffffff !important;
            border: 1px solid #ffffff !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: bold !important;
            text-align: center !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4) !important;
            opacity: 0.85 !important;
        `;

        btn.onmouseover = () => { btn.style.opacity = '1.0'; };
        btn.onmouseout = () => { btn.style.opacity = '0.85'; };

        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            setFramesetCols(!isCollapsed);
        };

        winDoc.body.appendChild(btn);
    }

    // Polling setup to ensure initialization on frame load
    let attempts = 0;
    const initInterval = setInterval(() => {
        if (hasMyLogFrame()) {
            setFramesetCols(isCollapsed);
            injectCompactButton();
        }
        attempts++;
        if (attempts >= 5) {
            clearInterval(initInterval);
        }
    }, 50);

})();