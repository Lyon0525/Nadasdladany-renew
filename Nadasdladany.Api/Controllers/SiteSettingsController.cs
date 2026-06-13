using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Features.SiteSettings.Commands;
using Nadasdladany.Application.Features.SiteSettings.DTOs;
using Nadasdladany.Application.Features.SiteSettings.Queries;

namespace Nadasdladany.Api.Controllers;

public class SiteSettingsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SiteSettingDto>> Get()
    {
        return await Mediator.Send(new GetSiteSettingQuery());
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<int>> Update([FromForm] UpdateSiteSettingCommand command)
    {
        return await Mediator.Send(command);
    }
}