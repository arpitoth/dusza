using System.ComponentModel.DataAnnotations;

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
}