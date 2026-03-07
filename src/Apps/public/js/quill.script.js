document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // 1. SET POSTED AT OTOMATIS
    // ===========================================
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const mysqlDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    document.getElementById('posted_at').value = mysqlDateTime;

    // ===========================================
    // 2. INISIALISASI QUILL EDITOR
    // ===========================================
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Write your post content here...',
        modules: {
            syntax: {
                highlight: text => {
                    try {
                        // Detect language from the text
                        const language = detectLanguage(text);
                        if (language && hljs.getLanguage(language)) {
                            return hljs.highlight(text, { language }).value;
                        }
                        return hljs.highlightAuto(text).value;
                    } catch (e) {
                        console.warn('Highlight.js error:', e);
                        return text;
                    }
                }
            },
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'code-block'],
                ['clean']
            ]
        }
    });

    // ===========================================
    // 3. FUNGSI DETEKSI BAHASA
    // ===========================================
    function detectLanguage(code) {
        if (!code) return null;
        
        // HTML detection
        if (/<!DOCTYPE html>|<html[\s>]|<body[\s>]|<div[\s>]|<span[\s>]|<head[\s>]/i.test(code)) {
            return 'html';
        }
        
        // PHP detection
        if (/<\?php|\?>/.test(code)) {
            return 'php';
        }
        
        // JavaScript/TypeScript detection
        if (/(function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|let\s+\w+|=>|console\.log|document\.|window\.)/.test(code)) {
            return 'javascript';
        }
        
        // Python detection
        if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\(|if\s+__name__\s*==\s*['"]__main__['"]/.test(code)) {
            return 'python';
        }
        
        // Java detection
        if (/public\s+class|private\s+\w+|protected\s+\w+|void\s+\w+\(|System\.out\.println|@Override/.test(code)) {
            return 'java';
        }
        
        // C/C++ detection
        if (/#include\s*[<"][^>"]+[>"]|int\s+main\s*\(|printf\(|cout\s*<<|cin\s*>>/.test(code)) {
            return 'cpp';
        }
        
        // Go detection
        if (/package\s+main|func\s+\w+\s*\(|import\s*\(|fmt\.Print|go\s+func/.test(code)) {
            return 'go';
        }
        
        // SQL detection
        if (/SELECT\s+.*\s+FROM|INSERT\s+INTO|UPDATE\s+.*\s+SET|DELETE\s+FROM|CREATE\s+TABLE/i.test(code)) {
            return 'sql';
        }
        
        // CSS detection
        if (/[.#]?\w+\s*{[^}]*}/.test(code) && /color|margin|padding|font-size|background/.test(code)) {
            return 'css';
        }
        
        return null;
    }

    // ===========================================
    // 4. FUNGSI UNTUK MEMPROSES CODE BLOCKS
    // ===========================================
    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.ql-syntax');
        
        codeBlocks.forEach(block => {
            // Skip if already processed
            if (block.classList.contains('code-processed')) return;
            
            const code = block.textContent || '';
            const language = detectLanguage(code) || 'plaintext';
            
            // Add language class
            block.classList.add(`language-${language}`);
            block.classList.add('code-processed');
            
            // Apply syntax highlighting
            try {
                if (language !== 'plaintext' && hljs.getLanguage(language)) {
                    const highlighted = hljs.highlight(code, { language }).value;
                    block.innerHTML = highlighted;
                } else {
                    const highlighted = hljs.highlightAuto(code).value;
                    block.innerHTML = highlighted;
                }
            } catch (e) {
                console.warn('Highlight error:', e);
            }
            
            // Create wrapper with language badge
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            const badge = document.createElement('div');
            badge.className = 'code-language-badge';
            badge.textContent = language;
            
            // Insert wrapper and badge
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
            wrapper.insertBefore(badge, block);
        });
    }

    // ===========================================
    // 5. OBSERVER UNTUK PERUBAHAN DOM
    // ===========================================
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                processCodeBlocks();
            }
        });
    });

    // Start observing the editor container
    observer.observe(document.getElementById('editor-container'), {
        childList: true,
        subtree: true,
        characterData: true
    });

    // ===========================================
    // 6. AMBIL ELEMEN YANG DIPERLUKAN
    // ===========================================
    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');
    const slugPreview = document.getElementById('slugPreview');
    const form = document.getElementById('postForm');
    const bodyTextarea = document.getElementById('body');
    const charCount = document.getElementById('charCount');

    // ===========================================
    // 7. FUNGSI GENERATE SLUG
    // ===========================================
    function generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // ===========================================
    // 8. FUNGSI UPDATE SLUG PREVIEW
    // ===========================================
    function updateSlugPreview() {
        const title = titleInput.value.trim();
        if (title) {
            const generatedSlug = generateSlug(title);
            slugPreview.textContent = `Preview: ${generatedSlug}`;

            if (!slugInput.value.trim()) {
                slugInput.value = generatedSlug;
            }
        } else {
            slugPreview.textContent = '';
        }
    }

    // ===========================================
    // 9. EVENT LISTENER UNTUK TITLE
    // ===========================================
    titleInput.addEventListener('input', updateSlugPreview);

    // ===========================================
    // 10. VALIDASI SLUG FORMAT
    // ===========================================
    slugInput.addEventListener('input', function() {
        const slugPattern = /^[a-z0-9-]+$/;
        const hasSpace = /\s/.test(this.value);
        const value = this.value.trim();

        if (value && (!slugPattern.test(value) || hasSpace)) {
            this.classList.add('is-invalid');
            document.getElementById('slugError').style.display = 'block';
        } else {
            this.classList.remove('is-invalid');
            document.getElementById('slugError').style.display = 'none';
        }
    });

    // ===========================================
    // 11. FUNGSI UPDATE CHARACTER COUNT
    // ===========================================
    function updateCharCount() {
        const text = quill.getText().trim();
        const length = text.length;
        charCount.textContent = `${length} character${length !== 1 ? 's' : ''}`;
    }

    // ===========================================
    // 12. UPDATE HIDDEN TEXTAREA DARI QUILL
    // ===========================================
    quill.on('text-change', function(delta, oldDelta, source) {
        const content = quill.root.innerHTML;
        bodyTextarea.value = content;
        updateCharCount();

        // Remove invalid class if content exists
        if (quill.getText().trim().length > 0) {
            document.querySelector('#editor-container').classList.remove('is-invalid');
            document.getElementById('bodyError').style.display = 'none';
        }

        // Process code blocks after a short delay
        setTimeout(processCodeBlocks, 100);
    });

    // ===========================================
    // 13. HANDLE FORM SUBMISSION
    // ===========================================
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Validasi Title
        if (!titleInput.value.trim()) {
            titleInput.classList.add('is-invalid');
            document.getElementById('titleError').style.display = 'block';
            isValid = false;
        } else {
            titleInput.classList.remove('is-invalid');
            document.getElementById('titleError').style.display = 'none';
        }

        // Validasi Body
        const quillContent = quill.getText().trim();
        if (quillContent.length === 0) {
            document.querySelector('#editor-container').classList.add('is-invalid');
            document.getElementById('bodyError').style.display = 'block';
            isValid = false;
        } else {
            document.querySelector('#editor-container').classList.remove('is-invalid');
            document.getElementById('bodyError').style.display = 'none';
        }

        // Validasi Slug
        const slugPattern = /^[a-z0-9-]+$/;
        const slugValue = slugInput.value.trim();

        if (slugValue && (!slugPattern.test(slugValue) || /\s/.test(slugValue))) {
            slugInput.classList.add('is-invalid');
            document.getElementById('slugError').style.display = 'block';
            isValid = false;
        } else {
            slugInput.classList.remove('is-invalid');
            document.getElementById('slugError').style.display = 'none';
        }

        // Generate slug if empty
        if (!slugValue && titleInput.value.trim()) {
            slugInput.value = generateSlug(titleInput.value.trim());
        }

        if (isValid) {
            // Update posted_at before submit
            const now = new Date();
            const mysqlDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            document.getElementById('posted_at').value = mysqlDateTime;

            // Make sure content is saved with preserved formatting
            bodyTextarea.value = quill.root.innerHTML;
            this.submit();
        }
    });

    // ===========================================
    // 14. INITIAL PROCESSING
    // ===========================================
    updateCharCount();
    updateSlugPreview();
    
    // Process code blocks multiple times to ensure they're caught
    setTimeout(processCodeBlocks, 500);
    setTimeout(processCodeBlocks, 1000);
    setTimeout(processCodeBlocks, 2000);

    // ===========================================
    // 15. TAMBAHKAN CSS UNTUK SYNTAX HIGHLIGHTING
    // ===========================================
    const style = document.createElement('style');
    style.textContent = `
        /* Code block wrapper */
        .code-block-wrapper {
            position: relative;
            margin: 1.5em 0;
        }

        /* Code block styling */
        .ql-syntax {
            background-color: #1e1e1e !important;
            color: #d4d4d4 !important;
            border-radius: 8px !important;
            padding: 1.2em !important;
            padding-top: 2.5em !important;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            overflow-x: auto !important;
            margin: 0 !important;
            border: 1px solid #333 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }

        /* Language badge */
        .code-language-badge {
            position: absolute;
            top: 8px;
            right: 12px;
            background: #2d2d2d;
            color: #e0e0e0;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: 'Consolas', monospace;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 10;
            border: 1px solid #404040;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* VS Code-like syntax highlighting */
        .hljs-keyword { color: #569cd6 !important; font-weight: bold; }
        .hljs-string { color: #ce9178 !important; }
        .hljs-comment { color: #6a9955 !important; font-style: italic; }
        .hljs-function { color: #dcdcaa !important; }
        .hljs-number { color: #b5cea8 !important; }
        .hljs-operator { color: #d4d4d4 !important; }
        .hljs-punctuation { color: #d4d4d4 !important; }
        .hljs-title { color: #4ec9b0 !important; }
        .hljs-params { color: #9cdcfe !important; }
        .hljs-built_in { color: #4ec9b0 !important; }
        .hljs-literal { color: #569cd6 !important; }
        .hljs-type { color: #4ec9b0 !important; }
        .hljs-tag { color: #569cd6 !important; }
        .hljs-name { color: #569cd6 !important; }
        .hljs-attr { color: #9cdcfe !important; }
        .hljs-variable { color: #9cdcfe !important; }
        .hljs-regexp { color: #d16969 !important; }
        .hljs-symbol { color: #dcdcaa !important; }
        
        /* Language-specific adjustments */
        .language-html .hljs-tag { color: #569cd6 !important; }
        .language-html .hljs-name { color: #569cd6 !important; }
        .language-html .hljs-attr { color: #9cdcfe !important; }
        .language-html .hljs-string { color: #ce9178 !important; }
        
        .language-css .hljs-selector-class { color: #d7ba7d !important; }
        .language-css .hljs-selector-id { color: #d7ba7d !important; }
        .language-css .hljs-property { color: #9cdcfe !important; }
        .language-css .hljs-value { color: #ce9178 !important; }
        
        .language-php .hljs-variable { color: #9cdcfe !important; }
        
        /* Quill editor customizations */
        .ql-editor pre.ql-syntax {
            background-color: #1e1e1e !important;
        }
        
        /* Ensure code blocks in editor maintain styling */
        .ql-editor .code-block-wrapper {
            margin: 1.5em 0;
        }
    `;
    document.head.appendChild(style);
});