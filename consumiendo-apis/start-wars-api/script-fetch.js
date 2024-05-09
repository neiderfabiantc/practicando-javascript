const form = document.querySelector("#form");

function listItems(items, countItems) {
    const page = document.querySelector("#page");

    if (!document.querySelector("ul")) {
        const ul = document.createElement("ul");
        page.appendChild(ul);
    }

    for (let item of items) {
        const li = document.createElement("li");

        const form = page.querySelector("#form");
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
        btn.style.marginTop = "1rem";
        btn.style.cursor = "pointer";
        ul.appendChild(btn);
    }
}

function consumeApi(url) {
    const startTime = new Date().getTime(); // Hora de inicio de la solicitud
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `${response.status}. Hubo un problema al obtener los datos.`
                );
            }
            // Calcula tiempo de la solicitud para compararlo con el tiempo que le toma a axios
            const endTime = new Date().getTime();
            const duration = endTime - startTime;
            console.log(`Tiempo de respuesta Fetch: ${duration} milisegundos.`);

            return response.json();
        })
        .then((response) => {
            const { results, count } = response;
            listItems(results, count);

            const ul = page.querySelector("ul");
            if (ul.querySelector("button")) {
                const btn = ul.querySelector("button");
                btn.addEventListener("click", () => {
                    btn.remove();

                    if (ul.querySelectorAll("li").length !== response.count) {
                        consumeApi(response.next);
                    }
                });
            }
        })
        .catch((error) => {
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
