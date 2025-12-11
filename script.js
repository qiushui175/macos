// Global state
const state = {
    windows: [],
    currentWallpaper: 0,
    zIndexCounter: 100,
    terminalHistory: [],
    terminalHistoryIndex: -1,
    fileSystem: {
        '/': {
            'Documents': {},
            'Downloads': {},
            'Desktop': {},
            'Applications': {}
        }
    },
    currentPath: '/'
};

// Wallpapers
const wallpapers = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set initial wallpaper
    setWallpaper(state.currentWallpaper);
    
    // Add dock event listeners
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', () => handleDockClick(item));
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('dateTime');
    const options = { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    };
    dateTimeElement.textContent = now.toLocaleDateString('zh-CN', options);
}

// Handle dock item clicks
function handleDockClick(item) {
    const app = item.dataset.app;
    
    // Add bounce animation
    item.classList.add('bouncing');
    setTimeout(() => item.classList.remove('bouncing'), 600);
    
    // Open application
    setTimeout(() => {
        switch(app) {
            case 'finder':
                openFinder();
                break;
            case 'terminal':
                openTerminal();
                break;
            case 'settings':
                openSettings();
                break;
            case 'about':
                openAbout();
                break;
            case 'trash':
                // Trash functionality
                break;
        }
    }, 200);
}

// Create window
function createWindow(title, content, width = 600, height = 400) {
    const windowId = `window-${Date.now()}`;
    const desktop = document.getElementById('desktop');
    
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.id = windowId;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = `${height}px`;
    windowElement.style.left = `${Math.random() * 200 + 100}px`;
    windowElement.style.top = `${Math.random() * 100 + 50}px`;
    windowElement.style.zIndex = state.zIndexCounter++;
    
    windowElement.innerHTML = `
        <div class="window-titlebar">
            <div class="window-controls">
                <div class="window-control close" onclick="closeWindow('${windowId}')"></div>
                <div class="window-control minimize" onclick="minimizeWindow('${windowId}')"></div>
                <div class="window-control maximize"></div>
            </div>
            <div class="window-title">${title}</div>
            <div style="width: 52px;"></div>
        </div>
        <div class="window-content" id="${windowId}-content">
            ${content}
        </div>
    `;
    
    desktop.appendChild(windowElement);
    
    // Make window draggable
    makeDraggable(windowElement);
    
    // Bring to front on click
    windowElement.addEventListener('mousedown', () => {
        windowElement.style.zIndex = state.zIndexCounter++;
    });
    
    state.windows.push(windowId);
    return windowId;
}

// Close window
function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.classList.add('closing');
        setTimeout(() => {
            windowElement.remove();
            state.windows = state.windows.filter(id => id !== windowId);
        }, 250);
    }
}

// Minimize window
function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.classList.add('minimizing');
        setTimeout(() => {
            windowElement.style.display = 'none';
            windowElement.classList.remove('minimizing');
        }, 400);
    }
}

// Make element draggable
function makeDraggable(element) {
    const titlebar = element.querySelector('.window-titlebar');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-control')) return;
        
        isDragging = true;
        initialX = e.clientX - element.offsetLeft;
        initialY = e.clientY - element.offsetTop;
        
        element.style.zIndex = state.zIndexCounter++;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Set wallpaper
function setWallpaper(index) {
    const desktop = document.getElementById('desktop');
    desktop.style.background = wallpapers[index];
    state.currentWallpaper = index;
}

// Open Finder
function openFinder() {
    const content = `
        <div style="display: flex; height: 100%;">
            <div class="finder-sidebar">
                <div class="finder-item active">收藏夹</div>
                <div class="finder-item">桌面</div>
                <div class="finder-item">文稿</div>
                <div class="finder-item">下载</div>
                <div class="finder-item">应用程序</div>
            </div>
            <div class="finder-main">
                <div class="finder-toolbar">
                    <span>←</span>
                    <span>→</span>
                    <span style="flex: 1; padding-left: 20px;">收藏夹</span>
                </div>
                <div class="finder-content">
                    <div class="file-icon">📁 文稿</div>
                    <div class="file-icon">📁 下载</div>
                    <div class="file-icon">📁 桌面</div>
                    <div class="file-icon">📁 应用程序</div>
                </div>
            </div>
        </div>
    `;
    createWindow('访达', content, 700, 500);
}

// Open Terminal
function openTerminal() {
    const windowId = createWindow('终端', '<div class="terminal-content" id="terminal"></div>', 700, 450);
    initializeTerminal(windowId);
}

// Initialize Terminal
function initializeTerminal(windowId) {
    const terminal = document.getElementById('terminal');
    const prompt = 'user@macOS ~ % ';
    
    let currentInput = '';
    let cursorPosition = 0;
    
    function renderTerminal() {
        terminal.innerHTML = state.terminalHistory.map(line => 
            `<div class="terminal-line">${line}</div>`
        ).join('') + `
            <div class="terminal-line">
                <span class="terminal-prompt">${prompt}</span><span id="terminal-input-display">${currentInput}</span><span class="terminal-cursor"></span>
            </div>
        `;
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    function executeCommand(cmd) {
        const parts = cmd.trim().split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        let output = '';
        
        switch(command) {
            case 'help':
                output = '可用命令:\n  ls - 列出文件\n  pwd - 显示当前路径\n  echo - 输出文本\n  date - 显示日期时间\n  clear - 清空终端\n  whoami - 显示用户名\n  uname - 显示系统信息\n  help - 显示帮助';
                break;
            case 'ls':
                const dir = state.fileSystem[state.currentPath];
                output = Object.keys(dir).join('\n') || '(empty)';
                break;
            case 'pwd':
                output = state.currentPath;
                break;
            case 'echo':
                output = args.join(' ');
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'clear':
                state.terminalHistory = [];
                currentInput = '';
                renderTerminal();
                return;
            case 'whoami':
                output = 'user';
                break;
            case 'uname':
                output = 'macOS Simulator v1.0';
                break;
            case 'cd':
                const path = args[0];
                if (!path) {
                    // cd without arguments goes to home
                    state.currentPath = '/';
                    output = '';
                } else if (path === '..') {
                    // Go up one directory
                    const parts = state.currentPath.split('/').filter(p => p);
                    parts.pop();
                    state.currentPath = '/' + parts.join('/');
                    if (state.currentPath === '') state.currentPath = '/';
                    output = '';
                } else if (path && state.fileSystem[state.currentPath][path]) {
                    state.currentPath = state.currentPath + (state.currentPath === '/' ? '' : '/') + path;
                    output = '';
                } else if (path) {
                    output = `cd: ${path}: No such file or directory`;
                }
                break;
            case 'mkdir':
                const dirName = args[0];
                if (dirName) {
                    state.fileSystem[state.currentPath][dirName] = {};
                    output = '';
                } else {
                    output = 'mkdir: missing operand';
                }
                break;
            case '':
                break;
            default:
                output = `zsh: command not found: ${command}`;
        }
        
        state.terminalHistory.push(prompt + cmd);
        if (output) {
            state.terminalHistory.push(output);
        }
    }
    
    // Keyboard event handling
    document.addEventListener('keydown', function terminalKeyHandler(e) {
        const windowElement = document.getElementById(windowId);
        if (!windowElement || windowElement.style.display === 'none') {
            document.removeEventListener('keydown', terminalKeyHandler);
            return;
        }
        
        // Only handle if terminal window is focused (topmost)
        const allWindows = document.querySelectorAll('.window');
        let maxZ = 0;
        let topWindow = null;
        allWindows.forEach(w => {
            const z = parseInt(w.style.zIndex || 0);
            if (z > maxZ) {
                maxZ = z;
                topWindow = w;
            }
        });
        
        if (topWindow !== windowElement) return;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(currentInput);
            currentInput = '';
            renderTerminal();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            currentInput = currentInput.slice(0, -1);
            renderTerminal();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.terminalHistoryIndex < state.terminalHistory.length - 1) {
                state.terminalHistoryIndex++;
                // Find previous command
                for (let i = state.terminalHistory.length - 1 - state.terminalHistoryIndex; i >= 0; i--) {
                    if (state.terminalHistory[i].startsWith(prompt)) {
                        currentInput = state.terminalHistory[i].substring(prompt.length);
                        renderTerminal();
                        break;
                    }
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.terminalHistoryIndex > 0) {
                state.terminalHistoryIndex--;
            } else {
                currentInput = '';
                renderTerminal();
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            currentInput += e.key;
            renderTerminal();
        }
    });
    
    // Initial render
    state.terminalHistory.push('macOS Simulator Terminal v1.0');
    state.terminalHistory.push('输入 "help" 查看可用命令');
    state.terminalHistory.push('');
    renderTerminal();
}

// Open Settings
function openSettings() {
    const wallpaperOptions = wallpapers.map((bg, index) => `
        <div class="wallpaper-option ${index === state.currentWallpaper ? 'active' : ''}" 
             style="background: ${bg};"
             onclick="changeWallpaper(${index})">
        </div>
    `).join('');
    
    const content = `
        <div>
            <h2 style="margin-bottom: 20px;">系统偏好设置</h2>
            <h3 style="margin-bottom: 12px;">桌面壁纸</h3>
            <div class="wallpaper-grid">
                ${wallpaperOptions}
            </div>
        </div>
    `;
    createWindow('系统偏好设置', content, 700, 550);
}

// Change wallpaper
function changeWallpaper(index) {
    setWallpaper(index);
    
    // Update active state in settings window
    document.querySelectorAll('.wallpaper-option').forEach((option, i) => {
        if (i === index) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Open About
function openAbout() {
    const content = `
        <div class="system-info">
            <h2 style="margin-bottom: 20px;">关于本机</h2>
            <div class="system-info-row">
                <div class="system-info-label">系统名称:</div>
                <div class="system-info-value">macOS Simulator</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">版本:</div>
                <div class="system-info-value">1.0.0</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">处理器:</div>
                <div class="system-info-value">Web Browser Engine</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">内存:</div>
                <div class="system-info-value">${(performance.memory && performance.memory.jsHeapSizeLimit ? (performance.memory.jsHeapSizeLimit / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'N/A')}</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">用户代理:</div>
                <div class="system-info-value">${navigator.userAgent.substring(0, 50)}...</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">窗口数量:</div>
                <div class="system-info-value">${state.windows.length} 个打开的窗口</div>
            </div>
            <div class="system-info-row">
                <div class="system-info-label">当前时间:</div>
                <div class="system-info-value">${new Date().toLocaleString('zh-CN')}</div>
            </div>
        </div>
    `;
    createWindow('关于本机', content, 600, 450);
}
