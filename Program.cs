using Microsoft.EntityFrameworkCore;
using TrailerFlix.Services;
using TrailerFlix.Data;

// Arbitray CORS policy name
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// CORS service policy
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(builder.Configuration["ALLOWED_ORIGIN"]);
        });
    });
}
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Register database context, TrailerContext
builder.Services.AddSqlite<TrailerContext>("Data Source=TrailerFlix.db");
// Register TrailerService that uses the TrailerContext
builder.Services.AddScoped<TrailerService>();


var app = builder.Build();

// Ensure the database is created
var context = app.Services.GetRequiredService<TrailerContext>();
context.Database.EnsureCreated();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// CORS middleware, configured above
app.UseCors(myAllowSpecificOrigins);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();
