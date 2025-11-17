// PFForm.jsx
import React from "react";
import { Form, DatePicker, Input } from "antd";

export default function PFForm() {
  return (
    <>
      <Form.Item
        label="Data de Nascimento"
        name="dataNascimento"
        rules={[{ required: true, message: "Informe a data de nascimento!" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Título de Eleitor">
        <Input.Group compact>
          <Form.Item name={["titulo", "numero"]} noStyle>
            <Input style={{ width: "33%" }} placeholder="Número" />
          </Form.Item>

          <Form.Item name={["titulo", "zona"]} noStyle>
            <Input style={{ width: "33%" }} placeholder="Zona" />
          </Form.Item>

          <Form.Item name={["titulo", "secao"]} noStyle>
            <Input style={{ width: "33%" }} placeholder="Seção" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
    </>
  );
}
