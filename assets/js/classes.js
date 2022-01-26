//En algunas clases uso Magic porque hay sobrecarga con clases de Bootstrap (Set y Card por lo menos)
class MagicCard {
    constructor(name, id, price, set, colors, type, cost, image, url, rarity) {
        this.name = name;
        this.id = id;
        this.price = price;
        this.set = set;
        this.colors = colors;
        this.type = type;
        this.cost = cost;
        this.image = image;
        this.url = url;
        this.rarity = rarity;
    }
}
class CreatureCard extends MagicCard {
    constructor(name, id, price, set, colors, type, cost, image, url, rarity, power, toughness) {
        super(name, id, price, set, colors, type, cost, image, url, rarity);
        this.power = power;
        this.toughness = toughness;
    }
}
class MagicSet {
    constructor(cards) {
        if (cards === undefined) {
            this.cards = [];
        }
        else {
            this.cards = cards;
        }
    }
    /**
     * Retorna el array de cartas del set
     * @returns 
     */
    getCards() {
        return this.cards;
    }
    /**
     * Retorna un objeto carta del set utilizando el id
     * @param {*} id 
     * @returns 
     */
    getCard(id) {
        return this.cards.find(element => element.id == id);
    }
    /**
     * Filtra las cartas del set por color y devuelve un array de las cartas filtradas
     * @param {*} filterQuery 
     * @returns 
     */
    filterColor(filterQuery) {
        let arrayCards = [];
        if (filterQuery == '') {//Este caso es para incoloro
            this.cards.forEach(element => {
                if (element.colors.length == 0) {
                    arrayCards.push(element);
                }
            });
        } else {
            this.cards.forEach(element => {
                if (element.colors.includes(filterQuery)) {
                    arrayCards.push(element);
                }
            });
        }
        return arrayCards;
    }
    /**
     * Filtra las cartas del set por coste y devuelve array de cartas filtradas
     * @param {*} filterQuery 
     * @returns 
     */
    filterCost(filterQuery) {
        let arrayCards = [];
        this.cards.forEach(element => {
            if (filterQuery == 1) {
                if (element.cost <= filterQuery) {
                    arrayCards.push(element);
                }
            } else if (filterQuery == 6) {
                if (element.cost >= filterQuery) {
                    arrayCards.push(element);
                }
            } else {
                if (element.cost == filterQuery) {
                    arrayCards.push(element);
                }
            }
        });
        return arrayCards;
    }
}
class Deck {
    cards = [];

    getCards() {
        return this.cards;
    }
    /**
     * Añade la carta parámetro al deck cumpliendo las condiciones de Max60Cartas Max4Copias
     * @param {*} card 
     */
    add(card) {
        const foundCard = this.cards.find(instance => instance.card.id == card.id);//Recogemos la instancia de la carta en el array
        if (this.getCardAmount() < 60) {//Si el mazo aun no tiene 60 cartas
            if (foundCard == undefined) {//Si no se encontro la carta en el array se crea con cantidad 1
                this.cards.push({ "amount": 1, "card": card });
            }
            else {//Y si se encontro comprobamos que la cantidad sea menor que 4 y la aumentamos en ese caso 
                if (foundCard.amount < 4) {
                    foundCard.amount++;
                }
            }
        }
    }
    /**
     * Elimina la carta parámetro del deck
     * @param {*} card 
     */
    remove(card) {
        const foundCard = this.cards.find(instance => instance.card.id == card.id);//Recogemos la instancia de la carta en el array, siempre va a estar
        if (foundCard.amount > 1) {//Si la cantidad es mayor que 1 la disminuimos
            foundCard.amount--;
        }
        else {//Y si es 1 eliminamos la carta del array
            this.cards.splice(this.cards.indexOf(foundCard), 1);
        }
    }
    /**
     * Retorna el total de cartas en el deck
     * @returns 
     */
    getCardAmount() {
        let aux = 0;
        this.cards.forEach(element => {
            aux += element.amount;
        });
        return aux;
    }
    /**
     * Retorna el total de precio del deck
     * @returns 
     */
    getTotalPrice() {
        let aux = 0;
        this.cards.forEach(element => {
            aux += element.card.price * element.amount;
        });
        return aux;
    }
    /**
     * Funcion que serializa el objeto a JSON para guardarlo en el storage
     * @returns 
     */
    serialize() {
        return JSON.stringify(this);
    }
    /**
     * Funcion que desserializa un JSON y coge sus datos
     * @param {*} storageData 
     */
    deserialize(storageData) {
        const dataObject = JSON.parse(storageData);
        dataObject.cards.forEach(card => {
            for (let i = 0; i < card.amount; i++) {
                this.add(card.card);
            }
        });
    }
    /**
     * Filtra cartas del deck por color y devuelve array de cartas
     * @param {*} filterQuery 
     * @returns 
     */
    filterColor(filterQuery) {
        let arrayCards = [];
        if (filterQuery == '') {//Este caso es para incoloro
            this.cards.forEach(element => {
                if (element.card.colors.length == 0) {
                    arrayCards.push(element);
                }
            });
        } else {
            this.cards.forEach(element => {
                if (element.card.colors.includes(filterQuery)) {
                    arrayCards.push(element);
                }
            });
        }
        return arrayCards;
    }
    /**
     * Filtra por coste y devuelve array
     * @param {*} filterQuery 
     * @returns 
     */
    filterCost(filterQuery) {
        let arrayCards = [];
        this.cards.forEach(element => {
            if (filterQuery == 1) {
                if (element.card.cost <= filterQuery) {
                    arrayCards.push(element);
                }
            } else if (filterQuery == 6) {
                if (element.card.cost >= filterQuery) {
                    arrayCards.push(element);
                }
            } else {
                if (element.card.cost == filterQuery) {
                    arrayCards.push(element);
                }
            }
        });
        return arrayCards;
    }
    filterRarity(filterQuery) {
        let arrayCards = [];
        this.cards.forEach(element => {
            if (element.card.rarity == filterQuery) {
                arrayCards.push(element);
            }
        });
        return arrayCards;
    }
}

