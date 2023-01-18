using Microsoft.AspNetCore.Mvc;
using TrailerFlix.Services;
using TrailerFlix.Models;

namespace TrailerFlix.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private static readonly HttpClient httpClient = new HttpClient();
    
    TrailerService _service;

    public MoviesController(TrailerService service)
    {
        _service = service;
    }

    [HttpGet("popular")]
    public async Task<ActionResult> GetPopularMovies()
    {
        var response = await Movies.GetPopular(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult> GetUpcomingMovies()
    {
        var response = await Movies.GetUpcoming(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("now_playing")]
    public async Task<ActionResult> GetNowPlayingMovies()
    {
        var response = await Movies.GetNowPlaying(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetMoviesBySearch(string query)
    {
        var response = await Movies.GetSearch(httpClient, query);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(int id)
    {
        var response = await Movies.GetById(httpClient, id);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("trailer/{id}")]
    public ActionResult<Trailer> GetTrailerByMovieId(int id)
    {
        var trailer = _service.GetTrailerByMovieId(id);
        return trailer;
    }

    [HttpPost("trailer")]
    public IActionResult AddTrailer(Trailer newTrailer)
    {
        var trailer = _service.AddMovieTrailer(newTrailer);
        return CreatedAtAction(nameof(AddTrailer), new { MovieId = trailer!.MovieId }, trailer);
    }
}