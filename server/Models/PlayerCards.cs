using Dusza.Api.Models;

public class PlayerCards
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public List<Card> Cards { get; set; } = new();
}