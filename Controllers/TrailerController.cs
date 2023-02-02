using Microsoft.AspNetCore.Mvc;
using TrailerFlix.Services;
using TrailerFlix.Models;

namespace TrailerFlix.Controllers;

[ApiController]
[Route("api/movies/[controller]")]
public class TrailerController : ControllerBase
{
    private TrailerService _service;

    public TrailerController(TrailerService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public ActionResult<Trailer> GetTrailerByMovieId(int id)
    {
        var trailer = _service.GetTrailerByMovieId(id);
        return trailer is null ? NotFound() : Ok(trailer);
    }

    [HttpPost]
    public IActionResult AddTrailer(Trailer newTrailer)
    {
        var trailer = _service.AddMovieTrailer(newTrailer);
        return CreatedAtAction(nameof(AddTrailer), 
                               new { MovieId = trailer!.MovieId }, 
                               trailer);
    }
    
}