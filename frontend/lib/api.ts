// Configuración de la API del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/asodat/backend/api';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/login`,
  
  // Socios
  SOCIOS: `${API_BASE_URL}/socios`,
  SOCIO: `${API_BASE_URL}/socio`,
  
  // Aportes
  APORTES: `${API_BASE_URL}/aportes`,
  APORTE: `${API_BASE_URL}/aporte`,
  
  // Noticias
  NOTICIAS: `${API_BASE_URL}/noticias`,
  NOTICIA: `${API_BASE_URL}/noticia`,
  
  // Reportes
  REPORTES: `${API_BASE_URL}/reportes`,
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
  id: number;
  cedula: string;
  apellidos_nombres: string;
  telefono: string;
  email: string;
  rol: 'socio' | 'tesorero' | 'secretaria' | 'presidente';
  fecha_afiliacion: string;
  estado: 'activo' | 'inactivo';
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
  id: number;
  cedula: string;
  nombre_socio: string;
  monto: number;
  fecha: string;
  tipo_aporte: 'mensual' | 'extraordinario' | 'donacion' | 'otro';
  descripcion: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
}

export interface AportesResponse {
  aportes: Aporte[];
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    total_aportes: number;
    limite: number;
  };
  filtros: {
    cedula: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
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

// Funciones helper para hacer llamadas a la API
export class ApiClient {
  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Métodos para Socios
  static async getSocios(params?: {
    buscar?: string;
    pagina?: number;
    limite?: number;
  }): Promise<ApiResponse<SociosResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.pagina) searchParams.append('pagina', params.pagina.toString());
    if (params?.limite) searchParams.append('limite', params.limite.toString());

    return this.request<SociosResponse>(
      `${API_ENDPOINTS.SOCIOS}?${searchParams.toString()}`
    );
  }

  static async createSocio(socio: Omit<Socio, 'id'>): Promise<ApiResponse<Socio>> {
    return this.request<Socio>(API_ENDPOINTS.SOCIOS, {
      method: 'POST',
      body: JSON.stringify(socio),
    });
  }

  // Métodos para Aportes
  static async getAportes(params?: {
    cedula?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    pagina?: number;
    limite?: number;
  }): Promise<ApiResponse<AportesResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.cedula) searchParams.append('cedula', params.cedula);
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);
    if (params?.pagina) searchParams.append('pagina', params.pagina.toString());
    if (params?.limite) searchParams.append('limite', params.limite.toString());

    return this.request<AportesResponse>(
      `${API_ENDPOINTS.APORTES}?${searchParams.toString()}`
    );
  }

  static async createAporte(aporte: Omit<Aporte, 'id' | 'nombre_socio'>): Promise<ApiResponse<Aporte>> {
    return this.request<Aporte>(API_ENDPOINTS.APORTES, {
      method: 'POST',
      body: JSON.stringify(aporte),
    });
  }

  // Métodos para Noticias
  static async getNoticias(params?: {
    buscar?: string;
    categoria?: string;
    pagina?: number;
    limite?: number;
  }): Promise<ApiResponse<NoticiasResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.buscar) searchParams.append('buscar', params.buscar);
    if (params?.categoria) searchParams.append('categoria', params.categoria);
    if (params?.pagina) searchParams.append('pagina', params.pagina.toString());
    if (params?.limite) searchParams.append('limite', params.limite.toString());

    return this.request<NoticiasResponse>(
      `${API_ENDPOINTS.NOTICIAS}?${searchParams.toString()}`
    );
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
}
