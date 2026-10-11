/* Nelli admin: Google Apps Script is the API; Sheets and Drive stay the storage layer. */
(function () {
    'use strict';

    const API_URL = String(window.NELLI_API_URL || '').trim();
    const LANGUAGES = ['uk', 'ru', 'en', 'cz'];
    const SITE_FIELDS = [
        ['heroEyebrow', 'Підпис над заголовком'],
        ['hero1', 'Заголовок · рядок 1'],
        ['hero2', 'Заголовок · рядок 2'],
        ['heroText', 'Текст першого екрана'],
        ['heroButton', 'Текст кнопки'],
        ['aboutTitle1', 'Заголовок «Про мене» · рядок 1'],
        ['aboutTitle2', 'Заголовок «Про мене» · рядок 2'],
        ['aboutText1', 'Про мене · абзац 1'],
        ['aboutText2', 'Про мене · абзац 2'],
        ['aboutText3', 'Про мене · абзац 3'],
        ['contactTitle1', 'Заголовок контактів · рядок 1'],
        ['contactTitle2', 'Заголовок контактів · рядок 2'],
        ['contactText', 'Текст контактів']
    ];
    const state = { token: '', sessions: [], photos: [], bookings: [], siteContent: emptyContent(), currentId: '', isNew: false };
    const $ = function (selector, root) { return (root || document).querySelector(selector); };
    const $$ = function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); };
    const els = {
        loginScreen: $('#loginScreen'), loginForm: $('#loginForm'), adminToken: $('#adminToken'), loginButton: $('#loginButton'), loginMessage: $('#loginMessage'),
        app: $('#app'), globalMessage: $('#globalMessage'), connection: $('#connectionStatus'), logout: $('#logoutButton'), refresh: $('#refreshButton'),
        sessionsView: $('#sessionsView'), siteView: $('#siteView'), bookingsView: $('#bookingsView'), pageTitle: $('#pageTitle'), newSession: $('#newSessionButton'),
        sessionSearch: $('#sessionSearch'), sessionCount: $('#sessionCount'), sessionsList: $('#sessionsList'), sessionsListStatus: $('#sessionsListStatus'),
        emptyState: $('#emptyState'), editor: $('#editor'), editorTitle: $('#editorTitle'), editorStatus: $('#editorStatus'), saveSession: $('#saveSessionButton'),
        deleteSession: $('#deleteSessionButton'), photoInput: $('#photoInput'), photosList: $('#photosList'), bookingsList: $('#bookingsList'), bookingBadge: $('#bookingBadge'),
        contentFields: $('#contentFields'), contentStatus: $('#contentStatus'), saveDraft: $('#saveDraftButton'), publish: $('#publishContentButton')
    };

    function emptyContent() {
        return window.NelliContentModel ? window.NelliContentModel.emptyContent() : {
            version: 1, published: false, translations: { uk: {}, ru: {}, en: {}, cz: {} },
            media: { heroUrl: '', aboutUrl: '' }, links: { hero: '#contact' }, seo: {}, sections: {}, social: [], services: [], portfolio: []
        };
    }

    function mergeContent(value) {
        if (window.NelliContentModel) return window.NelliContentModel.mergeContent(value || {});
        return Object.assign(emptyContent(), value || {});
    }

    function setMessage(node, text, kind) {
        if (!node) return;
        node.textContent = text || '';
        node.classList.toggle('is-error', kind === 'error');
        node.classList.toggle('is-success', kind === 'success');
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
        });
    }

    function getValue(id) {
        const node = document.getElementById(id);
        return node ? node.value.trim() : '';
    }

    function setValue(id, value) {
        const node = document.getElementById(id);
        if (node) node.value = value == null ? '' : value;
    }

    function checked(id) {
        const node = document.getElementById(id);
        return Boolean(node && node.checked);
    }

    function setChecked(id, value) {
        const node = document.getElementById(id);
        if (node) node.checked = String(value).toLowerCase() === 'true';
    }

    function delay(ms) { return new Promise(function (resolve) { window.setTimeout(resolve, ms); }); }

    function getJsonp(action, params) {
        if (!API_URL || API_URL.indexOf('PASTE_YOUR_') >= 0) {
            return Promise.reject(new Error('Спершу додайте URL Google Apps Script у config.js.'));
        }
        return new Promise(function (resolve, reject) {
            const callback = '__nelliCallback_' + Date.now() + '_' + Math.random().toString(36).slice(2);
            const script = document.createElement('script');
            let done = false;
            const query = new URLSearchParams(Object.assign({ action: action, callback: callback, _: String(Date.now()) }, params || {}));
            const timer = window.setTimeout(function () { finish(new Error('Google Apps Script не відповів вчасно.')); }, 15000);
            function cleanup() {
                window.clearTimeout(timer);
                try { delete window[callback]; } catch (_) { window[callback] = undefined; }
                if (script.parentNode) script.parentNode.removeChild(script);
            }
            function finish(error, value) {
                if (done) return;
                done = true;
                cleanup();
                if (error) reject(error); else resolve(value);
            }
            window[callback] = function (data) {
                if (!data || data.success !== true) return finish(new Error((data && data.error) || 'Google Apps Script повернув помилку.'));
                finish(null, data);
            };
            script.onerror = function () { finish(new Error('Не вдалося завантажити відповідь Google Apps Script.')); };
            script.src = API_URL + '?' + query.toString();
            document.body.appendChild(script);
        });
    }

    async function postAdmin(payload) {
        if (!API_URL || API_URL.indexOf('PASTE_YOUR_') >= 0) throw new Error('Спершу додайте URL Google Apps Script у config.js.');
        await fetch(API_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(Object.assign({ admin: true, token: state.token }, payload))
        });
    }

    async function loadData() {
        const data = await getJsonp('adminData', { token: state.token });
        state.sessions = Array.isArray(data.sessions) ? data.sessions : [];
        state.photos = Array.isArray(data.photos) ? data.photos : [];
        state.bookings = Array.isArray(data.bookings) ? data.bookings : [];
        state.siteContent = mergeContent(data.siteContent || data.content || {});
        renderAll();
        setConnection(true, 'Google Drive підключено');
        return data;
    }

    function setConnection(online, label) {
        if (!els.connection) return;
        els.connection.classList.toggle('online', online);
        els.connection.classList.toggle('offline', !online);
        els.connection.lastChild.textContent = ' ' + label;
        const status = $('#dashboardStatus');
        if (status) status.textContent = online ? 'Підключено' : 'Немає зв’язку';
    }

    async function confirmRefresh(check, attempts) {
        for (let i = 0; i < (attempts || 8); i += 1) {
            await delay(i === 0 ? 500 : 700);
            await loadData();
            if (check()) return true;
        }
        throw new Error('Зміни не підтверджені Google Sheets. Оновіть список і перевірте стан у Drive.');
    }

    async function login(event) {
        event.preventDefault();
        const token = els.adminToken.value.replace(/\u00a0/g, ' ').trim();
        if (!token) { setMessage(els.loginMessage, 'Введіть ключ адміністратора.', 'error'); return; }
        state.token = token;
        els.loginButton.disabled = true;
        setMessage(els.loginMessage, 'Перевіряю підключення…');
        try {
            await loadData();
            els.loginScreen.classList.add('hidden');
            els.app.classList.remove('hidden');
            els.adminToken.value = '';
            setMessage(els.globalMessage, 'Підключено. Зміни перевіряються після кожного збереження.', 'success');
            if (state.sessions.length) selectSession(state.sessions[0].ID);
        } catch (error) {
            state.token = '';
            setMessage(els.loginMessage, error.message || 'Не вдалося увійти.', 'error');
        } finally {
            els.loginButton.disabled = false;
        }
    }

    function logout() {
        state.token = '';
        state.currentId = '';
        state.sessions = [];
        state.photos = [];
        state.bookings = [];
        els.app.classList.add('hidden');
        els.loginScreen.classList.remove('hidden');
        setMessage(els.globalMessage, '');
        setMessage(els.loginMessage, '');
        setConnection(false, 'Не підключено');
    }

    function findSession(id) {
        return state.sessions.find(function (item) { return String(item.ID) === String(id); }) || null;
    }

    function photosFor(sessionId) {
        return state.photos.filter(function (photo) { return String(photo['Session ID']) === String(sessionId); });
    }

    function renderAll() {
        renderSessions();
        renderPhotos();
        renderBookings();
        renderSiteContent();
        $('#dashboardSessionCount').textContent = String(state.sessions.length);
        $('#dashboardPhotoCount').textContent = String(state.photos.length);
        const newBookings = state.bookings.filter(function (booking) { return !booking.Status || booking.Status === 'Нова'; }).length;
        els.bookingBadge.textContent = String(newBookings);
        els.bookingBadge.classList.toggle('hidden', newBookings === 0);
    }

    function renderSessions() {
        const query = els.sessionSearch.value.trim().toLowerCase();
        const sessions = state.sessions.slice().sort(function (a, b) { return Number(a['Порядок'] || 0) - Number(b['Порядок'] || 0); });
        const filtered = sessions.filter(function (item) {
            return !query || [item['Назва UA'], item['Категорія'], item['Опис UA']].join(' ').toLowerCase().includes(query);
        });
        els.sessionCount.textContent = state.sessions.length + (state.sessions.length === 1 ? ' фотосесія' : ' фотосесій');
        els.sessionsList.replaceChildren();
        if (!filtered.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-list';
            empty.textContent = state.sessions.length ? 'Нічого не знайдено.' : 'Фотосесій ще немає. Створіть першу.';
            els.sessionsList.appendChild(empty);
            return;
        }
        filtered.forEach(function (session) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'session-card' + (String(state.currentId) === String(session.ID) ? ' active' : '');
            card.innerHTML = '<span class="session-card-photo-count">' + photosFor(session.ID).length + '</span><span class="session-card-title">' + escapeHtml(session['Назва UA'] || 'Без назви') + '</span><span class="session-card-meta">' + escapeHtml(session['Категорія'] || 'Інше') + ' · ' + (String(session['Активна']).toLowerCase() === 'true' ? 'на сайті' : 'прихована') + '</span>';
            card.addEventListener('click', function () { selectSession(session.ID); });
            els.sessionsList.appendChild(card);
        });
    }

    function clearEditor() {
        ['titleUk','titleRu','titleEn','titleCz','descriptionUk','descriptionRu','descriptionEn','descriptionCz','slug','sessionIdDisplay'].forEach(function (id) { setValue(id, ''); });
        setValue('category', 'portrait');
        setValue('order', String(state.sessions.length + 1));
        setChecked('active', false);
        els.editorTitle.textContent = 'Нова фотосесія';
        setMessage(els.editorStatus, '');
        renderPhotos();
    }

    function selectSession(id) {
        const session = findSession(id);
        if (!session) return;
        state.currentId = session.ID;
        state.isNew = false;
        els.emptyState.classList.add('hidden');
        els.editor.classList.remove('hidden');
        setValue('sessionIdDisplay', session.ID);
        setValue('titleUk', session['Назва UA']);
        setValue('titleRu', session['Назва RU']);
        setValue('titleEn', session['Назва EN']);
        setValue('titleCz', session['Назва CZ']);
        setValue('descriptionUk', session['Опис UA']);
        setValue('descriptionRu', session['Опис RU']);
        setValue('descriptionEn', session['Опис EN']);
        setValue('descriptionCz', session['Опис CZ']);
        setValue('category', session['Категорія'] || 'other');
        setValue('slug', session.Slug || '');
        setValue('order', session['Порядок'] || 1);
        setChecked('active', session['Активна']);
        els.editorTitle.textContent = session['Назва UA'] || 'Фотосесія';
        setMessage(els.editorStatus, '');
        renderSessions();
        renderPhotos();
    }

    function newSession() {
        state.currentId = 'session-' + Date.now();
        state.isNew = true;
        els.emptyState.classList.add('hidden');
        els.editor.classList.remove('hidden');
        clearEditor();
        setValue('sessionIdDisplay', state.currentId);
        setChecked('active', false);
        renderSessions();
        setTimeout(function () { $('#titleUk').focus(); }, 0);
    }

    function sessionFromForm() {
        const title = getValue('titleUk');
        if (!title) throw new Error('Вкажіть назву фотосесії українською.');
        return {
            id: state.currentId || 'session-' + Date.now(),
            category: getValue('category') || 'other',
            slug: getValue('slug') || slugify(title),
            titleUk: title,
            titleRu: getValue('titleRu'), titleEn: getValue('titleEn'), titleCz: getValue('titleCz'),
            descriptionUk: getValue('descriptionUk'), descriptionRu: getValue('descriptionRu'),
            descriptionEn: getValue('descriptionEn'), descriptionCz: getValue('descriptionCz'),
            order: Number(getValue('order') || 1), active: checked('active'), cover: (findSession(state.currentId) || {})['Обкладинка'] || ''
        };
    }

    function apiSessionMatches(expected) {
        const row = findSession(expected.id);
        return Boolean(row && row['Назва UA'] === expected.titleUk && String(row['Активна']).toLowerCase() === String(expected.active));
    }

    async function saveSession() {
        const button = els.saveSession;
        button.disabled = true;
        try {
            const session = sessionFromForm();
            state.currentId = session.id;
            setMessage(els.editorStatus, 'Зберігаю у Google Sheets…');
            await postAdmin({ action: 'saveSession', session: session });
            await confirmRefresh(function () { return apiSessionMatches(session); });
            state.isNew = false;
            selectSession(session.id);
            setMessage(els.editorStatus, 'Збережено й перевірено у Google Sheets.', 'success');
        } catch (error) { setMessage(els.editorStatus, error.message || 'Не вдалося зберегти.', 'error'); }
        finally { button.disabled = false; }
    }

    async function deleteSession() {
        const session = findSession(state.currentId);
        if (!session || !window.confirm('Видалити фотосесію «' + (session['Назва UA'] || '') + '»? Пов’язані файли буде переміщено в кошик Google Drive.')) return;
        els.deleteSession.disabled = true;
        try {
            setMessage(els.editorStatus, 'Видаляю…');
            const id = state.currentId;
            await postAdmin({ action: 'deleteSession', sessionId: id });
            await confirmRefresh(function () { return !findSession(id); });
            state.currentId = '';
            state.isNew = false;
            els.editor.classList.add('hidden');
            els.emptyState.classList.remove('hidden');
            setMessage(els.globalMessage, 'Фотосесію видалено.', 'success');
        } catch (error) { setMessage(els.editorStatus, error.message || 'Не вдалося видалити.', 'error'); }
        finally { els.deleteSession.disabled = false; }
    }

    function readFileBase64(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () { resolve(String(reader.result).split(',')[1] || ''); };
            reader.onerror = function () { reject(new Error('Не вдалося прочитати файл ' + file.name + '.')); };
            reader.readAsDataURL(file);
        });
    }

    async function uploadPhotos(files) {
        if (!state.currentId || state.isNew || !findSession(state.currentId)) {
            setMessage(els.editorStatus, 'Спершу збережіть фотосесію.', 'error');
            els.photoInput.value = '';
            return;
        }
        const allowedTypes = ['image/jpeg','image/png','image/webp'];
        const valid = files.filter(function (file) { return allowedTypes.includes(file.type); });
        let uploaded = 0;
        const skipped = files.length - valid.length;
        const failures = [];
        for (let i = 0; i < valid.length; i += 1) {
            const file = valid[i];
            if (file.size > 5 * 1024 * 1024) {
                failures.push(file.name + ' завеликий (максимум 5 МБ)');
                continue;
            }
            const before = photosFor(state.currentId).length;
            try {
                setMessage(els.editorStatus, 'Завантажую фото ' + (i + 1) + ' із ' + valid.length + '…');
                const base64Data = await readFileBase64(file);
                await postAdmin({ action: 'uploadPhoto', sessionId: state.currentId, fileName: file.name, base64Data: base64Data, mimeType: file.type });
                await confirmRefresh(function () { return photosFor(state.currentId).length > before; });
                uploaded += 1;
            } catch (error) {
                failures.push(file.name + ': ' + (error.message || 'не вдалося завантажити'));
                break;
            }
        }
        els.photoInput.value = '';
        if (uploaded && !failures.length && !skipped) {
            setMessage(els.editorStatus, uploaded === 1 ? 'Фото збережено в Google Drive.' : 'Фото збережено в Google Drive: ' + uploaded + '.', 'success');
        } else if (uploaded || failures.length || skipped) {
            const summary = [];
            if (uploaded) summary.push('збережено: ' + uploaded);
            if (skipped) summary.push('пропущено невідомий формат: ' + skipped);
            if (failures.length) summary.push(failures.join('; '));
            setMessage(els.editorStatus, summary.join('. '), 'error');
        }
        renderPhotos();
    }

    function renderPhotos() {
        if (!els.photosList) return;
        if (!state.currentId || state.isNew) {
            els.photosList.innerHTML = '<p class="empty-list">Спершу збережіть фотосесію.</p>';
            return;
        }
        const session = findSession(state.currentId);
        const photos = photosFor(state.currentId).sort(function (a, b) { return Number(a['Порядок'] || 0) - Number(b['Порядок'] || 0); });
        if (!photos.length) {
            els.photosList.innerHTML = '<p class="empty-list">У цій фотосесії ще немає фотографій.</p>';
            return;
        }
        const cover = String((session || {})['Обкладинка'] || '');
        els.photosList.replaceChildren();
        photos.forEach(function (photo) {
            const fileId = String(photo['File ID'] || '');
            const card = document.createElement('article');
            card.className = 'photo-card';
            const preview = document.createElement('div');
            preview.className = 'photo-preview';
            if (fileId) {
                const image = document.createElement('img');
                image.src = 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w600';
                image.alt = photo['Назва'] || 'Фото фотосесії';
                image.loading = 'lazy';
                preview.appendChild(image);
            }
            if (fileId && cover.includes(fileId)) {
                const tag = document.createElement('span'); tag.className = 'cover-badge'; tag.textContent = 'Обкладинка'; preview.appendChild(tag);
            }
            const body = document.createElement('div'); body.className = 'photo-body';
            const name = document.createElement('div'); name.className = 'photo-name'; name.textContent = photo['Назва'] || 'Фото';
            const actions = document.createElement('div'); actions.className = 'photo-actions';
            const coverButton = document.createElement('button'); coverButton.type = 'button'; coverButton.textContent = cover.includes(fileId) ? 'Обкладинка ✓' : 'Зробити обкладинкою'; coverButton.disabled = cover.includes(fileId);
            coverButton.addEventListener('click', function () { changeCover(state.currentId, fileId); });
            const deleteButton = document.createElement('button'); deleteButton.type = 'button'; deleteButton.textContent = 'Видалити';
            deleteButton.addEventListener('click', function () { deletePhoto(photo.ID); });
            actions.append(coverButton, deleteButton); body.append(name, actions); card.append(preview, body); els.photosList.appendChild(card);
        });
    }

    async function changeCover(sessionId, fileId) {
        try {
            setMessage(els.editorStatus, 'Змінюю обкладинку…');
            await postAdmin({ action: 'setCover', sessionId: sessionId, fileId: fileId });
            await confirmRefresh(function () { const row = findSession(sessionId); return row && String(row['Обкладинка'] || '').includes(fileId); });
            setMessage(els.editorStatus, 'Обкладинку змінено.', 'success');
        } catch (error) { setMessage(els.editorStatus, error.message || 'Не вдалося змінити обкладинку.', 'error'); }
    }

    async function deletePhoto(photoId) {
        if (!window.confirm('Видалити це фото з фотосесії? Файл буде переміщено в кошик Google Drive.')) return;
        try {
            setMessage(els.editorStatus, 'Видаляю фото…');
            await postAdmin({ action: 'deletePhoto', photoId: photoId });
            await confirmRefresh(function () { return !state.photos.some(function (photo) { return String(photo.ID) === String(photoId); }); });
            setMessage(els.editorStatus, 'Фото видалено.', 'success');
        } catch (error) { setMessage(els.editorStatus, error.message || 'Не вдалося видалити фото.', 'error'); }
    }

    function renderBookings() {
        els.bookingsList.replaceChildren();
        if (!state.bookings.length) {
            const empty = document.createElement('p'); empty.className = 'empty-list'; empty.textContent = 'Заявок поки немає.'; els.bookingsList.appendChild(empty); return;
        }
        state.bookings.slice().reverse().forEach(function (booking) {
            const card = document.createElement('article'); card.className = 'booking-card';
            const top = document.createElement('div'); top.className = 'booking-top';
            const name = document.createElement('span'); name.className = 'booking-name'; name.textContent = booking.Name || booking['Ім’я'] || 'Нова заявка';
            const status = document.createElement('span'); status.className = 'booking-status'; status.textContent = booking.Status || 'Нова';
            top.append(name, status);
            const contacts = document.createElement('div'); contacts.className = 'booking-contact';
            const phone = document.createElement('a'); phone.href = 'tel:' + String(booking.Phone || '').replace(/[^+\d]/g, ''); phone.textContent = booking.Phone || 'Телефон не вказано'; contacts.appendChild(phone);
            if (booking.Email) { const email = document.createElement('a'); email.href = 'mailto:' + booking.Email; email.textContent = booking.Email; contacts.appendChild(email); }
            const date = document.createElement('div'); date.className = 'booking-date'; date.textContent = formatDate(booking.CreatedAt || booking.Date || booking.Timestamp);
            const message = document.createElement('p'); message.className = 'booking-message'; message.textContent = booking.Message || booking['Повідомлення'] || '';
            card.append(top, contacts, date, message); els.bookingsList.appendChild(card);
        });
    }

    function formatDate(value) {
        if (!value) return '';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    }

    function renderSiteContent() {
        const translations = state.siteContent.translations || {};
        els.contentFields.innerHTML = SITE_FIELDS.map(function (field) {
            const key = field[0], label = field[1];
            return '<div class="cms-language-group"><h3>' + escapeHtml(label) + '</h3>' + LANGUAGES.map(function (lang) {
                const value = translations[lang] && translations[lang][key] || '';
                const long = /Text|contactText/i.test(key);
                return '<div class="cms-field"><label for="copy-' + key + '-' + lang + '">' + escapeHtml(lang.toUpperCase()) + ' <span>' + escapeHtml(label) + '</span></label>' + (long
                    ? '<textarea id="copy-' + key + '-' + lang + '" data-copy-key="' + key + '" data-copy-lang="' + lang + '" rows="2">' + escapeHtml(value) + '</textarea>'
                    : '<input id="copy-' + key + '-' + lang + '" data-copy-key="' + key + '" data-copy-lang="' + lang + '" value="' + escapeHtml(value) + '">') + '</div>';
            }).join('') + '</div>';
        }).join('');
        setValue('heroImageUrl', state.siteContent.media && state.siteContent.media.heroUrl);
        setValue('aboutImageUrl', state.siteContent.media && state.siteContent.media.aboutUrl);
        setValue('siteTitle', state.siteContent.seo && state.siteContent.seo.title);
        const social = state.siteContent.social || [];
        const nelli = social.find(function (item) { return item.id === 'nelli'; });
        const support = social.find(function (item) { return item.id === 'support'; });
        setValue('nelliInstagram', nelli && nelli.url);
        setValue('supportInstagram', support && support.url);
    }

    function normalizeDriveUrl(value) {
        const text = String(value || '').trim();
        if (!text || /^https?:\/\//i.test(text) || text.indexOf('assets/') === 0 || text.charAt(0) === '#') return text;
        const match = text.match(/[-\w]{20,}/);
        return match ? 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(match[0]) : text;
    }

    function collectSiteContent(publish) {
        const content = mergeContent(state.siteContent);
        LANGUAGES.forEach(function (lang) {
            content.translations[lang] = Object.assign({}, content.translations[lang] || {});
        });
        $$('[data-copy-key]').forEach(function (input) {
            content.translations[input.getAttribute('data-copy-lang')][input.getAttribute('data-copy-key')] = input.value.trim();
        });
        content.media.heroUrl = normalizeDriveUrl(getValue('heroImageUrl'));
        content.media.aboutUrl = normalizeDriveUrl(getValue('aboutImageUrl'));
        content.seo = Object.assign({}, content.seo || {}, { title: getValue('siteTitle') || 'Nelli Photography' });
        content.social = (content.social || []).map(function (item) {
            if (item.id === 'nelli') item.url = getValue('nelliInstagram') || item.url;
            if (item.id === 'support') item.url = getValue('supportInstagram') || item.url;
            return item;
        });
        content.published = Boolean(publish);
        content.version = Number(content.version || 0) + 1;
        return content;
    }

    async function saveSiteContent(publish) {
        const button = publish ? els.publish : els.saveDraft;
        button.disabled = true;
        const content = collectSiteContent(publish);
        setMessage(els.contentStatus, publish ? 'Публікую…' : 'Зберігаю чернетку…');
        try {
            await postAdmin({ action: publish ? 'publishSiteContent' : 'saveSiteContent', content: content });
            await confirmRefresh(function () {
                return Number(state.siteContent.version || 0) >= content.version && Boolean(state.siteContent.published) === Boolean(publish);
            });
            setMessage(els.contentStatus, publish ? 'Зміни опубліковано й перевірено.' : 'Чернетку збережено й перевірено.', 'success');
        } catch (error) { setMessage(els.contentStatus, error.message || 'Не вдалося зберегти зміни.', 'error'); }
        finally { button.disabled = false; }
    }

    function slugify(value) {
        return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photoshoot';
    }

    function switchView(name) {
        const views = { sessions: els.sessionsView, site: els.siteView, bookings: els.bookingsView };
        Object.keys(views).forEach(function (key) { views[key].classList.toggle('hidden', key !== name); });
        $$('[data-view]').forEach(function (button) { button.classList.toggle('active', button.getAttribute('data-view') === name); });
        els.newSession.classList.toggle('hidden', name !== 'sessions');
        els.pageTitle.textContent = name === 'site' ? 'Тексти сайту' : name === 'bookings' ? 'Заявки' : 'Фотосесії';
    }

    els.loginForm.addEventListener('submit', login);
    els.logout.addEventListener('click', logout);
    els.refresh.addEventListener('click', async function () {
        els.refresh.disabled = true;
        try { await loadData(); setMessage(els.globalMessage, 'Дані оновлено.', 'success'); }
        catch (error) { setConnection(false, 'Помилка підключення'); setMessage(els.globalMessage, error.message, 'error'); }
        finally { els.refresh.disabled = false; }
    });
    els.sessionSearch.addEventListener('input', renderSessions);
    els.newSession.addEventListener('click', newSession);
    $('#emptyCreateButton').addEventListener('click', newSession);
    els.saveSession.addEventListener('click', saveSession);
    els.deleteSession.addEventListener('click', deleteSession);
    els.photoInput.addEventListener('change', function () { uploadPhotos(Array.from(els.photoInput.files || [])); });
    els.saveDraft.addEventListener('click', function () { saveSiteContent(false); });
    els.publish.addEventListener('click', function () { saveSiteContent(true); });
    $$('[data-view]').forEach(function (button) { button.addEventListener('click', function () { switchView(button.getAttribute('data-view')); }); });
    setConnection(false, 'Не підключено');
    if (!API_URL || API_URL.indexOf('PASTE_YOUR_') >= 0) setMessage(els.loginMessage, 'Потрібно під’єднати Google Apps Script: див. SETUP.md після завантаження сайту.', 'error');
}());
