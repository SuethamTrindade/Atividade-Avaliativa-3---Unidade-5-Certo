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

  // === Carregamento dos dados (Assíncrono) ===
  useEffect(() => {
    async function carregarDados() {
      if (id && tipoParam) {
        setEditando(true);
        setTipo(tipoParam);

        try {
          const dao = tipoParam === "PF" ? pfDAO : pjDAO;
          // Agora usamos buscarPorId direto do Backend, que já mapeia 'data' para a propriedade correta
          const pessoa = await dao.buscarPorId(id);

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
              valores.dataNascimento = pessoa.dataNascimento ? dayjs(pessoa.dataNascimento) : null;
              valores.titulo = pessoa.titulo;
            } else {
              valores.cnpj = pessoa.cnpj;
              // Data Registro agora está na raiz do formulário de PJ também
              valores.dataRegistro = pessoa.dataRegistro ? dayjs(pessoa.dataRegistro) : null;
              
              // IE continua separado, mas sem a dataRegistro dentro dele (pois movemos para fora)
              valores.ie = {
                numero: pessoa.ie?.numero || "",
                estado: pessoa.ie?.estado || "",
                // Se houver data de registro da IE específica, mantém aqui
              };
            }

            form.setFieldsValue(valores);
          }
        } catch (error) {
          message.error("Erro ao buscar pessoa: " + error.message);
          navigate("/listar");
        }
      }
    }
    carregarDados();
  }, [id, tipoParam]);

  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    // Limpa campos específicos ao trocar
    form.resetFields(["cpf", "dataNascimento", "titulo", "cnpj", "dataRegistro", "ie"]); 
  }

  // === Salvamento dos dados (Assíncrono) ===
  async function onFinish(values) {
    try {
      let pessoa;

      // Endereço
      const endVals = values.endereco || {};
      const end = new Endereco();
      Object.assign(end, endVals); // Maneira rápida de copiar propriedades iguais

      if (values.tipo === "PF") {
        pessoa = new PF();
        pessoa.cpf = values.cpf;
        // Backend recebe como 'data', mas o objeto PF guarda em dataNascimento
        pessoa.dataNascimento = values.dataNascimento ? dayjs(values.dataNascimento).format("YYYY-MM-DD") : null;
        
        if (values.titulo) {
          const t = new Titulo();
          Object.assign(t, values.titulo);
          pessoa.titulo = t;
        }
      } else {
        pessoa = new PJ();
        pessoa.cnpj = values.cnpj;
        // Data Registro PJ (mapeado para 'data' no toJSON)
        pessoa.dataRegistro = values.dataRegistro ? dayjs(values.dataRegistro).format("YYYY-MM-DD") : null;

        if (values.ie) {
          const ie = new IE();
          ie.numero = values.ie.numero;
          ie.estado = values.ie.estado;
          // IE dataRegistro é opcional/específico da IE, diferente da data da empresa
          pessoa.ie = ie;
        }
      }

      // Dados Comuns
      pessoa.nome = values.nome;
      pessoa.email = values.email;
      pessoa.endereco = end;

      if (values.telefones?.length > 0) {
        values.telefones.forEach((tel) => {
          const fone = new Telefone();
          fone.ddd = tel.ddd;
          fone.numero = tel.numero;
          pessoa.addTelefone(fone);
        });
      }

      const dao = tipo === "PF" ? pfDAO : pjDAO;

      if (editando && id) {
        await dao.atualizar(id, pessoa);
        message.success("Registro atualizado no Backend!");
      } else {
        await dao.salvar(pessoa);
        message.success("Registro criado no Backend!");
      }

      setTimeout(() => navigate("/listar"), 500);

    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      message.error("Erro ao salvar: " + erro.message);
    }
  }

  return (
    <div className="main-scroll" style={{ overflowY: "auto", height: "100vh", background: "#f9f9f9" }}>
      <div style={{ maxWidth: 800, margin: "24px auto", background: "#fff", padding: 24, borderRadius: 8 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {editando ? "Editar" : "Cadastrar"} {tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ tipo: "PF" }}>
          <Form.Item label="Tipo de Pessoa" name="tipo">
            <Radio.Group onChange={onChangeTipo} disabled={editando}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          {tipo === "PF" ? (
            <Form.Item label="CPF" name="cpf" rules={[{ required: true }]}>
              <Input maxLength={11} />
            </Form.Item>
          ) : (
            <Form.Item label="CNPJ" name="cnpj" rules={[{ required: true }]}>
              <Input maxLength={18} />
            </Form.Item>
          )}

          <EnderecoForm />
          <TelefoneList form={form} />
          
          {/* Renderiza o sub-formulário correto */}
          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? "Salvar Alterações" : "Salvar"}
            </Button>
          </Form.Item>
          {editando && (
            <Button block onClick={() => navigate("/listar")}>Cancelar</Button>
          )}
        </Form>
      </div>
    </div>
  );
}