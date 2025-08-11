// Configuración de la API del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/password/forgot`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/password/reset`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/password/change`,
  
  // Usuario actual
  ME: `${API_BASE_URL}/me`,
  ME_DATOS: `${API_BASE_URL}/me/datos`,
  ME_APORTES: `${API_BASE_URL}/me/aportes`,
  
  // Socios
  SOCIOS: `${API_BASE_URL}/socios`,
  SOCIO: `${API_BASE_URL}/socios`,
  
  // Aportes
  APORTES: `${API_BASE_URL}/aportes`,
  APORTE: `${API_BASE_URL}/aportes`,
  
  // Reportes
  REPORTES: `${API_BASE_URL}/reportes`,
  
  // Validaciones
  VALIDACIONES: `${API_BASE_URL}/validaciones`,
  
  // Eliminaciones
  ELIMINACIONES: `${API_BASE_URL}/eliminaciones`,
} as const;

// Tipos de datos para las respuestas de la API
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  mensaje?: string;
  data?: T;
  error?: string;
}

// Tipos para Socios
export interface Socio {
  cedula: string;
  apellidos_nombres: string;
  campus?: string;
  genero?: string;
  regimen?: string;
  celular?: string;
  rol?: string;
  cargo?: string;
  direccion?: string;
  fecha_afiliacion?: string;
  documento_pdf?: string;
  observaciones?: string;
  correo?: string;
  tipo_usuario?: 'nuevo' | 'adherente' | 'fundador';
}

export interface SociosResponse {
  socios: Socio[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_socios: number;
    limite: number;
  };
}

// Tipos para Aportes
export interface Aporte {
  cedula: string;
  apellidos_y_nombres?: string;
  nuevos_ingresos?: number;
  dic_24?: number | undefined;
  ene_25?: number | undefined;
  feb_25?: number | undefined;
  mar_25?: number | undefined;
  abr_25?: number | undefined;
  may_25?: number | undefined;
  jun_25?: number | undefined;
  jul_25?: number | undefined;
  ago_25?: number | undefined;
  sept_25?:number | undefined;
  oct_25?: number | undefined;
  nov_25?: number | undefined;
  dic_25?: number | undefined;
}

export interface AportesResponse {
  aportes: Aporte[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_aportes: number;
    limite: number;
  };
}

// Tipos para Usuario
export interface Usuario {
  cedula: string;
  rol: string;
  password_hash?: string;
}

// Tipos para Autenticación
export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  rol: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  rol: string;
}

// Tipos para Noticias
export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  fecha_publicacion: string;
  autor: string;
  imagen: string;
  estado: string;
}

export interface NoticiasResponse {
  noticias: Noticia[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_noticias: number;
    limite: number;
  };
  filtros: {
    buscar: string;
    categoria: string;
  };
}

// Tipos para Reportes
export interface ReporteSocio {
  cedula: string;
  nombre?: string;
  campus?: string;
  rol?: string;
  tipo_usuario?: string;
  fecha_afiliacion?: string;
}

export interface ReporteAporte {
  cedula: string;
  nombre?: string;
  nuevos_ingresos: number;
  dic_24: number;
  ene_25: number;
  feb_25: number;
  mar_25: number;
  abr_25: number;
  may_25: number;
  jun_25: number;
  jul_25: number;
  ago_25: number;
  sept_25: number;
  oct_25: number;
  nov_25: number;
  dic_25: number;
}

export interface ReporteComprobante {
  id: number;
  cedula: string;
  fecha_pago: string;
  total: number;
  ingreso: number;
  numero_comprobante: number;
  observaciones?: string;
}

export interface ReporteSociosResponse {
  socios: ReporteSocio[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_registros: number;
    limite: number;
    skip: number;
  };
}

export interface ReporteAportesResponse {
  aportes: ReporteAporte[];
}

export interface ReporteComprobantesResponse {
  comprobantes: ReporteComprobante[];
}

export interface ReporteAportesMensuales {
  mes: string;
  total_aportes: number;
  total_monto: number;
  promedio_monto: number;
}

export interface ReporteAportesPorSocio {
  cedula: string;
  nombre: string;
  total_aportes: number;
  total_monto: number;
  ultimo_aporte: string;
}

export interface EstadisticasGenerales {
  socios: {
    total: number;
    activos: number;
    inactivos: number;
  };
  aportes: {
    total: number;
    monto_total: number;
    promedio: number;
  };
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
}

// Tipos para Eliminaciones
export interface Eliminacion {
  id: number;
  cedula: string;
  nombre_completo: string;
  fecha_afiliacion?: string;
  motivo: string;
  fecha_eliminacion: string;
}

export interface EliminacionesResponse {
  eliminaciones: Eliminacion[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_eliminaciones: number;
    limite: number;
    skip: number;
  };
}

export interface EliminacionRequest {
  cedula: string;
  motivo: string;
}

// Tipos para Mi Perfil
export interface DatosPersonales {
  cedula: string;
  nombrecompleto: string;
  correo?: string;
  celular?: string;
  campus?: string;
  genero?: string;
  regimen?: string;
  cargo?: string;
  direccion?: string;
  fecha_afiliacion?: string;
}

export interface MisAportes {
  cedula: string;
  meses: {
    dic_24: string;
    ene_25: string;
    feb_25: string;
    mar_25: string;
    abr_25: string;
    may_25: string;
    jun_25: string;
    jul_25: string;
    ago_25: string;
    sept_25: string;
    oct_25: string;
    nov_25: string;
    dic_25: string;
  };
  valores: {
    dic_24?: number;
    ene_25?: number;
    feb_25?: number;
    mar_25?: number;
    abr_25?: number;
    may_25?: number;
    jun_25?: number;
    jul_25?: number;
    ago_25?: number;
    sept_25?: number;
    oct_25?: number;
    nov_25?: number;
    dic_25?: number;
  };
  total: number;
}

// Funciones helper para hacer llamadas a la API
export class ApiClient {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, intentar refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Reintentar la petición original
            const retryResponse = await fetch(url, {
              headers: this.getAuthHeaders(),
              ...options,
            });
            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({}));
              return {
                status: 'error',
                error: errorData.detail || `HTTP error! status: ${retryResponse.status}`
              };
            }
            const data = await retryResponse.json();
            return {
              status: 'success',
              data: data
            };
          }
        }
        
        const errorData = await response.json().catch(() => ({}));
        return {
          status: 'error',
          error: errorData.detail || `HTTP error! status: ${response.status}`
        };
      }

      const data = await response.json();
      return {
        status: 'success',
        data: data
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Métodos de autenticación
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar tokens en localStorage
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user_rol', data.rol)
        
        return {
          status: 'success',
          data: data
        }
      } else {
        // Manejar errores de la API
        return {
          status: 'error',
          error: data.detail || data.message || 'Error en la autenticación'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        status: 'error',
        error: 'Error de conexión'
      }
    }
  }

  static async logout(): Promise<ApiResponse<any>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await this.request(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_rol');
    
    return { status: 'success', mensaje: 'Sesión cerrada' };
  }

  private static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    
    // Si falla el refresh, limpiar tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_rol');
    return false;
  }

  // Métodos para Socios
  static async getSocios(params?: {
    buscar?: string;
    pagina?: number;
    limite?: number;
    cedula?: string;
    rol?: string;
  }): Promise<ApiResponse<SociosResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.cedula) searchParams.append('cedula', params.cedula);
    if (params?.rol) searchParams.append('rol', params.rol);
    
    // Calcular skip basado en la página
    if (params?.pagina && params?.limite) {
      const skip = (params.pagina - 1) * params.limite;
      searchParams.append('skip', skip.toString());
      searchParams.append('limit', params.limite.toString());
    }

    return this.request<SociosResponse>(
      `${API_ENDPOINTS.SOCIOS}?${searchParams.toString()}`
    );
  }

  static async createSocio(socio: Omit<Socio, 'cedula'> & { cedula: string }): Promise<ApiResponse<Socio>> {
    return this.request<Socio>(API_ENDPOINTS.SOCIOS, {
      method: 'POST',
      body: JSON.stringify(socio),
    });
  }

  static async getSocio(cedula: string): Promise<ApiResponse<Socio>> {
    return this.request<Socio>(`${API_ENDPOINTS.SOCIO}/${cedula}`);
  }

  static async updateSocio(cedula: string, socio: Partial<Socio>): Promise<ApiResponse<Socio>> {
    return this.request<Socio>(`${API_ENDPOINTS.SOCIO}/${cedula}`, {
      method: 'PUT',
      body: JSON.stringify(socio),
    });
  }

  // Métodos para Aportes
  static async getAportes(params?: {
    buscar?: string;
    pagina?: number;
    limite?: number;
    cedula?: string;
  }): Promise<ApiResponse<AportesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.cedula) searchParams.append('cedula', params.cedula);
    
    // Calcular skip basado en la página
    if (params?.pagina && params?.limite) {
      const skip = (params.pagina - 1) * params.limite;
      searchParams.append('skip', skip.toString());
      searchParams.append('limit', params.limite.toString());
    }

    return this.request<AportesResponse>(
      `${API_ENDPOINTS.APORTES}?${searchParams.toString()}`
    );
  }

  static async createAporte(aporte: Aporte): Promise<ApiResponse<Aporte>> {
    return this.request<Aporte>(API_ENDPOINTS.APORTES, {
      method: 'POST',
      body: JSON.stringify(aporte),
    });
  }

  static async getAporte(cedula: string): Promise<ApiResponse<Aporte>> {
    return this.request<Aporte>(`${API_ENDPOINTS.APORTE}/${cedula}`);
  }

  // Métodos para Usuario actual
  static async getMe(): Promise<ApiResponse<Usuario>> {
    return this.request<Usuario>(API_ENDPOINTS.ME);
  }

  // Métodos para Mi Perfil
  static async getMisDatos(): Promise<ApiResponse<DatosPersonales>> {
    return this.request<DatosPersonales>(API_ENDPOINTS.ME_DATOS);
  }

  static async getMisAportes(): Promise<ApiResponse<MisAportes>> {
    return this.request<MisAportes>(API_ENDPOINTS.ME_APORTES);
  }

  // Métodos para Reportes
  static async getReporte(tipo: string, params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    searchParams.append('tipo', tipo);
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);

    return this.request(
      `${API_ENDPOINTS.REPORTES}?${searchParams.toString()}`
    );
  }

  static async getReporteSocios(params?: {
    buscar?: string;
    pagina?: number;
    limite?: number;
    campus?: string;
    rol?: string;
  }): Promise<ApiResponse<ReporteSociosResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.campus) searchParams.append('campus', params.campus);
    if (params?.rol) searchParams.append('rol', params.rol);
    
    // Calcular skip basado en la página
    if (params?.pagina && params?.limite) {
      const skip = (params.pagina - 1) * params.limite;
      searchParams.append('skip', skip.toString());
      searchParams.append('limit', params.limite.toString());
    }

    return this.request<ReporteSociosResponse>(
      `${API_ENDPOINTS.REPORTES}/socios?${searchParams.toString()}`
    );
  }

  static async getReporteAportes(params?: {
    buscar?: string;
    cedula?: string;
  }): Promise<ApiResponse<ReporteAportesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.cedula) searchParams.append('cedula', params.cedula);

    return this.request<ReporteAportesResponse>(
      `${API_ENDPOINTS.REPORTES}/aportes?${searchParams.toString()}`
    );
  }

  static async getReporteComprobantes(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    cedula?: string;
  }): Promise<ApiResponse<ReporteComprobantesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);
    if (params?.cedula) searchParams.append('cedula', params.cedula);

    return this.request<ReporteComprobantesResponse>(
      `${API_ENDPOINTS.REPORTES}/comprobantes?${searchParams.toString()}`
    );
  }

  // Métodos para Eliminaciones
  static async getEliminaciones(params?: {
    buscar?: string;
    pagina?: number;
    limite?: number;
    cedula?: string;
  }): Promise<ApiResponse<EliminacionesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.cedula) searchParams.append('cedula', params.cedula);
    
    // Calcular skip basado en la página
    if (params?.pagina && params?.limite) {
      const skip = (params.pagina - 1) * params.limite;
      searchParams.append('skip', skip.toString());
      searchParams.append('limit', params.limite.toString());
    }

    return this.request<EliminacionesResponse>(
      `${API_ENDPOINTS.ELIMINACIONES}?${searchParams.toString()}`
    );
  }

  static async crearEliminacion(data: EliminacionRequest): Promise<ApiResponse<Eliminacion>> {
    return this.request<Eliminacion>(API_ENDPOINTS.ELIMINACIONES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
