using Microsoft.AspNetCore.Mvc;
using TrailerFlix.Services;

namespace TrailerFlix.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private MovieService _service;

    public MoviesController(MovieService service)
    {
        _service = service;
    }

    [HttpGet("popular")]
    public ActionResult<MoviePosters> GetPopularMovies()
    {
        var response = _service.GetPopular();
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("upcoming")]
    public ActionResult<MoviePosters> GetUpcomingMovies()
    {
        var response = _service.GetUpcoming();
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("now_playing")]
    public ActionResult<MoviePosters> GetNowPlayingMovies()
    {
        var response = _service.GetNowPlaying();
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("search")]
    public ActionResult GetMoviesBySearch(string query)
    {
        var response = _service.GetSearch(query);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("{id}")]
    public ActionResult<MovieDetails> GetMovieById(int id)
    {
        var response = _service.GetById(Request, id);
        return response is null ? NotFound() : Ok(response);
    }
}