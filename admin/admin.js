const API_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

const TOKEN_KEY =
    "nelli-admin-token";

let state = {
    token: "",
    sessions: [],
    photos: [],
    currentId: null
};


const loginScreen =
    document.getElementById("loginScreen");

const app =
    document.getElementById("app");

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

const sessionForm =
    document.getElementById("sessionForm");

const newSessionButton =
    document.getElementById("newSessionButton");

const deleteSessionButton =
    document.getElementById("deleteSessionButton");

const photoInput =
    document.getElementById("photoInput");

const photosList =
    document.getElementById("photosList");


/* =========================
   LOGIN
========================= */

loginButton.addEventListener(
    "click",
    login
);

adminToken.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            login();
        }

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

        return;
    }


    state.token = token;


    setMessage(
        loginMessage,
        "Перевіряємо доступ..."
    );


    loadAdminData(

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

        },

        function () {

            state.token = "";


            setMessage(
                loginMessage,
                "Невірний ключ або API недоступний."
            );

        }

    );

}


/* =========================
   LOGOUT
========================= */

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


        adminToken.value = "";

    }
);


/* =========================
   LOAD ADMIN DATA
========================= */

function loadAdminData(
    success,
    failure
) {

    const callbackName =
        "__nelliAdmin_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2);


    const script =
        document.createElement(
            "script"
        );


    let finished = false;


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


            finished = true;


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

                    newSession();

                }


                if (success) {
                    success(data);
                }

            }

            else {

                if (failure) {
                    failure(data);
                }

            }

        };


    const timeout =
        setTimeout(
            function () {

                if (finished) {
                    return;
                }


                finished = true;

                cleanup();


                if (failure) {

                    failure({

                        error:
                            "API недоступний або час очікування вичерпано."

                    });

                }

            },
            15000
        );


    const params =
        new URLSearchParams({

            action:
                "adminData",

            token:
                state.token,

            callback:
                callbackName

        });


    script.src =
        API_URL +
        "?" +
        params.toString();


    script.onerror =
        function () {

            if (finished) {
                return;
            }


            finished = true;


            cleanup();


            if (failure) {

                failure({

                    error:
                        "Не вдалося підключитися до API."

                });

            }

        };


    document.body.appendChild(
        script
    );

}


/* =========================
   SESSIONS
========================= */

function renderSessions() {

    sessionsList.innerHTML =
        "";


    const sorted =
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


    if (!sorted.length) {

        sessionsList.innerHTML =
            `
            <div style="color:#666">
                Фотосесій поки немає.
            </div>
            `;

        return;

    }


    sorted.forEach(
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


            card.innerHTML = `

                <div class="session-title">
                    ${escapeHtml(
                        session["Назва UA"] ||
                        "Без назви"
                    )}
                </div>

                <div class="session-meta">
                    ${escapeHtml(
                        session["Категорія"] ||
                        "other"
                    )}
                    ·
                    ${
                        active
                            ? "активна"
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


/* =========================
   SELECT
========================= */

function selectSession(id) {

    const session =
        findSession(id);


    if (!session) {
        return;
    }


    state.currentId =
        session.ID;


    setValue(
        "sessionId",
        session.ID
    );

    setValue(
        "category",
        session["Категорія"]
    );

    setValue(
        "slug",
        session["Slug"]
    );

    setValue(
        "titleUk",
        session["Назва UA"]
    );

    setValue(
        "titleRu",
        session["Назва RU"]
    );

    setValue(
        "titleEn",
        session["Назва EN"]
    );

    setValue(
        "titleCz",
        session["Назва CZ"]
    );

    setValue(
        "descriptionUk",
        session["Опис UA"]
    );

    setValue(
        "descriptionRu",
        session["Опис RU"]
    );

    setValue(
        "descriptionEn",
        session["Опис EN"]
    );

    setValue(
        "descriptionCz",
        session["Опис CZ"]
    );

    setValue(
        "order",
        session["Порядок"] || 1
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


    renderSessions();

    renderPhotos();

}


/* =========================
   NEW SESSION
========================= */

newSessionButton.addEventListener(
    "click",
    newSession
);


function newSession() {

    state.currentId =
        null;


    sessionForm.reset();


    setValue(
        "sessionId",
        ""
    );


    setValue(
        "category",
        "other"
    );


    setValue(
        "slug",
        ""
    );


    setValue(
        "order",
        state.sessions.length + 1
    );


    setValue(
        "active",
        "true"
    );


    photosList.innerHTML =
        `
        <div style="color:#666">
            Збережіть фотосесію,
            щоб додати фотографії.
        </div>
        `;


    renderSessions();

}


/* =========================
   SAVE SESSION
========================= */

sessionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const session = {

            id:
                getValue("sessionId"),

            category:
                getValue("category"),

            slug:
                getValue("slug"),

            titleUk:
                getValue("titleUk"),

            titleRu:
                getValue("titleRu"),

            titleEn:
                getValue("titleEn"),

            titleCz:
                getValue("titleCz"),

            descriptionUk:
                getValue("descriptionUk"),

            descriptionRu:
                getValue("descriptionRu"),

            descriptionEn:
                getValue("descriptionEn"),

            descriptionCz:
                getValue("descriptionCz"),

            order:
                Number(
                    getValue("order") || 0
                ),

            active:
                getValue("active") ===
                "true"

        };


        if (
            !session.titleUk
        ) {

            setMessage(
                globalMessage,
                "Введіть назву українською."
            );

            return;
        }


        setMessage(
            globalMessage,
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

                setMessage(
                    globalMessage,
                    "Фотосесію збережено ✓"
                );


                setTimeout(
                    function () {

                        loadAdminData();

                    },
                    700
                );

            }
        )

        .catch(
            function (error) {

                setMessage(
                    globalMessage,
                    error.message ||
                    "Помилка збереження."
                );

            }
        );

    }
);


/* =========================
   DELETE SESSION
========================= */

deleteSessionButton.addEventListener(
    "click",
    function () {

        const id =
            getValue(
                "sessionId"
            );


        if (!id) {

            setMessage(
                globalMessage,
                "Спочатку виберіть фотосесію."
            );

            return;

        }


        if (
            !confirm(
                "Видалити фотосесію та всі її фотографії?"
            )
        ) {

            return;

        }


        setMessage(
            globalMessage,
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


                setMessage(
                    globalMessage,
                    "Фотосесію видалено ✓"
                );


                setTimeout(
                    function () {

                        loadAdminData();

                    },
                    700
                );

            }
        )

        .catch(
            function (error) {

                setMessage(
                    globalMessage,
                    error.message ||
                    "Помилка видалення."
                );

            }
        );

    }
);


/* =========================
   PHOTO INPUT
========================= */

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


/* =========================
   UPLOAD
========================= */

async function uploadPhotos(
    files
) {

    const sessionId =
        getValue(
            "sessionId"
        );


    if (!sessionId) {

        alert(
            "Спочатку збережіть фотосесію."
        );

        photoInput.value =
            "";

        return;

    }


    if (!files.length) {
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
            file.size >
            8 * 1024 * 1024
        ) {

            setMessage(
                globalMessage,
                "Файл " +
                file.name +
                " більший за 8 MB."
            );

            continue;

        }


        setMessage(
            globalMessage,
            "Завантаження фото " +
            (i + 1) +
            " / " +
            files.length +
            "..."
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
                globalMessage,
                "Помилка: " +
                error.message
            );

            return;

        }

    }


    photoInput.value =
        "";


    setTimeout(
        function () {

            loadAdminData(
                function () {

                    setMessage(
                        globalMessage,
                        "Фотографії завантажено ✓"
                    );

                }
            );

        },
        800
    );

}


/* =========================
   PHOTOS
========================= */

function renderPhotos() {

    if (!state.currentId) {

        photosList.innerHTML =
            `
            <div style="color:#666">
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
            <div style="color:#666">
                У цій фотосесії ще немає фотографій.
            </div>
            `;

        return;

    }


    photosList.innerHTML =
        "";


    photos.forEach(
        function (photo) {

            const fileId =
                String(
                    photo["File ID"] || ""
                );


            const url =
                fileId
                    ? "https://drive.google.com/uc?export=view&id=" +
                      encodeURIComponent(fileId)
                    : "";


            const cover =
                String(
                    session["Обкладинка"] || ""
                );


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
                            isCover
                                ? `
                                    <button
                                        type="button"
                                        disabled
                                    >
                                        Обкладинка
                                    </button>
                                  `
                                : `
                                    <button
                                        type="button"
                                        data-cover
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


/* =========================
   COVER
========================= */

function setCover(
    sessionId,
    fileId
) {

    setMessage(
        globalMessage,
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

            setTimeout(
                function () {

                    loadAdminData(
                        function () {

                            setMessage(
                                globalMessage,
                                "Обкладинку встановлено ✓"
                            );

                        }
                    );

                },
                700
            );

        }
    )

    .catch(
        function (error) {

            setMessage(
                globalMessage,
                error.message ||
                "Помилка."
            );

        }
    );

}


/* =========================
   DELETE PHOTO
========================= */

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
        globalMessage,
        "Видаляємо..."
    );


    postAdmin({

        action:
            "deletePhoto",

        photoId:
            photoId

    })

    .then(
        function () {

            setTimeout(
                function () {

                    loadAdminData(
                        function () {

                            setMessage(
                                globalMessage,
                                "Фото видалено ✓"
                            );

                        }
                    );

                },
                700
            );

        }
    )

    .catch(
        function (error) {

            setMessage(
                globalMessage,
                error.message ||
                "Помилка видалення."
            );

        }
    );

}


/* =========================
   POST
========================= */

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


/* =========================
   FILE
========================= */

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
                            result.split(",")[1] || ""
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


/* =========================
   HELPERS
========================= */

function findSession(
    id
) {

    return state.sessions.find(
        function (session) {

            return String(
                session.ID
            ) ===
            String(id);

        }
    ) || null;

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


/* =========================
   AUTO LOGIN
========================= */

const savedToken =
    sessionStorage.getItem(
        TOKEN_KEY
    );


if (savedToken) {

    state.token =
        savedToken;


    loadAdminData(

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

        },

        function () {

            sessionStorage.removeItem(
                TOKEN_KEY
            );


            state.token =
                "";

        }

    );

}
