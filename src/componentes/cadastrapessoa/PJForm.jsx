// PJForm.jsx — corrigido
import React from "react";
import { Form, DatePicker, Input } from "antd";

export default function PJForm() {
  return (
    <>
      <Form.Item label="Inscrição Estadual">
        <Input.Group compact>
          <Form.Item name={["ie", "numero"]} noStyle>
            <Input style={{ width: "40%" }} placeholder="Número IE" />
          </Form.Item>

          <Form.Item name={["ie", "estado"]} noStyle>
            <Input style={{ width: "30%" }} placeholder="UF" />
          </Form.Item>
        </Input.Group>

        {/* ESTE PRECISA FICAR FORA DO Input.Group */}
        <Form.Item
          label="Data Registro"
          name={["ie", "dataRegistro"]}
          rules={[{ required: true, message: "Informe a data de registro!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
      </Form.Item>
    </>
  );
}
