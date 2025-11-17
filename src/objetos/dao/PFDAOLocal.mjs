const CHAVE = "pessoasFisicas";

export default class PFDAO {
  listar() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  }

  salvar(pessoa) {
    const lista = this.listar();
    pessoa.id = crypto.randomUUID();
    lista.push(pessoa.toJSON());
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  atualizar(id, pessoaAtualizada) {
    const lista = this.listar();
    const idx = lista.findIndex(p => p.id === id);

    if (idx !== -1) {
      lista[idx] = pessoaAtualizada.toJSON();
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    }
  }

  remover(id) {
    const novaLista = this.listar().filter(p => p.id !== id);
    localStorage.setItem(CHAVE, JSON.stringify(novaLista));
  }
}
