export default class Endereco {
  #cep; #logradouro; #bairro; #cidade; #uf; #regiao;

  get cep() { return this.#cep; }
  get logradouro() { return this.#logradouro; }
  get bairro() { return this.#bairro; }
  get cidade() { return this.#cidade; }
  get uf() { return this.#uf; }
  get regiao() { return this.#regiao; }

  set cep(v) { this.#cep = v; }
  set logradouro(v) { this.#logradouro = v; }
  set bairro(v) { this.#bairro = v; }
  set cidade(v) { this.#cidade = v; }
  set uf(v) { this.#uf = v; }
  set regiao(v) { this.#regiao = v; }

  toJSON() {
    return {
      cep: this.#cep,
      logradouro: this.#logradouro,
      bairro: this.#bairro,
      cidade: this.#cidade,
      uf: this.#uf,
      regiao: this.#regiao
    };
  }
}
