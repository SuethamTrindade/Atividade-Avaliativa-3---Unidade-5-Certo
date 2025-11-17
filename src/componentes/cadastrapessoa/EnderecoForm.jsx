import React, { useState } from "react";
import { Form, Input, Row, Col, Select, message } from "antd";
import Endereco from "./Ender/Enderecco"; 

const { Option } = Select;

function EnderecoForm() {
  const [form] = Form.useForm();
  const [enderecoObj] = useState(new Endereco());
  const [cepDigitado, setCepDigitado] = useState("");

  // Evento onChange CEP
  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, ""); 
    setCepDigitado(e.target.value);

    if (cep.length === 8) {
      try {
        await enderecoObj.setCep(cep);

        form.setFieldsValue({
          endereco: {
            cep: e.target.value,
            logradouro: enderecoObj.getLogradouro(),
            bairro: enderecoObj.getBairro(),
            cidade: enderecoObj.getCidade(),
            uf: enderecoObj.getUf(),
          },
        });
      } catch (error) {
        message.error(error.message);
        form.setFieldsValue({
          endereco: {
            logradouro: "",
            bairro: "",
            cidade: "",
            uf: "",
          },
        });
      }
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="CEP"
        name={["endereco", "cep"]}
        rules={[{ required: true, message: "Informe o CEP!" }]}
      >
        <Input
          placeholder="00000-000"
          maxLength={9}
          value={cepDigitado}
          onChange={handleCepChange} // agora busca enquanto digita
        />
      </Form.Item>

      <Form.Item
        label="Logradouro"
        name={["endereco", "logradouro"]}
        rules={[{ required: true, message: "Informe o logradouro!" }]}
      >
        <Input placeholder="Rua / Avenida" />
      </Form.Item>

      <Form.Item
        label="Bairro"
        name={["endereco", "bairro"]}
        rules={[{ required: true, message: "Informe o bairro!" }]}
      >
        <Input placeholder="Bairro" />
      </Form.Item>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            label="Cidade"
            name={["endereco", "cidade"]}
            rules={[{ required: true, message: "Informe a cidade!" }]}
          >
            <Input placeholder="Cidade" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="UF"
            name={["endereco", "uf"]}
            rules={[{ required: true, message: "Informe a UF!" }]}
          >
            <Input placeholder="UF" maxLength={2} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Região"
            name={["endereco", "regiao"]}
            rules={[{ required: true, message: "Selecione a região!" }]}
          >
            <Select placeholder="Selecione">
              <Option value="Norte">Norte</Option>
              <Option value="Nordeste">Nordeste</Option>
              <Option value="Centro-Oeste">Centro-Oeste</Option>
              <Option value="Sudeste">Sudeste</Option>
              <Option value="Sul">Sul</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default EnderecoForm;
