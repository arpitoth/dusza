using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using Dusza.Api.Models;

public enum Size
{
    Egyszerű_találkozás,
    Kis_kazamata,
    Nagy_kazamata
}

public class Dungeon
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public Size Size { get; set; }
    public int GameId { get; set; }

    [ForeignKey(nameof(GameId))]
    public virtual Game Game { get; set; }

    public virtual ICollection<Card> Cards { get; set; } = new List<Card>();
}