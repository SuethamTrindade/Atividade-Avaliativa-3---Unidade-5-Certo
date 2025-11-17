export default class Telefone {
  #ddd;
  #numero;

  get ddd() { return this.#ddd; }
  get numero() { return this.#numero; }

  set ddd(v) { this.#ddd = v; }
  set numero(v) { this.#numero = v; }

  toJSON() {
    return {
      ddd: this.#ddd,
      numero: this.#numero
    };
  }
}
