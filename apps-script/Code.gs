/*
 * Nelli Photography — temporary Google Drive backend.
 * Sheets are the database; uploaded images stay in a Drive folder.
 * Deploy this file as a Google Apps Script Web App. See SETUP.md.
 */

const NELLI_TABLES = {
  Sessions: ['ID', 'Назва UA', 'Назва RU', 'Назва EN', 'Назва CZ', 'Категорія', 'Slug', 'Опис UA', 'Опис RU', 'Опис EN', 'Опис CZ', 'Порядок', 'Активна', 'Обкладинка'],
  Photos: ['ID', 'Session ID', 'Назва', 'Порядок', 'File ID', 'CreatedAt'],
  Requests: ['ID', 'CreatedAt', 'Name', 'Phone', 'Email', 'Message', 'Status'],
  SiteContent: ['ID', 'Version', 'Published', 'ContentJSON', 'UpdatedAt']
};

/** Run once from the script editor. Creates Drive storage only when IDs aren't configured. */
function setupNelliDrive() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('SPREADSHEET_ID');
  let folderId = props.getProperty('PHOTO_FOLDER_ID');

  if (spreadsheetId) SpreadsheetApp.openById(spreadsheetId);
  else {
    const spreadsheet = SpreadsheetApp.create('Nelli Photography — база даних');
    spreadsheetId = spreadsheet.getId();
    props.setProperty('SPREADSHEET_ID', spreadsheetId);
  }

  if (folderId) DriveApp.getFolderById(folderId);
  else {
    const folder = DriveApp.createFolder('Nelli Photography — фото сайту');
    folderId = folder.getId();
    props.setProperty('PHOTO_FOLDER_ID', folderId);
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const firstSheet = spreadsheet.getSheets()[0];
  if (!spreadsheet.getSheetByName('Sessions') && firstSheet && firstSheet.getName() === 'Sheet1' && firstSheet.getLastRow() === 0) {
    firstSheet.setName('Sessions');
  }

  Object.keys(NELLI_TABLES).forEach(function (name) {
    ensureTable_(name);
  });

  let token = props.getProperty('ADMIN_TOKEN');
  if (!token) {
    token = Utilities.getUuid() + '-' + Utilities.getUuid();
    props.setProperty('ADMIN_TOKEN', token);
  }

  Logger.log('Nelli setup complete. Copy the admin key below and keep it private:');
  Logger.log(token);
  Logger.log('Spreadsheet: https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit');
  Logger.log('Photo folder: https://drive.google.com/drive/folders/' + folderId);
  return 'Storage is ready. Copy the admin key from the execution log.';
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || '');
    let result;
    if (action === 'publicData') result = publicData_();
    else if (action === 'bookingStatus') result = bookingStatus_(params.id);
    else if (action === 'adminData') {
      requireAdmin_(params.token);
      result = adminData_();
    } else result = { success: false, error: 'Невідома дія.' };
    return respond_(result, params.callback);
  } catch (error) {
    return respond_({ success: false, error: safeError_(error) }, e && e.parameter && e.parameter.callback);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error('Порожній запит.');
    const payload = JSON.parse(raw);
    const action = String(payload.action || 'createBooking');
    if (action !== 'createBooking') requireAdmin_(payload.token);

    if (!lock.tryLock(10000)) throw new Error('Сховище зайняте. Спробуйте ще раз.');
    let result;
    switch (action) {
      case 'createBooking': result = createBooking_(payload); break;
      case 'saveSession': result = saveSession_(payload.session || {}); break;
      case 'deleteSession': result = deleteSession_(payload.sessionId); break;
      case 'uploadPhoto': result = uploadPhoto_(payload); break;
      case 'deletePhoto': result = deletePhoto_(payload.photoId); break;
      case 'setCover': result = setCover_(payload.sessionId, payload.fileId); break;
      case 'saveSiteContent': result = saveSiteContent_(payload.content || {}, false); break;
      case 'publishSiteContent': result = saveSiteContent_(payload.content || {}, true); break;
      default: throw new Error('Невідома дія.');
    }
    return respond_(Object.assign({ success: true }, result || {}));
  } catch (error) {
    return respond_({ success: false, error: safeError_(error) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function publicData_() {
  const sessions = rows_('Sessions');
  const photos = rows_('Photos');
  const published = publishedContent_();
  const visibleSessions = sessions.filter(function (session) { return isVisible_(session['Активна']); });
  const visibleIds = visibleSessions.map(function (session) { return String(session.ID); });
  const visiblePhotos = photos.filter(function (photo) { return visibleIds.indexOf(String(photo['Session ID'])) >= 0; });
  if (!published) return { success: true, sessions: visibleSessions, photos: visiblePhotos };
  const content = published.content;
  content.portfolio = portfolio_(visibleSessions, visiblePhotos);
  return { success: true, siteContent: content };
}

function adminData_() {
  const content = latestContent_();
  return {
    success: true,
    sessions: rows_('Sessions'),
    photos: rows_('Photos'),
    bookings: rows_('Requests').slice(-200),
    siteContent: content ? content.content : null
  };
}

function bookingStatus_(id) {
  const key = String(id || '');
  if (!/^[\w-]{12,80}$/.test(key)) throw new Error('Неправильний номер заявки.');
  const request = rows_('Requests').find(function (row) { return String(row.ID) === key; });
  return { success: true, received: Boolean(request), status: request ? request.Status : '' };
}

function createBooking_(payload) {
  const name = cleanText_(payload.full_name || payload.name, 120);
  const phone = cleanText_(payload.phone, 60);
  const email = cleanText_(payload.email, 160);
  const message = cleanText_(payload.message, 3000);
  if (!name || !phone) throw new Error('Вкажіть ім’я та номер телефону.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Перевірте адресу електронної пошти.');
  let id = cleanText_(payload.requestId, 80);
  if (!/^[\w-]{12,80}$/.test(id)) id = Utilities.getUuid();
  if (rows_('Requests').some(function (row) { return String(row.ID) === id; })) return { requestId: id };
  appendRow_('Requests', { ID: id, CreatedAt: new Date(), Name: name, Phone: phone, Email: email, Message: message, Status: 'Нова' });
  return { requestId: id };
}

function saveSession_(input) {
  const id = cleanText_(input.id || input.ID, 100) || ('session-' + Utilities.getUuid());
  const title = cleanText_(input.titleUk || input['Назва UA'], 160);
  if (!title) throw new Error('Вкажіть назву фотосесії.');
  upsertRow_('Sessions', {
    ID: id,
    'Назва UA': title,
    'Назва RU': cleanText_(input.titleRu || input['Назва RU'], 160),
    'Назва EN': cleanText_(input.titleEn || input['Назва EN'], 160),
    'Назва CZ': cleanText_(input.titleCz || input['Назва CZ'], 160),
    'Категорія': cleanText_(input.category || input['Категорія'], 60) || 'other',
    Slug: cleanText_(input.slug || input.Slug, 160),
    'Опис UA': cleanText_(input.descriptionUk || input['Опис UA'], 1000),
    'Опис RU': cleanText_(input.descriptionRu || input['Опис RU'], 1000),
    'Опис EN': cleanText_(input.descriptionEn || input['Опис EN'], 1000),
    'Опис CZ': cleanText_(input.descriptionCz || input['Опис CZ'], 1000),
    'Порядок': Math.max(1, Number(input.order || input['Порядок'] || 1)),
    'Активна': input.active === true || String(input.active || input['Активна']).toLowerCase() === 'true',
    'Обкладинка': cleanText_(input.cover || input['Обкладинка'], 200)
  });
  syncSessionPhotoVisibility_(id, input.active === true || String(input.active || input['Активна']).toLowerCase() === 'true');
  return { id: id };
}

function deleteSession_(sessionId) {
  const id = String(sessionId || '');
  if (!id) throw new Error('Не вказано фотосесію.');
  const photos = rows_('Photos').filter(function (row) { return String(row['Session ID']) === id; });
  photos.forEach(function (photo) { trashFile_(photo['File ID']); });
  deleteRowsBy_('Photos', 'Session ID', id);
  deleteRowsBy_('Sessions', 'ID', id);
  return {};
}

function uploadPhoto_(payload) {
  const sessionId = String(payload.sessionId || '');
  if (!rows_('Sessions').some(function (row) { return String(row.ID) === sessionId; })) throw new Error('Спершу збережіть фотосесію.');
  const mime = String(payload.mimeType || '').toLowerCase();
  if (['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) < 0) throw new Error('Підтримуються лише JPG, PNG та WebP.');
  const encoded = String(payload.base64Data || '');
  if (!encoded || encoded.length > 7 * 1024 * 1024) throw new Error('Фото порожнє або завелике. Максимум 5 МБ.');
  const bytes = Utilities.base64Decode(encoded);
  if (bytes.length > 5 * 1024 * 1024) throw new Error('Максимальний розмір фото — 5 МБ.');
  const name = cleanFileName_(payload.fileName || 'photo');
  const folder = DriveApp.getFolderById(requiredProperty_('PHOTO_FOLDER_ID'));
  const blob = Utilities.newBlob(bytes, mime, name);
  const file = folder.createFile(blob);
  // Only photos in sessions explicitly marked visible are public on the website.
  const session = rows_('Sessions').find(function (row) { return String(row.ID) === sessionId; });
  if (session && (session['Активна'] === true || String(session['Активна']).toLowerCase() === 'true')) {
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (error) {
      file.setTrashed(true);
      throw new Error('Google Drive не дозволив публічне посилання для фото. Перевірте політики доступу Drive.');
    }
  }
  const existing = rows_('Photos').filter(function (row) { return String(row['Session ID']) === sessionId; });
  const id = Utilities.getUuid();
  appendRow_('Photos', { ID: id, 'Session ID': sessionId, 'Назва': name, 'Порядок': existing.length + 1, 'File ID': file.getId(), CreatedAt: new Date() });
  return { id: id };
}

function deletePhoto_(photoId) {
  const id = String(photoId || '');
  const photo = rows_('Photos').find(function (row) { return String(row.ID) === id; });
  if (!photo) throw new Error('Фото не знайдено.');
  trashFile_(photo['File ID']);
  deleteRowsBy_('Photos', 'ID', id);
  const session = rows_('Sessions').find(function (row) { return String(row.ID) === String(photo['Session ID']); });
  if (session && String(session['Обкладинка'] || '') === String(photo['File ID'])) upsertRow_('Sessions', Object.assign({}, session, { 'Обкладинка': '' }));
  return {};
}

function setCover_(sessionId, fileId) {
  const session = rows_('Sessions').find(function (row) { return String(row.ID) === String(sessionId || ''); });
  if (!session) throw new Error('Фотосесію не знайдено.');
  const exists = rows_('Photos').some(function (row) { return String(row['Session ID']) === String(sessionId) && String(row['File ID']) === String(fileId); });
  if (!exists) throw new Error('Це фото не належить обраній фотосесії.');
  upsertRow_('Sessions', Object.assign({}, session, { 'Обкладинка': String(fileId) }));
  return {};
}

function saveSiteContent_(content, publish) {
  if (!content || typeof content !== 'object') throw new Error('Неправильний формат контенту.');
  const version = Number(content.version || 1);
  appendRow_('SiteContent', { ID: Utilities.getUuid(), Version: version, Published: Boolean(publish), ContentJSON: JSON.stringify(content), UpdatedAt: new Date() });
  return { version: version, published: Boolean(publish) };
}

function portfolio_(sessions, photos) {
  const visible = sessions.filter(function (session) { return isVisible_(session['Активна']); });
  const items = [];
  visible.forEach(function (session) {
    const matching = photos.filter(function (photo) { return String(photo['Session ID']) === String(session.ID); });
    matching.forEach(function (photo, index) {
      const id = String(photo['File ID'] || '');
      if (!id) return;
      const title = {
        uk: session['Назва UA'] || photo['Назва'] || '',
        ru: session['Назва RU'] || session['Назва UA'] || photo['Назва'] || '',
        en: session['Назва EN'] || session['Назва UA'] || photo['Назва'] || '',
        cz: session['Назва CZ'] || session['Назва UA'] || photo['Назва'] || ''
      };
      items.push({
        id: photo.ID,
        imageUrl: 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(id),
        fileId: id,
        title: title,
        category: categoryLabel_(session['Категорія']),
        alt: title,
        order: Number(session['Порядок'] || 0) * 1000 + (String(session['Обкладинка'] || '') === id ? 0 : Number(photo['Порядок'] || index + 1)),
        sessionId: String(session.ID),
        published: true,
        cover: String(session['Обкладинка'] || '') === id
      });
    });
  });
  return items.sort(function (a, b) {
    return Number(a.order || 0) - Number(b.order || 0) || String(a.sessionId).localeCompare(String(b.sessionId));
  });
}

function categoryLabel_(key) {
  const labels = { wedding: { uk: 'Весілля', ru: 'Свадьба', en: 'Wedding', cz: 'Svatba' }, love: { uk: 'Історія кохання', ru: 'История любви', en: 'Love story', cz: 'Příběh lásky' }, portrait: { uk: 'Портрет', ru: 'Портрет', en: 'Portrait', cz: 'Portrét' }, couple: { uk: 'Пара', ru: 'Пара', en: 'Couple', cz: 'Pár' }, other: { uk: 'Інше', ru: 'Другое', en: 'Other', cz: 'Ostatní' } };
  return labels[String(key || 'other')] || labels.other;
}

function isVisible_(value) {
  return value === true || String(value).toLowerCase() === 'true';
}

function latestContent_() {
  const rows = rows_('SiteContent');
  if (!rows.length) return null;
  const row = rows[rows.length - 1];
  return { version: Number(row.Version || 1), published: row.Published === true || String(row.Published).toLowerCase() === 'true', content: parseContent_(row.ContentJSON) };
}

function publishedContent_() {
  const rows = rows_('SiteContent').filter(function (row) { return row.Published === true || String(row.Published).toLowerCase() === 'true'; });
  if (!rows.length) return null;
  const row = rows[rows.length - 1];
  return { version: Number(row.Version || 1), published: true, content: parseContent_(row.ContentJSON) };
}

function parseContent_(value) {
  try { return JSON.parse(String(value || '{}')); } catch (_) { return {}; }
}

function requireAdmin_(token) {
  const expected = requiredProperty_('ADMIN_TOKEN');
  if (!token || !constantTimeEquals_(String(token), expected)) throw new Error('Ключ адміністратора неправильний.');
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function respond_(data, callback) {
  const json = JSON.stringify(data);
  if (callback && /^[$A-Z_a-z][$\w]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function spreadsheet_() {
  return SpreadsheetApp.openById(requiredProperty_('SPREADSHEET_ID'));
}

function requiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error('Не налаштовано властивість ' + name + '. Запустіть setupNelliDrive().');
  return value;
}

function ensureTable_(name) {
  const ss = spreadsheet_();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const headers = NELLI_TABLES[name];
  const current = sheet.getLastRow() ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getDisplayValues()[0] : [];
  if (!current.length || current.every(function (cell) { return !cell; })) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else if (headers.some(function (header) { return current.indexOf(header) < 0; })) {
    throw new Error('Аркуш «' + name + '» уже має інші заголовки. Створіть окрему таблицю або підготуйте сумісні стовпці.');
  }
}

function rows_(name) {
  ensureTable_(name);
  const sheet = spreadsheet_().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(function (row) { return row.some(function (value) { return value !== '' && value != null; }); }).map(function (row) {
    return headers.reduce(function (result, header, index) { result[header] = row[index]; return result; }, {});
  });
}

function appendRow_(name, object) {
  ensureTable_(name);
  const sheet = spreadsheet_().getSheetByName(name);
  const headers = NELLI_TABLES[name];
  sheet.appendRow(headers.map(function (header) { return object[header] == null ? '' : object[header]; }));
}

function upsertRow_(name, object) {
  ensureTable_(name);
  const sheet = spreadsheet_().getSheetByName(name);
  const headers = NELLI_TABLES[name];
  const idIndex = headers.indexOf('ID');
  if (idIndex < 0 || !object.ID) throw new Error('Не вказано ID для збереження.');
  const last = sheet.getLastRow();
  if (last >= 2) {
    const ids = sheet.getRange(2, idIndex + 1, last - 1, 1).getDisplayValues();
    const index = ids.findIndex(function (row) { return String(row[0]) === String(object.ID); });
    if (index >= 0) {
      const rowNumber = index + 2;
      const old = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
      const merged = headers.map(function (header, column) { return object[header] == null ? old[column] : object[header]; });
      sheet.getRange(rowNumber, 1, 1, headers.length).setValues([merged]);
      return;
    }
  }
  appendRow_(name, object);
}

function deleteRowsBy_(name, header, value) {
  ensureTable_(name);
  const sheet = spreadsheet_().getSheetByName(name);
  const headers = NELLI_TABLES[name];
  const column = headers.indexOf(header) + 1;
  if (!column || sheet.getLastRow() < 2) return;
  const values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getDisplayValues();
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (String(values[index][0]) === String(value)) sheet.deleteRow(index + 2);
  }
}

function trashFile_(id) {
  if (!id) return;
  try { DriveApp.getFileById(String(id)).setTrashed(true); } catch (_) {}
}

function syncSessionPhotoVisibility_(sessionId, visible) {
  rows_('Photos').filter(function (row) { return String(row['Session ID']) === String(sessionId); }).forEach(function (row) {
    if (!row['File ID']) return;
    try {
      DriveApp.getFileById(String(row['File ID'])).setSharing(
        visible ? DriveApp.Access.ANYONE_WITH_LINK : DriveApp.Access.PRIVATE,
        DriveApp.Permission.VIEW
      );
    } catch (error) {
      if (visible) throw new Error('Не вдалося зробити фото доступними для сайту. Перевірте налаштування доступу Google Drive.');
    }
  });
}

function cleanText_(value, max) {
  const text = String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function cleanFileName_(value) {
  const name = cleanText_(value, 180).replace(/[\\/:*?"<>|]/g, '-');
  return name || 'photo';
}

function safeError_(error) {
  return cleanText_(error && error.message ? error.message : 'Невідома помилка.', 300);
}
