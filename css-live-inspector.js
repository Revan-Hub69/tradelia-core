// CSS LIVE INSPECTOR - Bookmarklet per analisi CSS in tempo reale
// Copia questo codice e crealo come bookmarklet nel browser

javascript:(function(){
    // Rimuovi inspector esistente se presente
    const existing = document.getElementById('css-live-inspector');
    if (existing) existing.remove();
    
    // Crea il pannello inspector
    const inspector = document.createElement('div');
    inspector.id = 'css-live-inspector';
    inspector.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            left: 10px;
            width: 400px;
            max-height: 80vh;
            background: rgba(0,0,0,0.95);
            color: #00ff00;
            font-family: monospace;
            font-size: 11px;
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 15px;
            z-index: 999999;
            overflow-y: auto;
        ">
            <div style="color: #00ffff; font-weight: bold; margin-bottom: 10px;">
                🔍 CSS LIVE INSPECTOR
            </div>
            <div style="margin-bottom: 10px;">
                <button onclick="inspectElement()" style="background: #333; color: #00ff00; border: 1px solid #555; padding: 5px 10px; margin: 2px; cursor: pointer;">
                    🎯 Inspect Mode
                </button>
                <button onclick="showZIndexMap()" style="background: #333; color: #00ff00; border: 1px solid #555; padding: 5px 10px; margin: 2px; cursor: pointer;">
                    📊 Z-Index Map
                </button>
                <button onclick="closeInspector()" style="background: #333; color: #ff6666; border: 1px solid #555; padding: 5px 10px; margin: 2px; cursor: pointer;">
                    ❌ Close
                </button>
            </div>
            <div id="inspector-content" style="border-top: 1px solid #333; padding-top: 10px;">
                Click "Inspect Mode" then click on any element to analyze its CSS
            </div>
        </div>
    `;
    
    document.body.appendChild(inspector);
    
    // Funzioni inspector
    window.inspectElement = function() {
        document.body.style.cursor = 'crosshair';
        const content = document.getElementById('inspector-content');
        content.innerHTML = '<div style="color: #ffff00;">🎯 INSPECT MODE ACTIVE - Click on any element</div>';
        
        document.addEventListener('click', function inspectClick(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const element = e.target;
            const computedStyle = getComputedStyle(element);
            
            // Analizza CSS applicato
            const cssAnalysis = {
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                zIndex: computedStyle.zIndex,
                position: computedStyle.position,
                display: computedStyle.display,
                transform: computedStyle.transform,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                backgroundColor: computedStyle.backgroundColor,
                backdropFilter: computedStyle.backdropFilter,
                boxShadow: computedStyle.boxShadow,
                border: computedStyle.border
            };
            
            // Trova regole CSS applicate
            const appliedRules = [];
            for (let sheet of document.styleSheets) {
                try {
                    for (let rule of sheet.cssRules || sheet.rules) {
                        if (rule.style && element.matches && element.matches(rule.selectorText)) {
                            appliedRules.push({
                                selector: rule.selectorText,
                                cssText: rule.style.cssText,
                                href: sheet.href
                            });
                        }
                    }
                } catch (e) {
                    // Cross-origin stylesheet
                }
            }
            
            // Mostra risultati
            let html = \`
                <div style="color: #ffff00; font-weight: bold;">
                    🎯 ELEMENT: &lt;\${cssAnalysis.tagName.toLowerCase()}&gt;
                </div>
                <div style="margin: 5px 0;">
                    <div style="color: #9999ff;">Classes: \${cssAnalysis.className}</div>
                    <div style="color: #9999ff;">ID: \${cssAnalysis.id}</div>
                </div>
                
                <div style="color: #ff9900; font-weight: bold; margin: 10px 0 5px 0;">
                    📊 COMPUTED STYLES:
                </div>
                <div style="padding-left: 10px;">
                    <div style="color: #ff6666;">z-index: \${cssAnalysis.zIndex}</div>
                    <div>position: \${cssAnalysis.position}</div>
                    <div>display: \${cssAnalysis.display}</div>
                    <div>opacity: \${cssAnalysis.opacity}</div>
                    <div>visibility: \${cssAnalysis.visibility}</div>
                    \${cssAnalysis.transform !== 'none' ? \`<div style="color: #ff99ff;">transform: \${cssAnalysis.transform}</div>\` : ''}
                    \${cssAnalysis.backdropFilter !== 'none' ? \`<div>backdrop-filter: \${cssAnalysis.backdropFilter}</div>\` : ''}
                </div>
                
                <div style="color: #ff9900; font-weight: bold; margin: 10px 0 5px 0;">
                    📋 APPLIED CSS RULES (\${appliedRules.length}):
                </div>
                <div style="max-height: 200px; overflow-y: auto; padding-left: 10px;">
            \`;
            
            appliedRules.forEach(rule => {
                html += \`
                    <div style="margin: 5px 0; border-left: 2px solid #333; padding-left: 8px;">
                        <div style="color: #00ffff; font-size: 10px;">\${rule.selector}</div>
                        <div style="color: #cccccc; font-size: 9px;">\${rule.cssText}</div>
                        \${rule.href ? \`<div style="color: #666; font-size: 8px;">from: \${rule.href.split('/').pop()}</div>\` : ''}
                    </div>
                \`;
            });
            
            html += '</div>';
            content.innerHTML = html;
            
            // Highlight element
            element.style.outline = '3px solid #ff0000';
            element.style.outlineOffset = '2px';
            setTimeout(() => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            }, 3000);
            
            document.body.style.cursor = 'default';
            document.removeEventListener('click', inspectClick);
        }, { once: true });
    };
    
    window.showZIndexMap = function() {
        const content = document.getElementById('inspector-content');
        const elements = Array.from(document.querySelectorAll('*'))
            .map(el => ({
                element: el,
                zIndex: getComputedStyle(el).zIndex,
                position: getComputedStyle(el).position,
                tagName: el.tagName,
                className: el.className
            }))
            .filter(item => item.zIndex !== 'auto' && item.position !== 'static')
            .sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
        
        let html = \`
            <div style="color: #ffff00; font-weight: bold;">
                📊 Z-INDEX MAP (\${elements.length} elements)
            </div>
        \`;
        
        elements.forEach((item, index) => {
            const zIndexColor = parseInt(item.zIndex) > 100 ? '#ff6666' : 
                               parseInt(item.zIndex) > 50 ? '#ff9900' : '#00ff00';
            
            html += \`
                <div style="margin: 3px 0; padding: 3px; border-left: 2px solid \${zIndexColor};">
                    <span style="color: \${zIndexColor}; font-weight: bold;">z-\${item.zIndex}</span>
                    <span style="color: #9999ff;"> \${item.position}</span>
                    <span style="color: #cccccc;"> &lt;\${item.tagName.toLowerCase()}&gt;</span>
                    <div style="color: #666; font-size: 9px; margin-left: 10px;">\${item.className.substring(0, 50)}</div>
                </div>
            \`;
        });
        
        content.innerHTML = html;
    };
    
    window.closeInspector = function() {
        document.getElementById('css-live-inspector').remove();
        document.body.style.cursor = 'default';
    };
})();