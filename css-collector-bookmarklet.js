// CSS COLLECTOR BOOKMARKLET - Per analisi produzione
// Copia questo codice e crealo come bookmarklet nel browser

javascript:(function(){
    // Rimuovi collector esistente
    const existing = document.getElementById('css-collector');
    if (existing) existing.remove();
    
    // Crea il collector
    const collector = document.createElement('div');
    collector.id = 'css-collector';
    collector.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            right: 10px;
            width: 350px;
            max-height: 80vh;
            background: rgba(0,0,0,0.95);
            color: #00ff00;
            font-family: monospace;
            font-size: 10px;
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 10px;
            z-index: 999999;
            overflow-y: auto;
        ">
            <div style="color: #00ffff; font-weight: bold; margin-bottom: 10px;">
                🔍 PRODUCTION CSS COLLECTOR
            </div>
            <div style="margin-bottom: 10px;">
                <button onclick="collectProductionCSS()" style="background: #333; color: #00ff00; border: 1px solid #555; padding: 4px 8px; margin: 2px; cursor: pointer; font-size: 9px;">
                    🎯 Collect Header CSS
                </button>
                <button onclick="analyzeConflicts()" style="background: #333; color: #00ff00; border: 1px solid #555; padding: 4px 8px; margin: 2px; cursor: pointer; font-size: 9px;">
                    ⚡ Find Conflicts
                </button>
                <button onclick="exportResults()" style="background: #333; color: #00ff00; border: 1px solid #555; padding: 4px 8px; margin: 2px; cursor: pointer; font-size: 9px;">
                    📄 Export
                </button>
                <button onclick="closeCollector()" style="background: #333; color: #ff6666; border: 1px solid #555; padding: 4px 8px; margin: 2px; cursor: pointer; font-size: 9px;">
                    ❌ Close
                </button>
            </div>
            <div id="collector-content" style="border-top: 1px solid #333; padding-top: 10px; font-size: 9px;">
                Click "Collect Header CSS" to analyze production styles
            </div>
        </div>
    `;
    
    document.body.appendChild(collector);
    
    // Funzioni collector
    window.collectProductionCSS = function() {
        const content = document.getElementById('collector-content');
        
        // Trova elementi header
        const headerElements = [];
        const selectors = [
            'button[aria-label*="theme"]',
            'button[aria-label*="notification"]', 
            'button[aria-label*="user"]',
            '[class*="ThemeSwitcher"]',
            '[class*="NotificationsBell"]',
            '[class*="UserDropdown"]',
            'header button',
            '.dashboard-header button'
        ];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                        const computedStyle = getComputedStyle(el);
                        headerElements.push({
                            selector: selector,
                            element: el,
                            classes: Array.from(el.classList),
                            ariaLabel: el.getAttribute('aria-label'),
                            computedStyles: {
                                transition: computedStyle.transition,
                                transform: computedStyle.transform,
                                zIndex: computedStyle.zIndex,
                                position: computedStyle.position,
                                backgroundColor: computedStyle.backgroundColor,
                                backdropFilter: computedStyle.backdropFilter
                            }
                        });
                    }
                });
            } catch (e) {
                console.warn('Selector failed:', selector);
            }
        });
        
        // Mostra risultati
        let html = \`<div style="color: #ffff00; font-weight: bold;">🎯 HEADER ELEMENTS: \${headerElements.length}</div>\`;
        
        headerElements.forEach((item, index) => {
            // Evidenzia elemento
            item.element.style.outline = '2px solid #ff0000';
            item.element.style.outlineOffset = '2px';
            
            // Trova classi problematiche
            const animationClasses = item.classes.filter(cls => 
                cls.includes('transition') || cls.includes('hover') || 
                cls.includes('scale') || cls.includes('animate')
            );
            
            const glassClasses = item.classes.filter(cls => 
                cls.includes('glass') || cls.includes('header-icon')
            );
            
            html += \`
                <div style="margin: 8px 0; padding: 6px; border: 1px solid #333; border-radius: 3px;">
                    <div style="color: #ffff00; font-weight: bold;">ELEMENT \${index + 1}: \${item.ariaLabel || 'No label'}</div>
                    
                    <div style="margin: 3px 0;">
                        <div style="color: #9999ff;">Classes (\${item.classes.length}):</div>
                        <div style="color: #cccccc; font-size: 8px; margin-left: 10px;">
                            \${item.classes.join(', ')}
                        </div>
                    </div>
                    
                    \${animationClasses.length > 0 ? \`
                        <div style="margin: 3px 0;">
                            <div style="color: #ffa500;">🎬 Animation Classes:</div>
                            <div style="color: #ffa500; font-size: 8px; margin-left: 10px;">
                                \${animationClasses.join(', ')}
                            </div>
                        </div>
                    \` : ''}
                    
                    \${glassClasses.length > 0 ? \`
                        <div style="margin: 3px 0;">
                            <div style="color: #00ffff;">💎 Glass Classes:</div>
                            <div style="color: #00ffff; font-size: 8px; margin-left: 10px;">
                                \${glassClasses.join(', ')}
                            </div>
                        </div>
                    \` : ''}
                    
                    <div style="margin: 3px 0;">
                        <div style="color: #00ff00;">💻 Computed:</div>
                        <div style="font-size: 8px; margin-left: 10px;">
                            transition: \${item.computedStyles.transition}<br>
                            transform: \${item.computedStyles.transform}<br>
                            z-index: \${item.computedStyles.zIndex}
                        </div>
                    </div>
                </div>
            \`;
        });
        
        content.innerHTML = html;
        window.collectedData = headerElements;
    };
    
    window.analyzeConflicts = function() {
        if (!window.collectedData) {
            alert('Collect CSS first!');
            return;
        }
        
        const content = document.getElementById('collector-content');
        const conflicts = [];
        
        window.collectedData.forEach((item, index) => {
            // Cerca conflitti comuni
            const hasMultipleAnimations = item.classes.filter(cls => 
                cls.includes('transition') || cls.includes('hover') || cls.includes('glass')
            ).length > 1;
            
            const hasTransformConflict = item.computedStyles.transition.includes('all') && 
                                       item.classes.some(cls => cls.includes('header-icon'));
            
            if (hasMultipleAnimations || hasTransformConflict) {
                conflicts.push({
                    element: index + 1,
                    label: item.ariaLabel,
                    issues: [
                        hasMultipleAnimations ? 'Multiple animation classes' : null,
                        hasTransformConflict ? 'Transform conflict (transition: all + header-icon)' : null
                    ].filter(Boolean)
                });
            }
        });
        
        let html = \`<div style="color: #ff6666; font-weight: bold;">⚡ CONFLICTS FOUND: \${conflicts.length}</div>\`;
        
        conflicts.forEach(conflict => {
            html += \`
                <div style="margin: 5px 0; padding: 5px; border: 1px solid #ff6666; border-radius: 3px;">
                    <div style="color: #ff6666;">Element \${conflict.element}: \${conflict.label}</div>
                    \${conflict.issues.map(issue => \`
                        <div style="color: #ffa500; font-size: 8px; margin-left: 10px;">• \${issue}</div>
                    \`).join('')}
                </div>
            \`;
        });
        
        if (conflicts.length === 0) {
            html += '<div style="color: #00ff00;">✅ No obvious conflicts detected</div>';
        }
        
        content.innerHTML = html;
    };
    
    window.exportResults = function() {
        if (!window.collectedData) {
            alert('No data to export!');
            return;
        }
        
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            elements: window.collectedData
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`production-css-\${Date.now()}.json\`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    window.closeCollector = function() {
        // Rimuovi highlight
        document.querySelectorAll('*').forEach(el => {
            el.style.outline = '';
            el.style.outlineOffset = '';
        });
        
        document.getElementById('css-collector').remove();
    };
})();