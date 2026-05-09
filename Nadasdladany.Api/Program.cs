using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nadasdladany.Api.Middlewares;
using Nadasdladany.Api.Services;
using Nadasdladany.Application;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Infrastructure;
using Nadasdladany.Infrastructure.Persistence;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. REPROJEKTEK REGISZTRÁCIÓJA
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 2. API SZOLGÁLTATÁSOK
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 3. JWT AUTHENTICATION BEÁLLÍTÁSA
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Key") ?? "NagyonTitkosKulcs1234567890123456";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// 4. SWAGGER KONFIGURÁCIÓ
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Nádasdladány Község API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Írd be a tokent így: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// 5. CORS BEÁLLÍTÁSA (Fejlesztéshez kell, ha külön fut a React és az API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 6. ADATBÁZIS INICIALIZÁLÁS
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using (var scope = app.Services.CreateScope())
    {
        var initialiser = scope.ServiceProvider.GetRequiredService<NadasdladanyDbContextInitialiser>();
        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

// 7. MIDDLEWARE PIPELINE - A SORREND FONTOS!

app.UseHttpsRedirection();

// Először engedélyezzük az alapértelmezett fájlokat (index.html)
app.UseDefaultFiles();
// Kiszolgáljuk a wwwroot tartalmát (React build fájljai: js, css, képek)
app.UseStaticFiles();

// Globális hibakezelő és naplózó
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// EZ A KULCS: Ha semmi nem kapta el a kérést (nem API és nem statikus fájl),
// akkor dobja vissza a React index.html-jét. Így működik a React Router.
app.MapFallbackToFile("index.html");

app.Run();