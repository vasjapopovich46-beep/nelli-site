const API_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

const TOKEN_KEY =
    "nelli-admin-token";


const state = {
    token: "",
    sessions: [],
    photos: [],
    currentId: null,
    isNew: false
};


/* =========================================================
   ELEMENTS
========================================================= */

const loginScreen =
    document.getElementById("loginScreen");

const app =
    document.getElementById("app");

const loginForm =
    document.getElementById("loginForm");

const adminToken =
    document.getElementById("adminToken");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const globalMessage =
    document.getElementById("globalMessage");

const logoutButton =
    document.getElementById("logoutButton");

const sessionsList =
    document.getElementById("sessionsList");

const sessionSearch =
    document.getElementById("sessionSearch");

const sessionCount =
    document.getElementById("sessionCount");

const newSessionButton =
    document.getElementById("newSessionButton");

const emptyCreateButton =
    document.getElementById("emptyCreateButton");

const emptyState =
    document.getElementById("emptyState");

const editor =
    document.getElementById("editor");

const editorTitle =
    document.getElementById("editorTitle");

const editorStatus =
    document.getElementById("editorStatus");

const saveSessionButton =
    document.getElementById("saveSessionButton");

const deleteSessionButton =
    document.getElementById(
        "deleteSessionButton"
    );

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

    const token =
        adminToken.value.trim();


    if (!token) {

        setMessage(
            loginMessage,
            "Введіть ключ адміністратора."
        );

        adminToken.focus();

        return;

    }


    state.token =
        token;


    loginButton.disabled =
        true;


    setMessage(
        loginMessage,
        "Перевіряємо доступ..."
    );


    loadData()

        .then(
            function () {

                sessionStorage.setItem(
                    TOKEN_KEY,
                    token
                );


                loginScreen.classList.add(
                    "hidden"
                );


                app.classList.remove(
                    "hidden"
                );


                setMessage(
                    loginMessage,
                    ""
                );


                setMessage(
                    globalMessage,
                    "Підключено ✓"
                );

            }
        )

        .catch(
            function (error) {

                state.token =
                    "";


                loginButton.disabled =
                    false;


                setMessage(
                    loginMessage,
                    "Невірний ключ."
                );


                console.error(
                    "NELLI ADMIN LOGIN ERROR:",
                    error
                );

            }
        );

}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    function () {

        sessionStorage.removeItem(
            TOKEN_KEY
        );


        state.token = "";

        state.currentId = null;


        app.classList.add(
            "hidden"
        );


        loginScreen.classList.remove(
            "hidden"
        );


        adminToken.value =
            "";


        loginButton.disabled =
            false;

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
                "__nelliAdminCallback_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .substring(2);


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
                                "Час очікування API вичерпано."
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


                        renderSessions();


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
                                data?.error ||
                                "Помилка API."
                            )
                        );

                    }

                };


            const params =
                new URLSearchParams();


            params.set(
                "action",
                "adminData"
            );


            params.set(
                "token",
                state.token
            );


            params.set(
                "callback",
                callbackName
            );


            /*
             * Додаємо timestamp,
             * щоб телефон не віддавав стару
             * закешовану відповідь.
             */

            params.set(
                "_",
                Date.now().toString()
            );


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
                            "Не вдалося підключитися до API."
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
        sessionSearch.value
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


            const photos =
                countPhotos(
                    session.ID
                );


            card.innerHTML = `

                <div class="session-card-photo-count">
                    ${photos}
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
   NEW
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


    renderSessions();


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
   SAVE
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


        document
            .getElementById(
                "titleUk"
            )
            .focus();


        return;

    }


    let slug =
        getValue(
            "slug"
        );


    if (!slug) {

        slug =
            slugify(
                titleUk
            );

    }


    const session = {

        id:
            id,

        category:
            getValue(
                "category"
            ) || "other",

        slug:
            slug,

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
            ) === "true",

        cover:
            getCurrentCover()

    };


    state.currentId =
        id;


    state.isNew =
        false;


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

            selectSession(id);


            setMessage(
                editorStatus,
                "Збережено ✓"
            );


            setMessage(
                globalMessage,
                "Зміни збережено."
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
                    "Фотосесію видалено."
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
   UPLOAD
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


async function uploadPhotos(
    files
) {

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


    try {

        await loadData();


        selectSession(
            sessionId
        );


        setMessage(
            editorStatus,
            "Фотографії завантажено ✓"
        );

    }

    catch (error) {

        setMessage(
            editorStatus,
            "Фото відправлено. Оновіть сторінку."
        );

    }

}


/* =========================================================
   PHOTOS
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
                "Обкладинку встановлено ✓"
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
                "Фото видалено ✓"
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
   POST ADMIN
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
                String(
                    id
                )
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
                String(
                    sessionId
                )
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

                    try {

                        const result =
                            String(
                                reader.result
                            );


                        resolve(
                            result.split(
                                ","
                            )[1] || ""
                        );

                    }

                    catch (error) {

                        reject(
                            error
                        );

                    }

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


/* =========================================================
   AUTO LOGIN
========================================================= */

const savedToken =
    sessionStorage.getItem(
        TOKEN_KEY
    );


if (savedToken) {

    state.token =
        savedToken;


    loadData()

        .then(
            function () {

                loginScreen.classList.add(
                    "hidden"
                );


                app.classList.remove(
                    "hidden"
                );


                setMessage(
                    globalMessage,
                    "Підключено ✓"
                );

            }
        )

        .catch(
            function () {

                sessionStorage.removeItem(
                    TOKEN_KEY
                );


                state.token =
                    "";

            }
        );

}
