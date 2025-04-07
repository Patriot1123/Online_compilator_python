document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        showTrailingSpace: true,
        styleActiveLine: true,
        extraKeys: {
            'Tab': function(cm) {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    cm.replaceSelection('    ', 'end');
                }
            },
            'Shift-Tab': function(cm) {
                cm.indentSelection('subtract');
            },
            'Enter': function(cm) {
                const cursor = cm.getCursor();
                const line = cm.getLine(cursor.line);
                const prevLine = cm.getLine(cursor.line - 1);

                // Auto-indent based on previous line
                let indent = '';
                const prevIndent = prevLine.match(/^\s*/)[0];

                if (prevLine.trim().endsWith(':')) {
                    indent = prevIndent + '    ';
                } else {
                    indent = prevIndent;
                }

                cm.replaceSelection('\n' + indent);
            }
        }
    });

    // DOM elements
    const filenameInput = document.getElementById('filename');
    const saveBtn = document.getElementById('save-file');
    const runBtn = document.getElementById('run-code');
    const deleteBtn = document.getElementById('delete-file');
    const newFileBtn = document.getElementById('new-file');
    const uploadBtn = document.getElementById('upload-file');
    const fileUpload = document.getElementById('file-upload');
    const outputArea = document.getElementById('output');
    const inputArea = document.getElementById('input-area');
    const pythonFilesList = document.getElementById('python-files');
    const imageFilesList = document.getElementById('image-files');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const notification = document.getElementById('notification');
    const lineCount = document.getElementById('line-count');
    const charCount = document.getElementById('char-count');
    const fileSize = document.getElementById('file-size');

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Current file state
    let currentFile = null;

    // Load files on startup
    loadFiles();
    loadImages();

    // Event listeners
    saveBtn.addEventListener('click', saveFile);
    runBtn.addEventListener('click', runCode);
    deleteBtn.addEventListener('click', showDeleteConfirmation);
    newFileBtn.addEventListener('click', createNewFile);
    uploadBtn.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', uploadImage);
    confirmDeleteBtn.addEventListener('click', deleteFile);
    cancelDeleteBtn.addEventListener('click', () => confirmModal.style.display = 'none');

    // Update stats when code changes
    editor.on('change', updateStats);

    // Functions
    function loadFiles() {
        fetch('/files')
            .then(response => response.json())
            .then(files => {
                pythonFilesList.innerHTML = '';
                files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = file.name;
                    li.addEventListener('click', () => loadFile(file));
                    pythonFilesList.appendChild(li);
                });
            });
    }

    function loadImages() {
        fetch('/images')
            .then(response => response.json())
            .then(images => {
                imageFilesList.innerHTML = '';
                images.forEach(img => {
                    const li = document.createElement('li');
                    li.textContent = img.name;
                    imageFilesList.appendChild(li);
                });
            });
    }

    function loadFile(file) {
        currentFile = file.name;
        filenameInput.value = file.name;
        editor.setValue(file.content);
        updateStats();
    }

    function saveFile() {
        const filename = filenameInput.value.trim();
        if (!filename) {
            showNotification('Please enter a filename', 'error');
            return;
        }

        const content = editor.getValue();

        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                content: content
            })
        })
        .then(response => response.json())
        .then(data => {
            showNotification(data.message, 'success');
            currentFile = data.filename;
            loadFiles();
        })
        .catch(error => {
            showNotification('Error saving file', 'error');
            console.error('Error:', error);
        });
    }

    function runCode() {
        const code = editor.getValue();
        const input = inputArea.value;

        fetch('/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                input: input
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error') {
                outputArea.textContent = data.error;
                outputArea.style.color = '#f14c4c';
            } else {
                outputArea.textContent = data.output;
                outputArea.style.color = '#d4d4d4';
            }

            // Switch to output tab
            document.querySelector('[data-tab="output"]').click();
        })
        .catch(error => {
            outputArea.textContent = `Error: ${error}`;
            outputArea.style.color = '#f14c4c';
            console.error('Error:', error);
        });
    }

    function showDeleteConfirmation() {
        if (!currentFile) {
            showNotification('No file selected', 'error');
            return;
        }

        confirmModal.style.display = 'flex';
    }

    function deleteFile() {
        fetch(`/delete/${currentFile}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            showNotification(data.message, 'success');
            confirmModal.style.display = 'none';
            currentFile = null;
            filenameInput.value = '';
            editor.setValue('');
            loadFiles();
        })
        .catch(error => {
            showNotification('Error deleting file', 'error');
            console.error('Error:', error);
        });
    }

    function createNewFile() {
        currentFile = null;
        filenameInput.value = '';
        editor.setValue('');
        updateStats();
    }

    function uploadImage() {
        const file = fileUpload.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showNotification(data.message, 'success');
            loadImages();
        })
        .catch(error => {
            showNotification('Error uploading image', 'error');
            console.error('Error:', error);
        });
    }

    function updateStats() {
        const content = editor.getValue();
        const lines = content.split('\n').length;
        const chars = content.length;

        lineCount.textContent = lines;
        charCount.textContent = chars;

        // Calculate file size (rough estimate)
        const size = new Blob([content]).size;
        fileSize.textContent = size;
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#0e639c' : '#f14c4c';
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});