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
    public ActionResult<MoviePosters> GetPopularMovies()
    {
        var response = Movies.GetPopular(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("upcoming")]
    public ActionResult<MoviePosters> GetUpcomingMovies()
    {
        var response = Movies.GetUpcoming(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("now_playing")]
    public ActionResult<MoviePosters> GetNowPlayingMovies()
    {
        var response = Movies.GetNowPlaying(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("search")]
    public ActionResult GetMoviesBySearch(string query)
    {
        var response = Movies.GetSearch(httpClient, query);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("{id}")]
    public ActionResult<MovieDetails> GetMovieById(int id)
    {
        var response = Movies.GetById(httpClient, Request, id);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("trailer/{id}")]
    public ActionResult<Trailer> GetTrailerByMovieId(int id)
    {
        var trailer = _service.GetTrailerByMovieId(id);
        return trailer is null ? NotFound() : Ok(trailer);
    }

    [HttpPost("trailer")]
    public IActionResult AddTrailer(Trailer newTrailer)
    {
        var trailer = _service.AddMovieTrailer(newTrailer);
        return CreatedAtAction(nameof(AddTrailer), new { MovieId = trailer!.MovieId }, trailer);
    }
}