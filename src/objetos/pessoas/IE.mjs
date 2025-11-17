export default class IE {
  numero = "";
  estado = "";
  dataRegistro = null;

  toJSON() {
    return {
      numero: this.numero,
      estado: this.estado,
      dataRegistro: this.dataRegistro
    };
  }
}
