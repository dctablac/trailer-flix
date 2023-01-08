using Microsoft.AspNetCore.Mvc;

namespace TrailerFlix.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private static readonly HttpClient httpClient;

    static MoviesController()
    {
        httpClient = new HttpClient();
    }

    [HttpGet("popular")]
    public async Task<ActionResult> GetPopularMovies()
    {
        var response = await Movies.GetPopular(httpClient);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetMoviesBySearch(string query)
    {
        var response = await Movies.GetSearch(httpClient, query);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetMovieById(string id)
    {
        var response = await Movies.GetById(httpClient, id);
        return response is null ? NotFound() : Ok(response);
    }
}