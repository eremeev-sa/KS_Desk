using System.Reflection;
using System.Text;
using KanbanApp.Application.Services;
using KanbanApp.Core.Abstractions.IBoards;
using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.DataAccess;
using KanbanApp.DataAccess.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var key = builder.Configuration.GetValue<string>("ApiSettings:Secret");

builder.Services.AddAuthentication(x =>
	{
		x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	}
).AddJwtBearer(x =>
{
	x.RequireHttpsMetadata = false;
	x.SaveToken = true;
	x.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
		ValidateIssuer = false,
		ValidateAudience = false
	};
});

builder.Services.AddSwaggerGen(options =>
{
	var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
	options.IncludeXmlComments(xmlPath);
});

builder.Services.AddDbContext<KanbanAppDbContext>(
	options =>
	{
		options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(KanbanAppDbContext)));
	});

builder.Services.AddScoped<IBoardsService, BoardsService>();
builder.Services.AddScoped<IColumnsKanbanService, ColumnsService>();
builder.Services.AddScoped<ITasksService, TasksService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<ISubtasksKanbanService, SubtasksService>();


builder.Services.AddScoped<IBoardsRepository, BoardRepository>();
builder.Services.AddScoped<IColumnsRepository, ColumnRepository>();
builder.Services.AddScoped<ITasksRepository, TaskRepository>();
builder.Services.AddScoped<IUsersRepository, UserRepository>();
builder.Services.AddScoped<ISubtasksRepository, SubtaskRepository>();

var app = builder.Build();

app.UseCors(x =>
{
	x.WithHeaders().AllowAnyHeader();
	x.WithOrigins("http://localhost:3000");
	x.WithMethods().AllowAnyMethod();
});

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
