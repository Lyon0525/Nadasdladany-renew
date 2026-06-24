using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Nadasdladany.Application.Features.SiteSettings.Commands;
using Nadasdladany.Application.Features.SiteSettings.DTOs;
using Nadasdladany.Application.Features.SiteSettings.Queries;

namespace Nadasdladany.Api.Controllers;

[ApiController]
[Route("api/sitesettings")]
public class SiteSettingsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SiteSettingDto>> GetSettings()
    {
        var result = await Mediator.Send(new GetSiteSettingQuery());
        return Ok(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult> UpdateSettings([FromForm] UpdateSiteSettingCommand command)
    {
        await Mediator.Send(command);
        return NoContent();
    }
}