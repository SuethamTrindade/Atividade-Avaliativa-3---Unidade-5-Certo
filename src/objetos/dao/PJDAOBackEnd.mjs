const CHAVEPJ = "pessoasJuridicas";


export default class PJDAO {
listar() {
return JSON.parse(localStorage.getItem(CHAVEPJ)) || [];
}


salvar(pessoa) {
const lista = this.listar();
pessoa.id = crypto.randomUUID();
lista.push(pessoa);
localStorage.setItem(CHAVEPJ, JSON.stringify(lista));
}


atualizar(id, pessoa) {
const lista = this.listar();
const idx = lista.findIndex((p) => p.id === id);
if (idx >= 0) {
pessoa.id = id;
lista[idx] = pessoa;
localStorage.setItem(CHAVEPJ, JSON.stringify(lista));
}
}


excluir(id) {
let lista = this.listar();
lista = lista.filter((p) => p.id !== id);
localStorage.setItem(CHAVEPJ, JSON.stringify(lista));
}
}