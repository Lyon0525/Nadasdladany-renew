using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Nadasdladany.Application;
using Nadasdladany.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Key") ?? "ValamiNagyonHosszuEsTitkosKulcsMinimum32Karakter!";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.GetValue<string>("Issuer") ?? "NadasdladanyApi",
            ValidAudience = jwtSettings.GetValue<string>("Audience") ?? "NadasdladanyReact",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

var app = builder.Build();

var rootUploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "app_data_uploads");
if (!Directory.Exists(rootUploadsPath))
{
    Directory.CreateDirectory(rootUploadsPath);
    Directory.CreateDirectory(Path.Combine(rootUploadsPath, "mayor"));
    Directory.CreateDirectory(Path.Combine(rootUploadsPath, "branding"));
}

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rootUploadsPath),
    RequestPath = "/uploads"
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapFallbackToFile("index.html");
app.UseSerilogRequestLogging();

app.Run();