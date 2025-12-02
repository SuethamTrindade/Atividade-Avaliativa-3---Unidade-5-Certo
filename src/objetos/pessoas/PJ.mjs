export default class PJ {
  #id; #nome; #email; #cnpj; #dataRegistro; #endereco; #ie;
  #telefones = [];

  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get cnpj() { return this.#cnpj; }
  get dataRegistro() { return this.#dataRegistro; }
  get endereco() { return this.#endereco; }
  get ie() { return this.#ie; }
  get telefones() { return this.#telefones; }

  set id(v) { this.#id = v; }
  set nome(v) { this.#nome = v; }
  set email(v) { this.#email = v; }
  set cnpj(v) { this.#cnpj = v; }
  set dataRegistro(v) { this.#dataRegistro = v; }
  set endereco(v) { this.#endereco = v; }
  set ie(v) { this.#ie = v; }

  addTelefone(v) {
    this.#telefones.push(v);
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      cnpj: this.#cnpj,
      // O backend espera "data" para a data de registro
      data: this.#dataRegistro,
      endereco: this.#endereco?.toJSON ? this.#endereco.toJSON() : this.#endereco,
      ie: this.#ie?.toJSON ? this.#ie.toJSON() : this.#ie,
      telefones: this.#telefones.map(t => t?.toJSON ? t.toJSON() : t)
    };
  }
}