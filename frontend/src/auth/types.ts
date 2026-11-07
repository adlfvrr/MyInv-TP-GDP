// Tipos de autenticación (ver docs/contrato-api.md, sección 3).

export type Rol = 'ADMINISTRADOR' | 'EMPLEADO';

export interface Usuario {
  id: number;
  username: string;
  nombreCompleto: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  tipo: 'Bearer';
  expiraEn: number;
  usuario: Usuario;
}
