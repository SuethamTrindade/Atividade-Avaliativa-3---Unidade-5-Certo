export default class PF {
  #id; #nome; #email; #cpf; #dataNascimento; #endereco; #titulo;
  #telefones = [];

  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get cpf() { return this.#cpf; }
  get dataNascimento() { return this.#dataNascimento; }
  get endereco() { return this.#endereco; }
  get titulo() { return this.#titulo; }
  get telefones() { return this.#telefones; }

  set id(v) { this.#id = v; }
  set nome(v) { this.#nome = v; }
  set email(v) { this.#email = v; }
  set cpf(v) { this.#cpf = v; }
  set dataNascimento(v) { this.#dataNascimento = v; }
  set endereco(v) { this.#endereco = v; }
  set titulo(v) { this.#titulo = v; }

  addTelefone(v) {
    this.#telefones.push(v);
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      cpf: this.#cpf,
      // O backend espera "data" para a data de nascimento
      data: this.#dataNascimento, 
      endereco: this.#endereco?.toJSON ? this.#endereco.toJSON() : this.#endereco,
      titulo: this.#titulo?.toJSON ? this.#titulo.toJSON() : this.#titulo,
      telefones: this.#telefones.map(t => t?.toJSON ? t.toJSON() : t)
    };
  }
}