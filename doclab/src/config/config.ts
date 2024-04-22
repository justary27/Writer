class ApiConfig{
    private constructor(){}

static readonly uriProdScheme: string = "https";
  static readonly uriTestScheme: string = "http";

  static readonly cdnProdHost: string = "example.com";
  static readonly cdnTestHost: string = "localhost";

  static readonly cdnTestPort: number = 8000;

  static readonly BASE_URL = `${ApiConfig.uriTestScheme}://${ApiConfig.cdnTestHost}:${ApiConfig.cdnTestPort}`;
};

export default ApiConfig;
