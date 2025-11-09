using System.ComponentModel.DataAnnotations;

namespace Dusza.Api.Models;

public class Game
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual ICollection<Card> Cards { get; set; } = new List<Card>();
    public virtual ICollection<Dungeon> Dungeons { get; set; } = new List<Dungeon>();
}