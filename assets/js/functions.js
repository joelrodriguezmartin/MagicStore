
//Constante urls, objeto que contiene las urls de petición a la api de los sets básicos y su código de set
const urls = {
    "ugin": "https://api.scryfall.com/cards/search?order=set&q=e%3Augin&unique=prints",
    "2016": "https://api.scryfall.com/cards/search?order=set&q=e%3Aw16&unique=prints",
    "2017": "https://api.scryfall.com/cards/search?order=set&q=e%3Aw17&unique=prints",
    "zendikar": "https://api.scryfall.com/cards/search?order=set&q=e%3Azne&unique=prints",
    "twoplayer": "https://api.scryfall.com/cards/search?order=set&q=e%3Aitp&unique=prints"
};
//Variable global de deck actual, aqui se almacenaran los datos de deck del usuario. Se recogeran en inicio de el Storage y se guardaran dinámicamente también ahi.
let currentDeck;

//CREACION DE DATOS

/**
 * Función asíncrona que realiza una petición a la API y devuelve los datos
 * @param {*} url 
 * @returns 
 */
async function fetchSet(url) {
    try {
        const response = await (fetch(url));
        const set = await response.json();
        return set.data;

    } catch (error) {
        console.log("Error de ejecución")
        return null;
    }
}
/**
 * Función asíncrona que crea un objeto set y lo rellena con objetos carta a partir de los datos de la API
 * @param {*} setCode 
 * @returns 
 */
async function createSet(setCode) {
    const url = urls[setCode];
    let cardArray = [];
    await fetchSet(url).then(cards => {
        cards.forEach(element => {
            //Pasar a lowercase y comprobar si incluye "creature"
            if (element.type_line.toLowerCase().includes("creature")) {
                cardArray.push(new CreatureCard(element.name, element.id, element.prices["eur"], element.set_name, element.colors, element.type_line, element.cmc, element.image_uris.png, element.scryfall_uri, element.rarity, element.power, element.toughness));
            }
            else {
                cardArray.push(new MagicCard(element.name, element.id, element.prices["eur"], element.set_name, element.colors, element.type_line, element.cmc, element.image_uris.png, element.scryfall_uri, element.rarity));
            }

        });
    })
    let set = new MagicSet(cardArray);
    return set;
}
/**
 * Añade todos los sets a el localstorage para servir como base de datos de ids (ya que no tenemos base de datos)
 */
async function createAllSets() {
    let cardArray = [];
    for (const urlCode in urls) {
        await fetchSet(urls[urlCode]).then(cards => {
            cards.forEach(element => {
                //Pasar a lowercase y comprobar si incluye "creature"
                if (element.type_line.toLowerCase().includes("creature")) {
                    cardArray.push(new CreatureCard(element.name, element.id, element.prices["eur"], element.set_name, element.colors, element.type_line, element.cmc, element.image_uris.png, element.scryfall_uri, element.rarity, element.power, element.toughness));
                }
                else {
                    
                    cardArray.push(new MagicCard(element.name, element.id, element.prices["eur"], element.set_name, element.colors, element.type_line, element.cmc, element.image_uris.png, element.scryfall_uri, element.rarity));
                }

            });
        })
    }
    let allset = new MagicSet(cardArray);
    localStorage.setItem("allSets", JSON.stringify(allset));
}
//CARGA DE DATOS EN VISTAS

/**
 * Funcion que recarga la sección de cartas de la página, generando para ello un objeto set creado con los datos de la peticion a la API
 * @param {*} setCode 
 */
function loadPage(setCode) {
    createSet(setCode).then(set => {
        let cards = set.getCards();
        let cardContainer = document.getElementById("cards");
        cardContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();
        cards.forEach(element => {
            let template = document.querySelector("#card-template").content;
            template.querySelectorAll("h3")[0].textContent = element.name;
            template.querySelectorAll("p")[0].textContent = element.price;
            template.querySelectorAll("img")[0].src = element.image;
            template.querySelectorAll("img")[0].setAttribute("value", element.id);
            template.querySelectorAll("a")[0].setAttribute("value", element.id);
            const clone = template.cloneNode(true);
            fragment.appendChild(clone);
        });
        cardContainer.appendChild(fragment);
        localStorage.setItem("currentSet", JSON.stringify(set));
    });
}
/**
 * Funcion que recarga la seccion del deck/carrito
 */
function loadDeck() {
    let cardContainer = document.getElementById("items");
    cardContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const cards = currentDeck.getCards();
    checkEmpty(cards);
    //Generamos la fila de cada carta guardada en el deck
    cards.forEach(element => {
        let template = document.querySelector("#table-template").content;
        template.querySelectorAll("td")[0].firstChild.src = element.card.image;
        template.querySelectorAll("td")[1].textContent = element.card.name;
        template.querySelectorAll("td")[2].textContent = element.card.price;
        template.querySelectorAll("td")[3].textContent = element.amount;
        template.querySelectorAll("td")[4].querySelectorAll("button")[0].setAttribute("value", element.card.id);
        template.querySelectorAll("td")[4].querySelectorAll("button")[1].setAttribute("value", element.card.id);
        template.querySelectorAll("td")[5].textContent = (element.card.price * element.amount).toFixed(2);
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    //Y luego generamos la fila del precio total
    template = document.querySelector("#table-template2").content;
    template.querySelectorAll("td")[0].textContent = "TOTAL: ";
    template.querySelectorAll("td")[3].textContent = currentDeck.getCardAmount();
    template.querySelectorAll("td")[5].textContent = currentDeck.getTotalPrice().toFixed(2);
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
    cardContainer.appendChild(fragment);
}
/**
 * Funcion que oculta o enseña el elemento "vacio" de la lista de cartas
 * @param {*} cards 
 */
function checkEmpty(cards) {
    if (cards.length > 0) {
        document.getElementById("empty").style = "display: none";
    } else {
        document.getElementById("empty").style = "display: flex";
    }
}
/**
 * Funcion para cargar la vista de Home a partir de los datos
 * @param {*} setCode 
 */
function loadHome() {
    //loadPage(setCode);
    let storageData = localStorage.getItem("currentDeck");
    if (storageData == null) {
        currentDeck = new Deck();
    } else {
        currentDeck = new Deck();
        currentDeck.deserialize(storageData);
    }
    let userData = localStorage.getItem("userData");
    if (userData == null) {

    } else {
        loadDeck();
    }
}
/**
 * Funcion para cargar la informacion de detalle, llama a cargar la vista
 */
function loadDetail() {
    let storageData = localStorage.getItem("currentDeck");

    currentDeck = new Deck();
    if (localStorage.getItem("userData") != null) {
        currentDeck.deserialize(storageData);
    }

    loadDeckDetail();
}
/**
 * Funcion para cargar la vista de las cartas del deck
 */
function loadDeckDetail() {
    let cards = currentDeck.getCards();
    let cardContainer = document.getElementById("cards2");
    cardContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    cards.forEach(element => {
        let template = document.querySelector("#card-template").content;
        template.querySelectorAll("h3")[0].textContent = element.card.name;
        template.querySelectorAll("p")[0].textContent = element.card.price;
        template.querySelectorAll("img")[0].src = element.card.image;
        template.querySelectorAll("a")[0].href = element.card.url;
        template.querySelectorAll("p")[1].textContent = element.amount;
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    cardContainer.appendChild(fragment);
}
/**
 * Carga la vista de set tras filtrar
 * @param {} arrayCards 
 */
function loadFilterSet(arrayCards) {
    let cardContainer = document.getElementById("cards");
    cardContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    arrayCards.forEach(element => {
        let template = document.querySelector("#card-template").content;
        template.querySelectorAll("h3")[0].textContent = element.name;
        template.querySelectorAll("p")[0].textContent = element.price;
        template.querySelectorAll("img")[0].src = element.image;
        template.querySelectorAll("img")[0].setAttribute("value", element.id);
        template.querySelectorAll("a")[0].setAttribute("value", element.id);
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    cardContainer.appendChild(fragment);
}
/**
 * Carga la vista de deck tras filtrar
 * @param {*} arrayCards 
 */
function loadFilterDeck(arrayCards) {
    let cardContainer = document.getElementById("cards2");
    cardContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    arrayCards.forEach(element => {
        let template = document.querySelector("#card-template").content;
        template.querySelectorAll("h3")[0].textContent = element.card.name;
        template.querySelectorAll("p")[0].textContent = element.card.price;
        template.querySelectorAll("img")[0].src = element.card.image;
        template.querySelectorAll("a")[0].href = element.card.url;
        template.querySelectorAll("p")[1].textContent = element.amount;
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    cardContainer.appendChild(fragment);
}


//CAMBIOS A LA ESTRUCTURA DE DATOS

/**
 * Función que añade una carta al deck actual y llama a la recarga de deck
 * @param {*} id 
 */
function addCard(id) {
    let userData = localStorage.getItem("userData");
    if (userData == null) {
        alert("Inicia sesión para empezar a hacer un deck");
    } else {
        const setData = JSON.parse(localStorage.getItem("currentSet"));
        const set = new MagicSet(setData.cards);
        currentDeck.add(set.getCard(id));
        localStorage.setItem("currentDeck", currentDeck.serialize());
        loadDeck();
    }
}
/**
 * Funcion que elimina una carta del deck actual y llama a la recarga de deck
 * @param {*} id 
 */
function removeCard(id) {
    const setData = JSON.parse(localStorage.getItem("allSets"));
    const set = new MagicSet(setData.cards);
    currentDeck.remove(set.getCard(id));
    localStorage.setItem("currentDeck", currentDeck.serialize());
    loadDeck();
}


//FILTROS

/**
 * Filtra las cartas del set por color
 * @param {*} filterQuery 
 */
function filterSetColor(filterQuery) {
    const setData = JSON.parse(localStorage.getItem("currentSet"));
    const set = new MagicSet(setData.cards);
    let filter;
    if (filterQuery == 'A') {
        filter = set.getCards();
    } else {
        filter = set.filterColor(filterQuery);
    }
    loadFilterSet(filter);
}
/**
 * Filtra las cartas del set por coste de mana convertido
 * @param {*} filterQuery 
 */
function filterSetCost(filterQuery) {
    const setData = JSON.parse(localStorage.getItem("currentSet"));
    const set = new MagicSet(setData.cards);
    let filter;
    if (filterQuery == 'A') {
        filter = set.getCards();
    } else {
        filter = set.filterCost(filterQuery);
    }
    loadFilterSet(filter);
}
/**
 * Filtra las cartas del deck por color
 * @param {*} filterQuery 
 */
function filterDeckColor(filterQuery) {
    let storageData = localStorage.getItem("currentDeck");
    let userData = localStorage.getItem("userData");
    let deck;
    let filter;
    if (storageData == null || userData == null) {
        deck = new Deck();
        filter = deck.getCards();
    } else {
        deck = new Deck();
        deck.deserialize(storageData);
        if (filterQuery == 'A') {
            filter = deck.getCards();
        } else {
            filter = deck.filterColor(filterQuery);
        }
        loadFilterDeck(filter);
    }
}
/**
 * Filtra las cartas del deck por coste de mana convertido
 * @param {*} filterQuery 
 */
function filterDeckCost(filterQuery) {
    let storageData = localStorage.getItem("currentDeck");
    let userData = localStorage.getItem("userData");
    let deck;
    let filter;
    if (storageData == null || userData == null) {
        deck = new Deck();
        filter = deck.getCards();
    } else {
        deck = new Deck();
        deck.deserialize(storageData);
        if (filterQuery == 'A') {
            filter = deck.getCards();
        } else {
            filter = deck.filterCost(filterQuery);
        }
        loadFilterDeck(filter);
    }
}
function filterDeckRarity(filterQuery) {
    let storageData = localStorage.getItem("currentDeck");
    let userData = localStorage.getItem("userData");
    let deck;
    let filter;
    if (storageData == null || userData == null) {
        deck = new Deck();
        filter = deck.getCards();
    } else {
        deck = new Deck();
        deck.deserialize(storageData);
        if (filterQuery == 'A') {
            filter = deck.getCards();
        } else {
            filter = deck.filterRarity(filterQuery);
        }
        loadFilterDeck(filter);
    }
}

