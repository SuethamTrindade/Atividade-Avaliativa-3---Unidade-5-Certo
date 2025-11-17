// PessoaFormBack.jsx — versão corrigida

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import EnderecoForm from "./EnderecoFormEXV2.jsx";
import TelefoneList from "./TelefoneListOOV2.jsx";
import PFForm from "./PFForm.jsx";
import PJForm from "./PJForm.jsx";

import PFDAO from "../../objetos/dao/PFDAOBackEnd.mjs";
import PJDAO from "../../objetos/dao/PJDAOBackEnd.mjs";

import PF from "../../objetos/pessoas/PF.mjs";
import PJ from "../../objetos/pessoas/PJ.mjs";
import Endereco from "../../objetos/pessoas/Endereco.mjs";
import Telefone from "../../objetos/pessoas/Telefone.mjs";
import Titulo from "../../objetos/pessoas/Titulo.mjs";
import IE from "../../objetos/pessoas/IE.mjs";

export default function PessoaFormBack() {
  const [tipo, setTipo] = useState("PF");
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === "PF" ? pfDAO : pjDAO;
      const lista = dao.listar();
      const pessoa = lista.find((p) => p.id === id);

      if (pessoa) {
        const valores = {
          tipo: tipoParam,
          nome: pessoa.nome,
          email: pessoa.email,
          endereco: pessoa.endereco || {},
          telefones: pessoa.telefones || [],
        };

        if (tipoParam === "PF") {
          valores.cpf = pessoa.cpf;
          valores.dataNascimento = pessoa.dataNascimento
            ? dayjs(pessoa.dataNascimento)
            : null;

          valores.titulo = pessoa.titulo || {
            numero: "",
            zona: "",
            secao: "",
          };
        } else {
          valores.cnpj = pessoa.cnpj;

          valores.ie = {
            numero: pessoa.ie?.numero || "",
            estado: pessoa.ie?.estado || "",
            dataRegistro: pessoa.ie?.dataRegistro
              ? dayjs(pessoa.ie.dataRegistro)
              : null,
          };
        }

        form.setFieldsValue(valores);
      } else {
        message.error("Pessoa não encontrada!");
        navigate("/listar");
      }
    }
  }, [id, tipoParam]);

  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    const valoresAtuais = form.getFieldsValue();
    form.resetFields();
    form.setFieldsValue({ ...valoresAtuais, tipo: novoTipo });
  }

  function onFinish(values) {
    try {
      let pessoa;

      // ----- ENDEREÇO -----
      const endVals = values.endereco || {};
      const end = new Endereco();
      end.cep = endVals.cep;
      end.logradouro = endVals.logradouro;
      end.bairro = endVals.bairro;
      end.cidade = endVals.cidade;
      end.uf = endVals.uf;
      end.regiao = endVals.regiao;

      // ========================= PF =========================
      if (values.tipo === "PF") {
        pessoa = new PF();
        pessoa.nome = values.nome;
        pessoa.email = values.email;
        pessoa.cpf = values.cpf;
        pessoa.endereco = end;

        const dn = values.dataNascimento;
        pessoa.dataNascimento = dn ? dayjs(dn).format("YYYY-MM-DD") : null;
        

        if (values.titulo) {
          const t = new Titulo();
          t.numero = values.titulo.numero;
          t.zona = values.titulo.zona;
          t.secao = values.titulo.secao;
          pessoa.titulo = t;
        }

      // ========================= PJ =========================
      } else {
        pessoa = new PJ();
        pessoa.nome = values.nome;
        pessoa.email = values.email;
        pessoa.cnpj = values.cnpj;
        pessoa.endereco = end;

        if (values.ie) {
          const ie = new IE();
          ie.numero = values.ie.numero;
          ie.estado = values.ie.estado;

          const dr = values.ie.dataRegistro;
          ie.dataRegistro = dr ? dr.format("YYYY-MM-DD") : null;

          pessoa.ie = ie;
        }
      }

      // ----- TELEFONES -----
      if (values.telefones?.length > 0) {
        values.telefones.forEach((tel) => {
          const fone = new Telefone();
          fone.ddd = tel.ddd;
          fone.numero = tel.numero;
          pessoa.addTelefone(fone);
        });
      }

      // ----- DAO -----
      const dao = tipo === "PF" ? pfDAO : pjDAO;

      if (editando && id) {
        dao.atualizar(id, pessoa);
        message.success("Registro atualizado!");
      } else {
        dao.salvar(pessoa);
        message.success("Registro criado!");
      }

      form.resetFields();
      setTimeout(() => navigate("/listar"), 500);

    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      message.error("Erro ao salvar registro: " + erro.message);
    }
  }

  return (
    <div className="main-scroll" style={{ overflowY: "auto", height: "100vh", background: "#f9f9f9" }}>
      <div style={{ maxWidth: 800, margin: "24px auto", background: "#fff", padding: 24, borderRadius: 8 }}>

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {editando
            ? `Editar ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`
            : `Cadastro de ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>

          <Form.Item label="Tipo de Pessoa" name="tipo" initialValue="PF">
            <Radio.Group onChange={onChangeTipo}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
            <Input placeholder="Nome completo / Razão social" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
            <Input placeholder="email@email.com" />
          </Form.Item>

          {tipo === "PF" ? (
            <Form.Item label="CPF" name="cpf" rules={[{ required: true }]}>
              <Input placeholder="CPF" maxLength={11} />
            </Form.Item>
          ) : (
            <Form.Item label="CNPJ" name="cnpj" rules={[{ required: true }]}>
              <Input placeholder="CNPJ" maxLength={18} />
            </Form.Item>
          )}

          <EnderecoForm />
          <TelefoneList form={form} />
          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editando ? "Salvar Alterações" : "Salvar"}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate("/listar")}>Cancelar</Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
