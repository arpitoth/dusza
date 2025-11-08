using System.ComponentModel.DataAnnotations;

namespace Dusza.Api.Models;

public class Game
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
}