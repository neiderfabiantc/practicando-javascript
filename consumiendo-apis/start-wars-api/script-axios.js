const form = document.querySelector("#form");

function listItems(items, countItems) {
    const page = document.querySelector("#page");

    if (!page.querySelector("ul")) {
        const ul = document.createElement("ul");
        page.appendChild(ul);
    }

    for (let item of items) {
        const li = document.createElement("li");

        const form = document.querySelector("#form");
        if (form.querySelector("#resources").value === "films") {
            li.textContent = item.title;
        } else {
            li.textContent = item.name;
        }

        const ul = page.querySelector("ul");
        ul.appendChild(li);
    }

    const ul = page.querySelector("ul");

    if (ul.querySelectorAll("li").length !== countItems) {
        const btn = document.createElement("button");
        btn.textContent = "Cargar más";
        btn.style.cursor = "pointer";
        btn.style.marginTop = "1rem";

        ul.appendChild(btn);
    }
}

function consumeApi(url) {
    const startTime = new Date().getTime(); // Hora de inicio de la solicitud
    axios
        .get(url)
        .then(({ data }) => {
            // Calcula tiempo de la solicitud para compararlo con el tiempo que le toma a fetch
            const endTime = new Date().getTime();
            const duration = endTime - startTime;
            console.log(`Tiempo de respuesta Axios: ${duration} milisegundos.`);

            const { results: items, count: countItems } = data;
            listItems(items, countItems);

            const ul = page.querySelector("ul");
            if (ul.querySelector("button")) {
                const btn = ul.querySelector("button");
                btn.addEventListener("click", () => {
                    btn.remove();

                    if (ul.querySelectorAll("li").length !== countItems) {
                        consumeApi(data.next);
                    }
                });
            }
        })
        .catch((error) => {
            console.log("Hubo un problema al obtener los datos.");
            console.log(error);
        });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const resource = form.querySelector("#resources").value;

    const page = document.querySelector("#page");
    if (page.querySelector("ul")) {
        page.querySelector("ul").remove();
    }
    // Obteniendo los datos
    const URLBASE = "https://swapi.dev/api/";
    const url = URLBASE + resource;

    consumeApi(url);
});
