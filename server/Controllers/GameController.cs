using Microsoft.AspNetCore.Mvc;
using Dusza.Api.Data;
using Dusza.Api.Models;
using DuszaApi.Filters;
using DuszaApi.Middlewares;
using Microsoft.EntityFrameworkCore;

namespace ZestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly DuszaDbContext _dbContext;

    public GameController(DuszaDbContext dbContext, IConfiguration config)
    {
        _dbContext = dbContext;
    }

    [HttpPost("savename")]
    public async Task<IActionResult> SaveName([FromBody] NameRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Név megadása kötelező!");

        if (await _dbContext.Games.AnyAsync(u => u.Name == request.Name))
            return BadRequest("Ezzel a névvel már van mentett játék!");

        var game = new Game
        {
            Name = request.Name
        };

        _dbContext.Games.Add(game);
        await _dbContext.SaveChangesAsync();
        return Ok(new { message = "Sikeres mentés" });
    }

    [HttpGet("gameslist")]
    public async Task<IActionResult> GetGames()
    {
        var games = await _dbContext.Games
            .Select(g => new { g.Id, g.Name })
            .ToListAsync();

        return Ok(games);
    }

    [HttpGet("cardslist")]
    public async Task<IActionResult> GetCards()
    {
        var cards = await _dbContext.Cards
            .Select(c => new { c.Id, c.Name, c.Damage, c.HP, c.CardType })
            .ToListAsync();

        return Ok(cards);
    }

    [HttpPost("addcard")]
    public async Task<IActionResult> AddCard([FromBody] CardRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Név kötelező.");

        if (!Enum.TryParse<CardType>(request.CardType, out var genderEnum))
            return BadRequest("Érvénytelen típus!");

        if (await _dbContext.Cards.AnyAsync(u => u.Name == request.Name))
            return BadRequest("Ezzel a névvel már van létrehozott kártya!");

        var card = new Card
        {
            Name = request.Name,
            Damage = request.Damage,
            HP = request.Health,
            CardType = request.CardType
        };

        _dbContext.Cards.Add(card);
        await _dbContext.SaveChangesAsync();

        return Ok(card);
    }

    [HttpDelete("deletecard/{id}")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        var card = await _dbContext.Cards.FindAsync(id);
        if (card == null)
            return NotFound("A kártya nem található.");

        _dbContext.Cards.Remove(card);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Kártya sikeresen törölve." });
    }

}

public class NameRequest
{
    public string Name { get; set; } = "";
}

public class CardRequest
{
    public string Name { get; set; }
    public int Damage { get; set; }
    public int Health { get; set; }
    public string CardType { get; set; }
}