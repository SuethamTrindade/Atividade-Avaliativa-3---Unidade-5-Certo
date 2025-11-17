const onFinish = (values) => {
  try {
    const end = new Endereco();
    end.setCep(values.endereco?.cep);
    end.setLogradouro(values.endereco?.logradouro);
    end.setBairro(values.endereco?.bairro);
    end.setCidade(values.endereco?.cidade);
    end.setUf(values.endereco?.uf);
    end.setRegiao(values.endereco?.regiao);

    let pessoa;

    if (values.tipo === "PF") {
      pessoa = new PF();
      pessoa.setCpf(values.cpf);
      pessoa.setTitulo(values.titulo);

      // NOVO
      pessoa.setDataNascimento(values.dataNascimento);

    } else {
      pessoa = new PJ();
      pessoa.setCNPJ(values.cnpj);
      pessoa.setIE(values.ie);

      // NOVO
      pessoa.setDataRegistro(values.dataRegistro);
    }

    pessoa.setNome(values.nome);
    pessoa.setEmail(values.email);
    pessoa.setEndereco(end);

    if (values.telefones) {
      values.telefones.forEach((t) => {
        const fone = new Telefone();
        fone.setDdd(t.ddd);
        fone.setNumero(t.numero);
        pessoa.addTelefone(fone);
      });
    }

    const dao = values.tipo === "PF" ? new PFDAO() : new PJDAO();
    dao.salvar(pessoa);

    message.success("Pessoa cadastrada com sucesso!");
    form.resetFields();
  } catch (e) {
    message.error("Erro ao salvar: " + e.message);
  }
};
