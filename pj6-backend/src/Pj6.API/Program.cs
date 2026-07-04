using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Pj6.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────────────────
// Uncomment and configure your DB provider:
// builder.Services.AddDbContext<AppDbContext>(opt =>
//     opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
// builder.Services.AddDbContext<AppDbContext>(opt =>
//     opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
// builder.Services.AddSingleton<MongoDbContext>();

// ── Authentication (JWT) ──────────────────────────────────────────────────────
// Uncomment to enable JWT authentication:
// var jwtKey = builder.Configuration["Jwt:SecretKey"]
//     ?? throw new InvalidOperationException("Jwt:SecretKey not configured.");
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(opt =>
//     {
//         opt.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer           = true,
//             ValidateAudience         = true,
//             ValidateLifetime         = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer              = builder.Configuration["Jwt:Issuer"],
//             ValidAudience            = builder.Configuration["Jwt:Audience"],
//             IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
//         };
//     });
// builder.Services.AddAuthorization(opt =>
//     opt.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));

// ── OpenAPI ───────────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── DI registrations ──────────────────────────────────────────────────────────
// Register your repositories and services here:
// builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// ── Middleware ────────────────────────────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.UseAuthentication();
// app.UseAuthorization();

// ── Endpoints ─────────────────────────────────────────────────────────────────
// Map your endpoint groups here:
// app.MapGroup("/api/auth").MapAuthEndpoints();

app.Run();