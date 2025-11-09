using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Dusza.Api.Models;

public enum CardType
{
    Tűz,
    Víz,
    Levegő,
    Föld
}

public class Card
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public int Damage { get; set; }
    public int HP { get; set; }
    public string CardType { get; set; }
    public bool IsBoss { get; set; }

    public int GameId { get; set; }

    [JsonIgnore]
    [ForeignKey(nameof(GameId))]
    public virtual Game Game { get; set; }

    public virtual ICollection<Dungeon> Dungeons { get; set; } = new List<Dungeon>();
}