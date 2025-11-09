using Dusza.Api.Models;

public class DungeonCard
{
    public int DungeonId { get; set; }
    public Dungeon Dungeon { get; set; }

    public int CardId { get; set; }
    public Card Card { get; set; }
}
