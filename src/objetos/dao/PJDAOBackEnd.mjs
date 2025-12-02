import PJ from "../pessoas/PJ.mjs";
import Endereco from "../pessoas/Endereco.mjs";
import Telefone from "../pessoas/Telefone.mjs";
import IE from "../pessoas/IE.mjs";

const API_URL = "http://localhost:3000/pj";

export default class PJDAOBackEnd {
  
  async listar() {
    try {
      const response = await fetch(API_URL);
      const listaJSON = await response.json();
      return listaJSON.map(item => this.converterParaObjeto(item));
    } catch (e) {
      console.error("Erro ao listar PJ:", e);
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

  converterParaObjeto(item) {
    const pj = new PJ();
    pj.id = item.id;
    pj.nome = item.nome;
    pj.email = item.email;
    pj.cnpj = item.cnpj;

    // *** AQUI O TRUQUE: Backend envia "data", guardamos em "dataRegistro" ***
    pj.dataRegistro = item.data;

    if (item.endereco) {
      const e = new Endereco();
      Object.assign(e, item.endereco); // Atalho para preencher se os campos baterem
      pj.endereco = e;
    }

    if (item.ie) {
      const ieObj = new IE();
      ieObj.numero = item.ie.numero;
      ieObj.estado = item.ie.estado;
      // Obs: A data da IE é específica da IE, diferente da dataRegistro da empresa
      ieObj.dataRegistro = item.ie.dataRegistro; 
      pj.ie = ieObj;
    }

    if (item.telefones) {
      item.telefones.forEach(telJson => {
        const t = new Telefone();
        Object.assign(t, telJson);
        pj.addTelefone(t);
      });
    }

    return pj;
  }
}