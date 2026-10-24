using HydroFarm.Application;
using HydroFarm.Infrastructure;
using HydroFarm.Repositories;
using HydroFarm.Services;
using HydroFarm.WebApi.Configuration;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddServices()
    .AddRepositories()
    .AddInfrastructure(builder.Configuration)
    .AddWebApi(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors(CorsConfiguration.PolicyName);

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
