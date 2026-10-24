namespace HydroFarm.WebApi.Configuration;

/// <summary>Bound from the "Cors" configuration section.</summary>
public sealed class CorsSettings
{
    public const string SectionName = "Cors";

    /// <summary>Origins allowed to call the API, e.g. the Vite dev server or the production site.</summary>
    public string[] AllowedOrigins { get; init; } = [];
}
