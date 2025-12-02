import React from "react";
import { Form, DatePicker, Input } from "antd";

export default function PJForm() {
  return (
    <>
      {/* Campo Data Registro movido para fora do grupo da IE para ser tratado como campo base */}
      <Form.Item
          label="Data de Registro"
          name="dataRegistro"
          rules={[{ required: true, message: "Informe a data de registro!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Inscrição Estadual">
        <Input.Group compact>
          <Form.Item name={["ie", "numero"]} noStyle>
            <Input style={{ width: "40%" }} placeholder="Número IE" />
          </Form.Item>

          <Form.Item name={["ie", "estado"]} noStyle>
            <Input style={{ width: "30%" }} placeholder="UF" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
    </>
  );
}