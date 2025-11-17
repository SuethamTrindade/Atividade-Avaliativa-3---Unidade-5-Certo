export default class Titulo {
  #numero = "";
  #zona = "";
  #secao = "";

  setNumero(v) { this.#numero = v; }
  getNumero() { return this.#numero; }

  setZona(v) { this.#zona = v; }
  getZona() { return this.#zona; }

  setSecao(v) { this.#secao = v; }
  getSecao() { return this.#secao; }

  toJSON() {
    return {
      numero: this.#numero,
      zona: this.#zona,
      secao: this.#secao
    };
  }
}
