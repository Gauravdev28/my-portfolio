/**
 * FlowCode - Advanced C to Flowchart Converter
 * 
 * Features:
 * - AI Syntax Analysis & Auto-Fix
 * - Recursive AST Parsing
 * - Grid-Based Layout Engine for Perfect Alignment
 * - Smart Orthogonal Arrow Routing
 */

// --- DOM ELEMENTS ---
const codeInput = document.getElementById('codeInput');
const generateBtn = document.getElementById('generateBtn');
const loadExampleBtn = document.getElementById('loadExample');
const flowchartCanvas = document.getElementById('flowchartCanvas');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const downloadBtn = document.getElementById('downloadBtn');

// AI Modal
const aiModal = document.getElementById('aiModal');
const aiMessage = document.getElementById('aiMessage');
const aiSuggestion = document.getElementById('aiSuggestion');
const btnFix = document.getElementById('btnFix');
const btnIgnore = document.getElementById('btnIgnore');
const closeModal = document.querySelector('.close');

// State
let zoomLevel = 1;
let proposedCode = '';

// --- EVENT LISTENERS ---

loadExampleBtn.addEventListener('click', () => {
    codeInput.value = `int main() {
    int i = 0;
    printf("Start System");
    
    while (i < 3) {
        if (i % 2 == 0) {
            printf("Even Status");
        } else {
            printf("Odd Status");
        }
        i++;
    }
    
    printf("System End");
    return 0;
}`;
});

generateBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) {
        alert('⚠️ Please enter some C code first!');
        return;
    }

    const analysis = analyzeCode(code);
    if (analysis.hasIssues) {
        showAIModal(analysis);
    } else {
        generateFlowchart(code);
    }
});

btnFix.addEventListener('click', () => {
    codeInput.value = proposedCode;
    hideAIModal();
    generateFlowchart(proposedCode);
});

btnIgnore.addEventListener('click', () => {
    hideAIModal();
    generateFlowchart(codeInput.value);
});

closeModal.addEventListener('click', hideAIModal);
window.onclick = (e) => { if (e.target == aiModal) hideAIModal(); };

zoomInBtn.addEventListener('click', () => { zoomLevel = Math.min(zoomLevel + 0.1, 2); updateZoom(); });
zoomOutBtn.addEventListener('click', () => { zoomLevel = Math.max(zoomLevel - 0.1, 0.5); updateZoom(); });

function updateZoom() {
    flowchartCanvas.style.transform = `scale(${zoomLevel})`;
    flowchartCanvas.style.transformOrigin = 'top left';
}

downloadBtn.addEventListener('click', () => {
    const flowchart = document.querySelector('.flowchart');
    if (!flowchart) {
        alert('⚠️ Please generate a flowchart first!');
        return;
    }

    // Show loading message
    downloadBtn.textContent = 'Generating...';
    downloadBtn.disabled = true;

    // Use html2canvas to capture the flowchart
    import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
        .then(module => {
            const html2canvas = module.default;
            return html2canvas(flowchart, {
                backgroundColor: '#fafafa',
                scale: 2, // Higher quality
                logging: false
            });
        })
        .then(canvas => {
            // Convert to blob and download
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'flowchart.png';
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);

                // Reset button
                downloadBtn.textContent = 'Download';
                downloadBtn.disabled = false;
            });
        })
        .catch(error => {
            console.error('Download failed:', error);
            alert('❌ Download failed. Please try using your browser\'s screenshot tool.');
            downloadBtn.textContent = 'Download';
            downloadBtn.disabled = false;
        });
});

codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const start = codeInput.selectionStart;
        const end = codeInput.selectionEnd;
        const value = codeInput.value;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const lastLine = before.split('\n').pop();
        const match = lastLine.match(/^\s*/);
        let indentation = match ? match[0] : '';
        if (lastLine.trim().endsWith('{')) indentation += '    ';
        codeInput.value = before + '\n' + indentation + after;
        codeInput.selectionStart = codeInput.selectionEnd = start + 1 + indentation.length;
    }
});

// --- AI ENGINE ---

function analyzeCode(code) {
    const lines = code.split('\n');
    let issues = [];
    let fixedLines = [...lines];
    let openBraces = 0;

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;

        // Check Semicolons
        const needsSemi = !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') &&
            !trimmed.startsWith('if') && !trimmed.startsWith('else') &&
            !trimmed.startsWith('while') && !trimmed.startsWith('for') &&
            !trimmed.includes('main');
        if (needsSemi) {
            issues.push(`Line ${index + 1}: Missing semicolon ';'`);
            fixedLines[index] = line + ';';
        }

        // Check Assignments in Conditions
        if ((trimmed.startsWith('if') || trimmed.startsWith('while')) &&
            trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('!=') &&
            !trimmed.includes('<=') && !trimmed.includes('>=') && !trimmed.includes('->')) {
            issues.push(`Line ${index + 1}: Assignment '=' in condition. Changed to '=='`);
            fixedLines[index] = line.replace('=', '==');
        }

        openBraces += (line.match(/{/g) || []).length;
        openBraces -= (line.match(/}/g) || []).length;
    });

    if (openBraces > 0) {
        issues.push(`Missing ${openBraces} closing brace(s) '}'`);
        for (let i = 0; i < openBraces; i++) fixedLines.push('}');
    }

    return { hasIssues: issues.length > 0, issues, fixedCode: fixedLines.join('\n') };
}

function showAIModal(analysis) {
    const list = analysis.issues.map(i => `<li>${i}</li>`).join('');
    aiMessage.innerHTML = `<strong>Found ${analysis.issues.length} issue(s):</strong><br><ul>${list}</ul>`;
    aiSuggestion.textContent = analysis.fixedCode;
    proposedCode = analysis.fixedCode;
    aiModal.style.display = 'block';
}

function hideAIModal() { aiModal.style.display = 'none'; }

// --- PARSER ENGINE ---

function tokenize(code) {
    // Normalize braces to be on their own lines
    const normalized = code
        .replace(/([{}])/g, '\n$1\n') // Add newlines around { and }
        .replace(/else/g, '\nelse\n'); // Ensure else is on its own line

    return normalized.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*') && !l.startsWith('#'));
}

function parseBlock(lines, startIndex) {
    const nodes = [];
    let i = startIndex;

    while (i < lines.length) {
        let line = lines[i];

        // End of block
        if (line === '}') {
            return { nodes, nextIndex: i + 1 };
        }

        // Skip main function declaration and opening braces
        if (line.startsWith('int main') || line === '{') {
            i++;
            continue;
        }

        // Skip variable declarations without assignment (e.g., "int a;", "char name[50];")
        // We want to show "int a = 5;" but not just "int a;"
        const typeKeywords = ['int ', 'float ', 'char ', 'double ', 'long '];
        const isDeclaration = typeKeywords.some(type => line.startsWith(type));
        if (isDeclaration && !line.includes('=')) {
            i++;
            continue;
        }

        // Parse IF statements
        if (line.startsWith('if')) {
            const match = line.match(/\((.*)\)/);
            const condition = match ? match[1] : 'condition';
            const node = { type: 'if', text: condition, trueBlock: [], falseBlock: [] };

            // Check for opening brace for True block
            if (i + 1 < lines.length && lines[i + 1] === '{') {
                i += 2; // Skip 'if' and '{'
                const res = parseBlock(lines, i);
                node.trueBlock = res.nodes;
                i = res.nextIndex;
            } else {
                i++;
            }

            // Check for Else
            if (i < lines.length && lines[i] === 'else') {
                i++; // Skip 'else'
                if (i < lines.length && lines[i] === '{') {
                    i++; // Skip '{'
                    const res = parseBlock(lines, i);
                    node.falseBlock = res.nodes;
                    i = res.nextIndex;
                }
            }
            nodes.push(node);
        }
        // Parse Loops (while / for)
        else if (line.startsWith('while') || line.startsWith('for')) {
            let condition = 'loop';
            if (line.startsWith('while')) condition = line.match(/while\s*\((.*)\)/)?.[1] || 'while';
            else condition = line.match(/for\s*\((.*)\)/)?.[1]?.split(';')?.[1]?.trim() || 'for';

            const node = { type: 'loop', text: condition, body: [] };

            if (i + 1 < lines.length && lines[i + 1] === '{') {
                i += 2; // Skip loop line and '{'
                const res = parseBlock(lines, i);
                node.body = res.nodes;
                i = res.nextIndex;
            } else {
                i++;
            }
            nodes.push(node);
        }
        // Parse IO (printf / scanf)
        else if (line.startsWith('printf')) {
            // Check for paired scanf (Prompt + Input pattern)
            if (i + 1 < lines.length && lines[i + 1].startsWith('scanf')) {
                const scanfLine = lines[i + 1];
                // Extract variable name, handling both &var and array names
                const varMatch = scanfLine.match(/,\s*&?(\w+)/);
                const varName = varMatch ? varMatch[1] : 'Value';

                nodes.push({ type: 'io', text: `Input ${varName}` });
                i += 2; // Skip both printf and scanf
            } else {
                // Standalone printf or sequence of printfs
                let content = [];
                // Consume consecutive printfs
                while (i < lines.length && lines[i].startsWith('printf')) {
                    const match = lines[i].match(/"(.*?)"/);
                    if (match) {
                        let clean = match[1].replace(/\\n/g, '').replace(/\\t/g, ' ').trim();
                        if (clean) content.push(clean);
                    }
                    i++;
                }

                if (content.length > 1) {
                    // If multiple outputs, summarize
                    nodes.push({ type: 'io', text: "Display Output" });
                } else if (content.length === 1) {
                    nodes.push({ type: 'io', text: content[0] });
                }
            }
        }
        else if (line.startsWith('scanf')) {
            const varMatch = line.match(/,\s*&?(\w+)/);
            const varName = varMatch ? varMatch[1] : 'Value';
            nodes.push({ type: 'io', text: `Input ${varName}` });
            i++;
        }
        // Parse Return / End
        else if (line.includes('return')) {
            nodes.push({ type: 'end', text: 'End Program' });
            i++;
        }
        // Parse Generic Process
        else {
            nodes.push({ type: 'process', text: line.replace(';', '') });
            i++;
        }
    }
    return { nodes, nextIndex: i };
}

function parseCode(code) {
    const lines = tokenize(code);
    const res = parseBlock(lines, 0);
    if (res.nodes.length > 0 && res.nodes[0].type !== 'start') res.nodes.unshift({ type: 'start', text: 'Start Program' });
    return res.nodes;
}

// --- LAYOUT & RENDER ENGINE ---

const CONFIG = {
    nodeW: 160,
    nodeH: 60,
    yGap: 120, // Increased gap to prevent overlap
    xGap: 280  // Increased xGap for wider diamonds
};

let svgHTML = '';
let divHTML = '';

function generateFlowchart(code) {
    const nodes = parseCode(code);
    const container = document.getElementById('flowchartCanvas');
    container.innerHTML = '';

    svgHTML = `<defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#555"/>
        </marker>
    </defs>`;
    divHTML = '';

    // Start Layout
    const maxY = layoutBlock(nodes, 400, 50);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'connector');
    svg.style.height = (maxY + 200) + 'px';
    svg.style.width = '100%';
    svg.innerHTML = svgHTML;

    const wrapper = document.createElement('div');
    wrapper.className = 'flowchart';
    wrapper.style.height = (maxY + 200) + 'px';
    wrapper.style.width = '1500px'; // Wide canvas
    wrapper.innerHTML = divHTML;
    wrapper.appendChild(svg);

    container.appendChild(wrapper);
}

function createNode(type, text, x, y) {
    let cls = `node node-${type}`;
    if (type === 'if' || type === 'loop') cls += ' node-decision';

    // Centering logic
    const left = x - CONFIG.nodeW / 2;
    const top = y;

    divHTML += `<div class="${cls}" style="left:${left}px; top:${top}px;">
        <div class="text">${text}</div>
    </div>`;
}

function drawPath(x1, y1, x2, y2, label) {
    // Orthogonal routing
    let d = '';
    const midY = y1 + (y2 - y1) / 2;

    if (x1 === x2) {
        d = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
        d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
    }

    svgHTML += `<path d="${d}" class="arrow" marker-end="url(#arrowhead)"/>`;

    if (label) {
        // Label with background for readability
        const lx = (x1 === x2) ? x1 + 5 : x1 + (x2 > x1 ? 10 : -10);
        const ly = y1 + 20;
        svgHTML += `
            <rect x="${lx - 2}" y="${ly - 10}" width="35" height="16" fill="white" opacity="0.8"/>
            <text x="${lx}" y="${ly}" font-size="11" fill="#444" font-weight="bold">${label}</text>
        `;
    }
}

function drawLoopLine(x1, y1, x2, y2) {
    // Dotted line back up
    const outX = x1 - CONFIG.nodeW / 2 - 60; // Wider loop path
    const d = `M ${x1} ${y1} L ${outX} ${y1} L ${outX} ${y2} L ${x2} ${y2}`;
    svgHTML += `<path d="${d}" class="arrow" stroke-dasharray="5,5" marker-end="url(#arrowhead)" stroke="#777"/>`;
}

function layoutBlock(nodes, x, startY) {
    let curY = startY;
    let prev = null;
    let prevX = x;
    let prevY = startY;

    nodes.forEach(node => {
        // Adjust Y for diamond nodes
        let drawY = curY;
        if (node.type === 'if' || node.type === 'loop') {
            drawY += 33;
        }
        createNode(node.type, node.text, x, drawY);

        // Connect from previous
        if (prev) {
            if (prev.type !== 'if' && prev.type !== 'loop') {
                // Standard connection
                drawPath(prevX, prevY + CONFIG.nodeH, x, curY);
            }
        }

        if (node.type === 'if') {
            const DIAMOND_H = 160;
            const realHeight = 226; // Visual height of rotated diamond
            const realHalfWidth = 113;

            // True (Down)
            const trueStart = curY + realHeight;
            drawPath(x, trueStart, x, trueStart + CONFIG.yGap, 'True');
            const tEndY = layoutBlock(node.trueBlock, x, trueStart + CONFIG.yGap);

            // False (Right)
            const rX = x + realHalfWidth;
            const rY = curY + (realHeight / 2);

            const fX = x + CONFIG.xGap + 60;
            const fY = trueStart + CONFIG.yGap;

            const d = `M ${rX} ${rY} L ${fX} ${rY} L ${fX} ${fY}`;
            svgHTML += `<path d="${d}" class="arrow" marker-end="url(#arrowhead)"/>`;

            svgHTML += `<rect x="${rX + 10}" y="${rY - 10}" width="35" height="16" fill="white" opacity="0.8"/>
                        <text x="${rX + 15}" y="${rY + 2}" font-size="11" fill="#444" font-weight="bold">False</text>`;

            const fEndY = layoutBlock(node.falseBlock, fX, fY);

            // Merge
            // Ensure merge point is below BOTH branches with ample space
            const mergeY = Math.max(tEndY, fEndY) + CONFIG.yGap;

            // 1. True (Down)
            // Connect from the bottom of the last node in the true block
            // If true block was empty, tEndY is just trueStart + yGap
            // We need to connect from tEndY - yGap (bottom of last node) to mergeY
            // But wait, layoutBlock returns the NEXT available Y.
            // So the last node ended at tEndY - yGap - nodeH (roughly).
            // Let's just draw from tEndY - CONFIG.yGap (which is where the next node WOULD have started)

            // Actually, let's be precise. layoutBlock returns the Y for the *next* element.
            // So the previous element finished at tEndY - CONFIG.yGap.
            // But if the block was empty?

            let trueConnectY = tEndY - CONFIG.yGap;
            if (node.trueBlock.length === 0) trueConnectY = trueStart + CONFIG.yGap; // If empty, connect from start

            drawPath(x, trueConnectY, x, mergeY);

            // 2. False (Down -> Left)
            let falseConnectY = fEndY - CONFIG.yGap;
            if (node.falseBlock.length === 0) falseConnectY = fY;

            const fB_X = fX;
            const dMerge = `M ${fB_X} ${falseConnectY} L ${fB_X} ${mergeY} L ${x} ${mergeY}`;
            svgHTML += `<path d="${dMerge}" class="arrow" marker-end="url(#arrowhead)"/>`;

            curY = mergeY;
            prev = node;
            prevX = x;
            prevY = curY;

        } else if (node.type === 'loop') {
            const DIAMOND_H = 160;
            const realHeight = 226;
            const realHalfWidth = 113;

            // Body (Down)
            const bodyStart = curY + realHeight;
            drawPath(x, bodyStart, x, bodyStart + CONFIG.yGap, 'True');
            const bodyEndY = layoutBlock(node.body, x, bodyStart + CONFIG.yGap);

            // Loop Back
            let bodyConnectY = bodyEndY - CONFIG.yGap;
            if (node.body.length === 0) bodyConnectY = bodyStart + CONFIG.yGap;

            // Connect back to the LEFT side of the diamond for loop?
            // Or just standard loop back.
            // Let's loop back to the top-left area.
            const loopTargetY = curY + (realHeight / 2);
            drawLoopLine(x, bodyConnectY, x, loopTargetY);

            // Exit (Right -> Down)
            const rX = x + realHalfWidth;
            const rY = curY + (realHeight / 2);
            const exitY = bodyEndY + CONFIG.yGap;

            // Draw False/Exit arrow
            const d = `M ${rX} ${rY} L ${x + CONFIG.nodeW + 100} ${rY} L ${x + CONFIG.nodeW + 100} ${exitY} L ${x} ${exitY}`;
            svgHTML += `<path d="${d}" class="arrow" marker-end="url(#arrowhead)"/>`;
            svgHTML += `<text x="${rX + 10}" y="${rY - 5}" font-size="11">False</text>`;

            curY = exitY;
            prev = node;
            prevX = x;
            prevY = curY;

        } else {
            curY += CONFIG.nodeH + CONFIG.yGap;
            prev = node;
            prevX = x;
            prevY = curY - (CONFIG.nodeH + CONFIG.yGap);
        }
    });

    return curY;
}
