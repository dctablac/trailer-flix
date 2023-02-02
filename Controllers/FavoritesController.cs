using Microsoft.AspNetCore.Mvc;
using TrailerFlix.Models;
using TrailerFlix.Services;

namespace TrailerFlix.Controllers;


[ApiController]
[Route("api/movies/[controller]")]
public class FavoritesController: ControllerBase
{
    private FavoriteService _service;

    public FavoritesController(FavoriteService service)
    {
        _service = service;
    }

    [HttpGet("{userId}")]
    public List<int> GetUserFavorites(string userId)
    {
        return _service.GetFavorites(userId);
    }

    [HttpPost]
    public IActionResult AddFavorite(Favorite newFavorite)
    {
        var favorite = _service.AddFavorite(newFavorite);
        return favorite is null ? 
            Problem(detail: "Movie already in favorites.") : 
            CreatedAtAction(nameof(AddFavorite), 
                            new { UserId = favorite!.UserId, MovieId = favorite!.MovieId }, 
                            favorite);
    }

    [HttpDelete("{userId}/{movieId}")]
    public IActionResult RemoveFavorite(string userId, int movieId)
    {
        var favorite = _service.GetFavoriteById(userId, movieId);
        if (favorite is not null)
        {
            _service.DeleteFavorite(favorite);
            return NoContent();
        }
        return NotFound();
    }
}