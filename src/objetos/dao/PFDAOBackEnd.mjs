import PF from "../pessoas/PF.mjs";
import Endereco from "../pessoas/Endereco.mjs";
import Telefone from "../pessoas/Telefone.mjs";
import Titulo from "../pessoas/Titulo.mjs";

// Supondo que a API rode nesta porta
const API_URL = "http://localhost:3000/pf"; 

export default class PFDAOBackEnd {
  
  async listar() {
    try {
      const response = await fetch(API_URL);
      const listaJSON = await response.json();
      
      return listaJSON.map(item => this.converterParaObjeto(item));
    } catch (e) {
      console.error("Erro ao listar PF:", e);
      throw e;
    }
  }

  async buscarPorId(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const item = await response.json();
    return this.converterParaObjeto(item);
  }

  async salvar(pessoa) {
    const objJSON = pessoa.toJSON();
    // Removemos o ID se for vazio para o backend gerar, ou geramos se necessário
    if (!objJSON.id) delete objJSON.id; 

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objJSON)
    });
    return await response.json();
  }

  async atualizar(id, pessoa) {
    const objJSON = pessoa.toJSON();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objJSON)
    });
    return await response.json();
  }

  async excluir(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  }

  // Método auxiliar para converter o JSON vindo da API no Objeto PF
  converterParaObjeto(item) {
    const pf = new PF();
    pf.id = item.id;
    pf.nome = item.nome;
    pf.email = item.email;
    pf.cpf = item.cpf;
    
    // *** AQUI ESTÁ O TRUQUE: O backend envia "data", nós guardamos em "dataNascimento" ***
    pf.dataNascimento = item.data; 

    if (item.endereco) {
      const e = new Endereco();
      e.cep = item.endereco.cep;
      e.logradouro = item.endereco.logradouro;
      e.bairro = item.endereco.bairro;
      e.cidade = item.endereco.cidade;
      e.uf = item.endereco.uf;
      e.regiao = item.endereco.regiao;
      pf.endereco = e;
    }

    if (item.titulo) {
      const t = new Titulo();
      t.numero = item.titulo.numero;
      t.zona = item.titulo.zona;
      t.secao = item.titulo.secao;
      pf.titulo = t;
    }

    if (item.telefones) {
      item.telefones.forEach(telJson => {
        const t = new Telefone();
        t.ddd = telJson.ddd;
        t.numero = telJson.numero;
        pf.addTelefone(t);
      });
    }

    return pf;
  }
}