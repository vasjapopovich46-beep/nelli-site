const API_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

const ADMIN_PASSWORD = "Paparazzi";


const state = {

    token: "",

    sessions: [],

    photos: [],

    siteContent: window.NelliContentModel
        ? window.NelliContentModel.emptyContent()
        : null,

    currentId: null,

    isNew: false

};


/* =========================================================
   ELEMENTS
========================================================= */

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const adminToken = document.getElementById("adminToken");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const globalMessage = document.getElementById("globalMessage");
const logoutButton = document.getElementById("logoutButton");
const sessionsList = document.getElementById("sessionsList");
const sessionSearch = document.getElementById("sessionSearch");
const sessionCount = document.getElementById("sessionCount");
const newSessionButton = document.getElementById("newSessionButton");
const emptyCreateButton = document.getElementById("emptyCreateButton");
const emptyState = document.getElementById("emptyState");
const editor = document.getElementById("editor");
const editorTitle = document.getElementById("editorTitle");
const editorStatus =
    document.getElementById("editorStatus");

const saveSessionButton =
    document.getElementById("saveSessionButton");

const deleteSessionButton =
    document.getElementById("deleteSessionButton");

const photoInput =
    document.getElementById("photoInput");

const photosList =
    document.getElementById("photosList");


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        login();

    }
);


function login() {

    const entered =
        adminToken.value
            .replace(/\u00a0/g, " ")
            .trim();


    if (!entered) {

        setMessage(
            loginMessage,
            "Введіть ключ."
        );

        return;

    }


    loginButton.disabled =
        true;


    setMessage(
        loginMessage,
        "Перевіряємо..."
    );

    if (entered !== ADMIN_PASSWORD) {
        loginButton.disabled = false;
        setMessage(loginMessage, "Неправильний пароль.");
        return;
    }

    state.token =
        entered;


    setMessage(
        loginMessage,
        ""
    );


    setMessage(
        globalMessage,
        "Пароль прийнято. Підключення до API..."
    );


    /*
     * Тепер окремо перевіряємо API.
     */

    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
    setMessage(globalMessage, "Dashboard відкрито. " + "API перевіряється...");
    loadData().then(function () {
        setMessage(globalMessage, "API підключено ✓");
    }).catch(function (error) {
        setMessage(globalMessage, "API недоступний: " + (error.message || "дані не завантажено"));
    });

}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    function () {
        state.token = "";
        state.currentId = null;
        app.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        adminToken.value = "";
        loginButton.disabled = false;
        setMessage(loginMessage, "");
        setMessage(globalMessage, "");

    }
);


/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const callbackName =
                "__nelliMobileAPI_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .slice(2);


            const script =
                document.createElement(
                    "script"
                );


            let finished =
                false;


            const timeout =
                setTimeout(
                    function () {

                        if (finished) {
                            return;
                        }


                        finished =
                            true;


                        cleanup();


                        reject(
                            new Error(
                                "API не відповідає протягом 15 секунд."
                            )
                        );

                    },
                    15000
                );


            function cleanup() {

                clearTimeout(
                    timeout
                );


                try {

                    delete window[
                        callbackName
                    ];

                } catch (error) {}


                if (
                    script.parentNode
                ) {

                    script.parentNode.removeChild(
                        script
                    );

                }

            }


            window[callbackName] =
                function (data) {

                    if (finished) {
                        return;
                    }


                    finished =
                        true;


                    cleanup();


                    if (
                        data &&
                        data.success === true
                    ) {

                        state.sessions =
                            Array.isArray(
                                data.sessions
                            )
                                ? data.sessions
                                : [];


                        state.photos =
                            Array.isArray(
                                data.photos
                            )
                                ? data.photos
                                : [];

                        if (window.NelliContentModel) {
                            state.siteContent = window.NelliContentModel.mergeContent(
                                data.siteContent || data.content || state.siteContent
                            );
                        }


                        renderSessions();
                            updateDashboard();
                        renderContentEditor();


                        if (
                            state.currentId &&
                            findSession(
                                state.currentId
                            )
                        ) {

                            selectSession(
                                state.currentId
                            );

                        }

                        else if (
                            state.sessions.length
                        ) {

                            selectSession(
                                state.sessions[0].ID
                            );

                        }

                        else {

                            showEmpty();

                        }


                        resolve(
                            data
                        );

                    }

                    else {

                        reject(
                            new Error(
                                (
                                    data &&
                                    data.error
                                ) ||
                                "API повернув помилку."
                            )
                        );

                    }

                };


            const params =
                new URLSearchParams({

                    action:
                        "adminData",

                    token:
                        state.token,

                    callback:
                        callbackName,

                    _: String(
                        Date.now()
                    )

                });


            script.async =
                true;


            script.src =
                API_URL +
                "?" +
                params.toString();


            script.onerror =
                function () {

                    if (finished) {
                        return;
                    }


                    finished =
                        true;


                    cleanup();


                    reject(
                        new Error(
                            "Браузер не зміг завантажити відповідь Google Apps Script."
                        )
                    );

                };


            document.body.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   SESSIONS
========================================================= */

function renderSessions() {

    const search =
        sessionSearch
            .value
            .trim()
            .toLowerCase();


    const sessions =
        state.sessions
            .slice()
            .sort(
                function (a, b) {

                    return (
                        Number(
                            a["Порядок"] || 0
                        ) -
                        Number(
                            b["Порядок"] || 0
                        )
                    );

                }
            );


    const filtered =
        sessions.filter(
            function (session) {

                const title =
                    String(
                        session["Назва UA"] || ""
                    ).toLowerCase();


                const category =
                    String(
                        session["Категорія"] || ""
                    ).toLowerCase();


                return (
                    !search ||
                    title.includes(search) ||
                    category.includes(search)
                );

            }
        );


    sessionCount.textContent =
        state.sessions.length +
        (
            state.sessions.length === 1
                ? " фотосесія"
                : " фотосесій"
        );


    sessionsList.innerHTML =
        "";


    if (!filtered.length) {

        sessionsList.innerHTML =
            `
            <div style="
                padding:25px 5px;
                color:#666;
                font-size:10px;
            ">
                Нічого не знайдено.
            </div>
            `;

        return;

    }


    filtered.forEach(
        function (session) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "session-card";


            if (
                String(
                    state.currentId
                ) ===
                String(
                    session.ID
                )
            ) {

                card.classList.add(
                    "active"
                );

            }


            const active =
                String(
                    session["Активна"]
                ).toLowerCase() ===
                "true";


            const count =
                countPhotos(
                    session.ID
                );


            card.innerHTML = `

                <div class="session-card-photo-count">
                    ${count}
                </div>

                <div class="session-card-title">
                    ${escapeHtml(
                        session["Назва UA"] ||
                        "Без назви"
                    )}
                </div>

                <div class="session-card-meta">
                    ${escapeHtml(
                        session["Категорія"] ||
                        "other"
                    )}
                    ·
                    ${
                        active
                            ? "на сайті"
                            : "прихована"
                    }
                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    selectSession(
                        session.ID
                    );

                }
            );


            sessionsList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

sessionSearch.addEventListener(
    "input",
    renderSessions
);


/* =========================================================
   SELECT
========================================================= */

function selectSession(id) {

    const session =
        findSession(id);


    if (!session) {
        return;
    }


    state.currentId =
        session.ID;


    state.isNew =
        false;


    showEditor();


    setValue(
        "sessionIdDisplay",
        session.ID
    );


    setValue(
        "titleUk",
        session["Назва UA"]
    );


    setValue(
        "category",
        session["Категорія"] ||
        "other"
    );


    setValue(
        "slug",
        session["Slug"]
    );


    setValue(
        "descriptionUk",
        session["Опис UA"]
    );


    setValue(
        "titleRu",
        session["Назва RU"]
    );


    setValue(
        "descriptionRu",
        session["Опис RU"]
    );


    setValue(
        "titleEn",
        session["Назва EN"]
    );


    setValue(
        "descriptionEn",
        session["Опис EN"]
    );


    setValue(
        "titleCz",
        session["Назва CZ"]
    );


    setValue(
        "descriptionCz",
        session["Опис CZ"]
    );


    setValue(
        "order",
        session["Порядок"] ||
        1
    );


    setValue(
        "active",
        String(
            session["Активна"]
        ).toLowerCase() ===
        "true"
            ? "true"
            : "false"
    );


    editorTitle.textContent =
        session["Назва UA"] ||
        "Фотосесія";


    setMessage(
        editorStatus,
        ""
    );


    renderSessions();

    renderPhotos();

}


/* =========================================================
   NEW SESSION
========================================================= */

newSessionButton.addEventListener(
    "click",
    createNewSession
);


emptyCreateButton.addEventListener(
    "click",
    createNewSession
);


function createNewSession() {

    const id =
        "session-" +
        Date.now();


    state.currentId =
        id;


    state.isNew =
        true;


    showEditor();


    clearEditor();


    setValue(
        "sessionIdDisplay",
        id
    );


    setValue(
        "category",
        "other"
    );


    setValue(
        "order",
        state.sessions.length + 1
    );


    setValue(
        "active",
        "true"
    );


    editorTitle.textContent =
        "Нова фотосесія";


    photosList.innerHTML =
        `
        <div class="photos-empty">
            Спочатку збережіть фотосесію,
            потім додайте фотографії.
        </div>
        `;


    setMessage(
        editorStatus,
        "Нова фотосесія"
    );


    document
        .getElementById(
            "titleUk"
        )
        .focus();

}


/* =========================================================
   SAVE SESSION
========================================================= */

saveSessionButton.addEventListener(
    "click",
    saveCurrentSession
);


function saveCurrentSession() {

    const id =
        getValue(
            "sessionIdDisplay"
        ) ||
        "session-" +
        Date.now();


    const titleUk =
        getValue(
            "titleUk"
        );


    if (!titleUk) {

        setMessage(
            editorStatus,
            "Введіть назву фотосесії."
        );

        return;

    }


    const session = {

        id:
            id,

        category:
            getValue(
                "category"
            ) || "other",

        slug:
            getValue(
                "slug"
            ) ||
            slugify(
                titleUk
            ),

        titleUk:
            titleUk,

        titleRu:
            getValue(
                "titleRu"
            ),

        titleEn:
            getValue(
                "titleEn"
            ),

        titleCz:
            getValue(
                "titleCz"
            ),

        descriptionUk:
            getValue(
                "descriptionUk"
            ),

        descriptionRu:
            getValue(
                "descriptionRu"
            ),

        descriptionEn:
            getValue(
                "descriptionEn"
            ),

        descriptionCz:
            getValue(
                "descriptionCz"
            ),

        order:
            Number(
                getValue(
                    "order"
                ) || 0
            ),

        active:
            getValue(
                "active"
            ) ===
            "true",

        cover:
            getCurrentCover()

    };


    state.currentId =
        id;


    setMessage(
        editorStatus,
        "Зберігаємо..."
    );


    postAdmin({

        action:
            "saveSession",

        session:
            session

    })

    .then(
        function () {

            return delay(
                800
            );

        }
    )

    .then(
        function () {

            return loadData();

        }
    )

    .then(
        function () {

            selectSession(
                id
            );


            setMessage(
                editorStatus,
                "Запит на збереження надіслано. Оновіть дані для підтвердження."
            );

        }
    )

    .catch(
        function (error) {

            setMessage(
                editorStatus,
                error.message ||
                "Помилка збереження."
            );

        }
    );

}


/* =========================================================
   DELETE SESSION
========================================================= */

deleteSessionButton.addEventListener(
    "click",
    function () {

        const id =
            state.currentId;


        if (!id) {
            return;
        }


        const session =
            findSession(
                id
            );


        const name =
            session
                ? session["Назва UA"]
                : "цю фотосесію";


        if (
            !confirm(
                "Видалити «" +
                name +
                "» та всі її фотографії?"
            )
        ) {

            return;

        }


        setMessage(
            editorStatus,
            "Видаляємо..."
        );


        postAdmin({

            action:
                "deleteSession",

            sessionId:
                id

        })

        .then(
            function () {

                state.currentId =
                    null;


                return delay(
                    700
                );

            }
        )

        .then(
            function () {

                return loadData();

            }
        )

        .then(
            function () {

                showEmpty();


                setMessage(
                    globalMessage,
                    "Запит на видалення надіслано. Оновіть дані для підтвердження."
                );

            }
        )

        .catch(
            function (error) {

                setMessage(
                    editorStatus,
                    error.message ||
                    "Помилка видалення."
                );

            }
        );

    }
);


/* =========================================================
   PHOTO UPLOAD
========================================================= */

photoInput.addEventListener(
    "change",
    function () {

        uploadPhotos(
            Array.from(
                photoInput.files
            )
        );

    }
);


async function uploadPhotos(files) {

    const sessionId =
        state.currentId;


    if (!sessionId) {

        alert(
            "Спочатку виберіть фотосесію."
        );


        photoInput.value =
            "";


        return;

    }


    if (state.isNew) {

        alert(
            "Спочатку збережіть фотосесію."
        );


        photoInput.value =
            "";


        return;

    }


    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        const file =
            files[i];


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            continue;

        }


        if (
            file.size >
            8 * 1024 * 1024
        ) {

            setMessage(
                editorStatus,
                file.name +
                " більший за 8 MB."
            );

            continue;

        }


        setMessage(
            editorStatus,
            "Фото " +
            (i + 1) +
            " / " +
            files.length
        );


        try {

            const base64 =
                await readFile(
                    file
                );


            await postAdmin({

                action:
                    "uploadPhoto",

                sessionId:
                    sessionId,

                fileName:
                    file.name,

                base64Data:
                    base64,

                mimeType:
                    file.type

            });

        }

        catch (error) {

            setMessage(
                editorStatus,
                error.message ||
                "Помилка завантаження."
            );

            return;

        }

    }


    photoInput.value =
        "";


    await delay(
        1000
    );


    await loadData();


    selectSession(
        sessionId
    );


    setMessage(
        editorStatus,
        "Запити на завантаження надіслано. Оновіть дані для підтвердження."
    );

}


/* =========================================================
   RENDER PHOTOS
========================================================= */

function renderPhotos() {

    if (!state.currentId) {

        photosList.innerHTML =
            `
            <div class="photos-empty">
                Виберіть фотосесію.
            </div>
            `;

        return;

    }


    const session =
        findSession(
            state.currentId
        );


    if (!session) {
        return;
    }


    const photos =
        state.photos

            .filter(
                function (photo) {

                    return (
                        String(
                            photo["Session ID"]
                        ) ===
                        String(
                            state.currentId
                        )
                    );

                }
            )

            .sort(
                function (a, b) {

                    return (
                        Number(
                            a["Порядок"] || 0
                        ) -
                        Number(
                            b["Порядок"] || 0
                        )
                    );

                }
            );


    if (!photos.length) {

        photosList.innerHTML =
            `
            <div class="photos-empty">
                У цій фотосесії ще немає фотографій.
            </div>
            `;

        return;

    }


    photosList.innerHTML =
        "";


    const cover =
        String(
            session["Обкладинка"] || ""
        );


    photos.forEach(
        function (photo) {

            const fileId =
                String(
                    photo["File ID"] || ""
                );


            const url =
                fileId

                    ? "https://drive.google.com/uc?export=view&id=" +
                      encodeURIComponent(
                          fileId
                      )

                    : "";


            const isCover =
                cover.includes(
                    fileId
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "photo-card";


            card.innerHTML = `

                <div class="photo-preview">

                    ${
                        url
                            ? `
                                <img
                                    src="${escapeHtml(url)}"
                                    alt=""
                                    loading="lazy"
                                >
                              `
                            : ""
                    }

                    ${
                        isCover
                            ? `
                                <div class="cover-badge">
                                    Обкладинка
                                </div>
                              `
                            : ""
                    }

                </div>


                <div class="photo-body">

                    <div class="photo-name">
                        ${escapeHtml(
                            photo["Назва"] ||
                            "Фото"
                        )}
                    </div>


                    <div class="photo-actions">

                        ${
                            !isCover
                                ? `
                                    <button
                                        type="button"
                                        data-cover
                                    >
                                        Обкладинка
                                    </button>
                                  `
                                : `
                                    <button
                                        type="button"
                                        disabled
                                    >
                                        Обкладинка
                                    </button>
                                  `
                        }

                        <button
                            type="button"
                            data-delete
                        >
                            Видалити
                        </button>

                    </div>

                </div>

            `;


            const coverButton =
                card.querySelector(
                    "[data-cover]"
                );


            if (coverButton) {

                coverButton.addEventListener(
                    "click",
                    function () {

                        setCover(
                            state.currentId,
                            fileId
                        );

                    }
                );

            }


            const deleteButton =
                card.querySelector(
                    "[data-delete]"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePhoto(
                            photo["ID"]
                        );

                    }
                );

            }


            photosList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   COVER
========================================================= */

function setCover(
    sessionId,
    fileId
) {

    setMessage(
        editorStatus,
        "Встановлюємо обкладинку..."
    );


    postAdmin({

        action:
            "setCover",

        sessionId:
            sessionId,

        fileId:
            fileId

    })

    .then(
        function () {

            return delay(
                600
            );

        }
    )

    .then(
        function () {

            return loadData();

        }
    )

    .then(
        function () {

            selectSession(
                sessionId
            );


            setMessage(
                editorStatus,
                "Запит на обкладинку надіслано. Оновіть дані для підтвердження."
            );

        }
    )

    .catch(
        function (error) {

            setMessage(
                editorStatus,
                error.message ||
                "Помилка."
            );

        }
    );

}


/* =========================================================
   DELETE PHOTO
========================================================= */

function deletePhoto(
    photoId
) {

    if (
        !confirm(
            "Видалити фотографію?"
        )
    ) {

        return;

    }


    setMessage(
        editorStatus,
        "Видаляємо фото..."
    );


    postAdmin({

        action:
            "deletePhoto",

        photoId:
            photoId

    })

    .then(
        function () {

            return delay(
                600
            );

        }
    )

    .then(
        function () {

            return loadData();

        }
    )

    .then(
        function () {

            selectSession(
                state.currentId
            );


            setMessage(
                editorStatus,
                "Запит на видалення фото надіслано. Оновіть дані для підтвердження."
            );

        }
    )

    .catch(
        function (error) {

            setMessage(
                editorStatus,
                error.message ||
                "Помилка."
            );

        }
    );

}


/* =========================================================
   POST
========================================================= */

function postAdmin(
    payload
) {

    return fetch(
        API_URL,
        {

            method:
                "POST",

            mode:
                "no-cors",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify({

                    admin:
                        true,

                    token:
                        state.token,

                    ...payload

                })

        }
    );

}


/* =========================================================
   HELPERS
========================================================= */

function findSession(
    id
) {

    return state.sessions.find(
        function (session) {

            return (
                String(
                    session.ID
                ) ===
                String(id)
            );

        }
    ) || null;

}


function countPhotos(
    sessionId
) {

    return state.photos.filter(
        function (photo) {

            return (
                String(
                    photo["Session ID"]
                ) ===
                String(sessionId)
            );

        }
    ).length;

}


function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value.trim()
        : "";

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ?? "";

    }

}


function clearEditor() {

    const ids = [

        "titleUk",
        "titleRu",
        "titleEn",
        "titleCz",

        "descriptionUk",
        "descriptionRu",
        "descriptionEn",
        "descriptionCz",

        "slug"

    ];


    ids.forEach(
        function (id) {

            setValue(
                id,
                ""
            );

        }
    );

}


function showEditor() {

    emptyState.classList.add(
        "hidden"
    );


    editor.classList.remove(
        "hidden"
    );

}


function showEmpty() {

    editor.classList.add(
        "hidden"
    );


    emptyState.classList.remove(
        "hidden"
    );


    renderSessions();

}


function getCurrentCover() {

    const session =
        state.currentId
            ? findSession(
                state.currentId
            )
            : null;


    return session
        ? session["Обкладинка"] || ""
        : "";

}


function slugify(
    text
) {

    const map = {

        "а": "a",
        "б": "b",
        "в": "v",
        "г": "h",
        "ґ": "g",
        "д": "d",
        "е": "e",
        "є": "ye",
        "ж": "zh",
        "з": "z",
        "и": "y",
        "і": "i",
        "ї": "yi",
        "й": "y",
        "к": "k",
        "л": "l",
        "м": "m",
        "н": "n",
        "о": "o",
        "п": "p",
        "р": "r",
        "с": "s",
        "т": "t",
        "у": "u",
        "ф": "f",
        "х": "kh",
        "ц": "ts",
        "ч": "ch",
        "ш": "sh",
        "щ": "shch",
        "ь": "",
        "ю": "yu",
        "я": "ya"

    };


    return String(
        text || ""
    )
        .toLowerCase()
        .split("")
        .map(
            function (char) {

                return (
                    map[char] ||
                    char
                );

            }
        )
        .join("")
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


function readFile(
    file
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const result =
                        String(
                            reader.result
                        );


                    resolve(
                        result.split(
                            ","
                        )[1] || ""
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Не вдалося прочитати файл."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


function delay(
    ms
) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


function setMessage(
    element,
    text
) {

    if (element) {

        element.textContent =
            text || "";

    }

}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

const adminViewButtons = Array.from(document.querySelectorAll('[data-view]'));
const contentEditor = document.getElementById('contentEditor');
const contentFields = document.getElementById('contentFields');
const contentStatus = document.getElementById('contentStatus');
const dashboardView = document.getElementById('dashboardView');
const calendarView = document.getElementById('calendarView');
const clientsView = document.getElementById('clientsView');
const settingsView = document.getElementById('settingsView');
const livePreview = document.getElementById('livePreview');

adminViewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const view = button.getAttribute('data-view');
        adminViewButtons.forEach(function (item) {
            item.classList.toggle('active', item === button);
        });
        const isDatabase = view === 'database';
        const isPortfolio = view === 'portfolio';
        const isContent = ['content', 'services', 'social'].includes(view);
        const isWebsiteEditor = view === 'website-editor' || isContent;
        contentEditor.classList.toggle('hidden', !isWebsiteEditor);
        document.querySelector('.toolbar').classList.toggle('hidden', !(isDatabase || isPortfolio));
        document.querySelector('.admin-layout').classList.toggle('hidden', !(isDatabase || isPortfolio));
        dashboardView.classList.toggle('hidden', !isDatabase && view !== 'dashboard');
        calendarView.classList.toggle('hidden', view !== 'calendar');
        clientsView.classList.toggle('hidden', view !== 'clients');
        settingsView.classList.toggle('hidden', view !== 'settings');
        if (isWebsiteEditor) renderContentEditor();
    });
});

function updateDashboard() {
    const sessions = document.getElementById('dashboardSessionCount');
    const photos = document.getElementById('dashboardPhotoCount');
    if (sessions) sessions.textContent = state.sessions.length;
    if (photos) photos.textContent = state.photos.length;
}

document.querySelector('[data-view="database"]').click();

if (livePreview) {
    livePreview.addEventListener('load', function () {
        postPreview(state.siteContent);
    });
}

function postPreview(content) {
    if (livePreview && livePreview.contentWindow) {
        livePreview.contentWindow.postMessage({ type: 'nelli-preview-content', content: content }, window.location.origin);
    }
}

function contentFieldMarkup(key, label, lang, value) {
    const long = /Text|description|message|sent|Error|validation/i.test(key);
    return '<div class="cms-field"><label for="cms-' + key + '-' + lang + '">' + escapeHtml(label) + ' <span>' + lang.toUpperCase() + '</span></label>' + (long ? '<textarea id="cms-' + key + '-' + lang + '" data-content-key="' + key + '" data-content-lang="' + lang + '">' + escapeHtml(value) + '</textarea>' : '<input id="cms-' + key + '-' + lang + '" data-content-key="' + key + '" data-content-lang="' + lang + '" value="' + escapeHtml(value) + '">') + '</div>';
}

function renderContentEditor() {
    if (!contentFields || !window.NelliContentModel || !state.siteContent) return;
    const translations = state.siteContent.translations || {};
    contentFields.innerHTML = window.NelliContentModel.fields.map(function (field) {
        const key = field[0];
        const label = field[1];
        return '<div class="cms-language-group"><h3>' + escapeHtml(label) + '</h3><div class="cms-language-grid">' + window.NelliContentModel.languages.map(function (lang) {
            return contentFieldMarkup(key, label, lang, translations[lang] && translations[lang][key] || '');
        }).join('') + '</div></div>';
    }).join('') + renderSocialFields() + renderServiceFields();

    setValue('heroImageUrl', state.siteContent.media.heroUrl);
    setValue('aboutImageUrl', state.siteContent.media.aboutUrl);
    setValue('heroLink', state.siteContent.links && state.siteContent.links.hero);
    setValue('seoTitle', state.siteContent.seo.title);
    setValue('seoDescription', state.siteContent.seo.description);
    setValue('ogImage', state.siteContent.seo.ogImage);
    document.querySelectorAll('[data-section-toggle]').forEach(function (input) {
        input.checked = state.siteContent.sections[input.getAttribute('data-section-toggle')] !== false;
    });
    bindDynamicContentInputs();
    postPreview(state.siteContent);
}

function renderSocialFields() {
    return '<div class="cms-language-group"><h3>Social links</h3>' + (state.siteContent.social || []).map(function (social) {
        return '<div class="social-admin-row"><label>' + escapeHtml(social.id) + ' URL<input data-social-id="' + escapeHtml(social.id) + '" data-social-field="url" type="url" value="' + escapeHtml(social.url || '') + '"></label><label>Label key<input data-social-id="' + escapeHtml(social.id) + '" data-social-field="labelKey" value="' + escapeHtml(social.labelKey || '') + '"></label><label><input data-social-id="' + escapeHtml(social.id) + '" data-social-field="visible" type="checkbox" ' + (social.visible !== false ? 'checked' : '') + '> Visible</label></div>';
    }).join('') + '</div>';
}

function renderServiceFields() {
    const services = state.siteContent.services || [];
    if (!services.length) return '<div class="cms-language-group"><h3>Services</h3><p class="field-help">Services can be supplied by the backend in the services array.</p></div>';
    return '<div class="cms-language-group"><h3>Services</h3>' + services.map(function (service, index) {
        return '<div class="service-admin-row"><label>Number<input data-service-index="' + index + '" data-service-field="number" value="' + escapeHtml(service.number || index + 1) + '"></label><label>Order<input data-service-index="' + index + '" data-service-field="order" type="number" value="' + escapeHtml(service.order || index + 1) + '"></label>' + window.NelliContentModel.languages.map(function (lang) {
            const value = service.translations && service.translations[lang] || {};
            return '<div class="service-language"><strong>' + lang.toUpperCase() + '</strong><input data-service-index="' + index + '" data-service-lang="' + lang + '" data-service-field="title" placeholder="Title" value="' + escapeHtml(value.title || '') + '"><textarea data-service-index="' + index + '" data-service-lang="' + lang + '" data-service-field="description" placeholder="Description">' + escapeHtml(value.description || '') + '</textarea></div>';
        }).join('') + '</div>';
    }).join('') + '</div>';
}

function bindDynamicContentInputs() {
    document.getElementById('saveDraftButton').onclick = function () { saveSiteContent(false); };
    document.getElementById('publishContentButton').onclick = function () { saveSiteContent(true); };
    contentEditor.querySelectorAll('input, textarea, select').forEach(function (input) {
        input.addEventListener('input', function () {
            postPreview(collectSiteContent());
        });
        input.addEventListener('change', function () {
            postPreview(collectSiteContent());
        });
    });
}

function collectSiteContent() {
    const content = window.NelliContentModel.mergeContent(state.siteContent);
    content.translations = window.NelliContentModel.languages.reduce(function (result, lang) {
        result[lang] = {};
        document.querySelectorAll('[data-content-key][data-content-lang="' + lang + '"]').forEach(function (input) {
            result[lang][input.getAttribute('data-content-key')] = input.value.trim();
        });
        return result;
    }, {});
    content.media.heroUrl = getValue('heroImageUrl');
    content.media.aboutUrl = getValue('aboutImageUrl');
    content.links.hero = getValue('heroLink') || '#contact';
    content.seo.title = getValue('seoTitle');
    content.seo.description = getValue('seoDescription');
    content.seo.ogTitle = content.seo.title;
    content.seo.ogDescription = content.seo.description;
    content.seo.ogImage = getValue('ogImage');
    document.querySelectorAll('[data-section-toggle]').forEach(function (input) {
        content.sections[input.getAttribute('data-section-toggle')] = input.checked;
    });
    content.social = (content.social || []).map(function (social) {
        document.querySelectorAll('[data-social-id="' + social.id + '"]').forEach(function (input) {
            if (input.getAttribute('data-social-field') === 'visible') social.visible = input.checked;
            else social[input.getAttribute('data-social-field')] = input.value.trim();
        });
        return social;
    });
    content.services = (content.services || []).map(function (service, index) {
        const result = Object.assign({}, service, {
            number: service.number || String(index + 1).padStart(2, '0'),
            order: service.order || index + 1,
            translations: Object.assign({}, service.translations || {})
        });
        document.querySelectorAll('[data-service-index="' + index + '"]').forEach(function (input) {
            const field = input.getAttribute('data-service-field');
            const lang = input.getAttribute('data-service-lang');
            if (lang) {
                result.translations[lang] = Object.assign({}, result.translations[lang] || {}, { [field]: input.value.trim() });
            } else if (field === 'order') {
                result.order = Number(input.value || index + 1);
            } else if (field) {
                result[field] = input.value.trim();
            }
        });
        return result;
    });
    content.published = false;
    return content;
}

function saveSiteContent(publish) {
    const content = collectSiteContent();
    content.published = publish;
    setMessage(contentStatus, publish ? 'Publishing...' : 'Saving draft...');
    postAdmin({ action: publish ? 'publishSiteContent' : 'saveSiteContent', content: content })
        .then(function () {
            state.siteContent = content;
            setMessage(contentStatus, publish ? 'Publish request sent. Backend confirmation required.' : 'Draft request sent. Backend confirmation required.');
        })
        .catch(function (error) {
            setMessage(contentStatus, error.message || 'Content API error.');
        });
}


/* =========================================================
   START
========================================================= */

loginScreen.classList.remove("hidden");
app.classList.add("hidden");
