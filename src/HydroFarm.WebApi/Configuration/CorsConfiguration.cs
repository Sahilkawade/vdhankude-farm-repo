namespace HydroFarm.WebApi.Configuration;

public static class CorsConfiguration
{
    public const string PolicyName = "Frontend";

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = configuration.GetSection(CorsSettings.SectionName).Get<CorsSettings>() ?? new CorsSettings();

        services.AddCors(options => options.AddPolicy(PolicyName, policy =>
        {
            if (settings.AllowedOrigins.Length > 0)
            {
                policy.WithOrigins(settings.AllowedOrigins)
                      .WithMethods(HttpMethods.Get, HttpMethods.Post)
                      .WithHeaders("Content-Type");
            }
        }));

        return services;
    }
}
