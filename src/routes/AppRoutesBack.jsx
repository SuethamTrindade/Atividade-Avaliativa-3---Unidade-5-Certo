import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import PessoaForm from "../componentes/cadastrapessoa/PessoaFormBack.jsx";
import ListaPessoas from "../componentes/listapessoas/ListaPessoasBack.jsx";
import VisualizaPessoa from "../componentes/visualizapessoa/VisualizarPessoaBack.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Todas as rotas dentro do layout principal */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="cadastrar" replace />} />
        <Route path="cadastrar"  element={<PessoaForm />} />
        <Route path="listar" element={<ListaPessoas />} />
        <Route path="visualizar/:tipo/:id" element={<VisualizaPessoa />} />
        <Route path="editar/:tipo/:id" element={<PessoaForm />} /> 
      </Route>
    </Routes>
  );
}
export default AppRoutes;