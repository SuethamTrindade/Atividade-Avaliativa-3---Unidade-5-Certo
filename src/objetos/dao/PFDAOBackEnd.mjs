const CHAVE = "pessoasFisicas";

export default class PFDAO {
  listar() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  }

  salvar(pessoa) {
    const lista = this.listar();

    const obj = pessoa.toJSON(); // garante data
    obj.id = crypto.randomUUID(); // gera id aqui

    lista.push(obj);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  atualizar(id, pessoa) {
    const lista = this.listar();
    const index = lista.findIndex(item => item.id === id);

    if (index !== -1) {
      const obj = pessoa.toJSON();
      obj.id = id; // mantém o id anterior
      lista[index] = obj;
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    }
  }

  remover(id) {
    const lista = this.listar().filter(item => item.id !== id);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }
}
