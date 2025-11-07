using Dusza.Api.Models;
using Dusza.Api.Data;
using Dusza.Api.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace DuszaApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly DuszaDbContext _dbContext;

    private readonly IConfiguration _config;

    public AuthController(DuszaDbContext dbContext, IConfiguration config)
    {
        _dbContext = dbContext;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email és Jelszó megadása kötelező!");

        if (!IsValidEmail(request.Email))
            return BadRequest("Érvénytelen email!");

        if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Ezzel az emaillel már van regisztrált felhasználó!");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            UserName = request.UserName
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        Console.WriteLine($"New user ID: {user.Id}");

        return Ok(new { Message = "Sikeres regisztráció!", UserId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == dto.UserName || u.Email == dto.UserName);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user?.PasswordHash))
            return Unauthorized("Invalid credentials");

        var accessToken = GenerateJwtToken(user!);
        var refreshToken = GenerateRefreshToken();

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            UserId = user!.Id,
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
                _config.GetValue<int>("Jwt:RefreshTokenExpirationDays"))
        });

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            token = accessToken,
            refreshToken = refreshToken,
            username = user.UserName,
            userId = user.Id
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            return BadRequest("Nem található refreshtoken");

        var existing = await _dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);
        if (existing == null)
            return NotFound("Ez a token már nem létezik");

        _dbContext.RefreshTokens.Remove(existing);
        await _dbContext.SaveChangesAsync();

        return Ok("Sikeres kijelentkezés.");
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var token = _dbContext.RefreshTokens.FirstOrDefault(t => t.Token == request.RefreshToken);

        var user = await _dbContext.Users.FindAsync(token?.UserId);

        if (token == null || user == null || token?.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return Unauthorized("Invalid or expired refresh token");

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
                _config.GetValue<int>("Jwt:RefreshTokenExpirationDays"))
        });

        _dbContext.RefreshTokens.Remove(token!);

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            token = newAccessToken,
            refreshToken = newRefreshToken
        });
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"{claim.Type} = {claim.Value}");
        }

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private bool IsValidEmail(string email)
    {
        var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        return emailRegex.IsMatch(email);
    }
}

public class RegisterRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string UserName { get; set; } = "";
}

public class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}