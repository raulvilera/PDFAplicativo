async function renderTextLayer(page, viewport) {
    textLayer.innerHTML = '';
    
    const textContent = await page.getTextContent();
    
    // Usar a API oficial do PDF.js para renderizar a text-layer
    if (typeof pdfjsLib.renderTextLayer !== 'undefined') {
        pdfjsLib.renderTextLayer({
            textContentSource: textContent,
            container: textLayer,
            viewport: viewport,
            textDivs: []
        });
    } else {
        // Fallback manual
        textContent.items.forEach(item => {
            if (!item.str) return;
            const textDiv = document.createElement('span');
            textDiv.className = 'text-item';
            textDiv.textContent = item.str;
            
            const tx = pdfjsLib.Util.transform(
                viewport.transform,
                item.transform
            );
            
            const angle = Math.atan2(tx[1], tx[0]);
            const style = window.getComputedStyle(textLayer);
            const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
            
            textDiv.style.left = `${tx[4]}px`;
            textDiv.style.top = `${tx[5] - fontSize}px`;
            textDiv.style.fontSize = `${fontSize}px`;
            textDiv.style.fontFamily = item.fontName || 'sans-serif';
            
            if (angle !== 0) {
                textDiv.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
            }
            
            textLayer.appendChild(textDiv);
        });
    }
}
