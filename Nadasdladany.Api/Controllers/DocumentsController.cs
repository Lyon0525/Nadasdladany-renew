using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nadasdladany.Application.Common.Models;
using Nadasdladany.Application.Features.Documents.Commands;
using Nadasdladany.Application.Features.Documents.DTOs;
using Nadasdladany.Application.Features.Documents.Queries;

namespace Nadasdladany.Api.Controllers;

public class DocumentsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<DocumentDto>>> GetDocuments([FromQuery] GetDocumentsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult<int>> Create([FromForm] CreateDocumentCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    [Authorize]
    public async Task<ActionResult> Update(int id, [FromForm] UpdateDocumentCommand command)
    {
        if (id != command.Id) return BadRequest("Az URL ID nem egyezik a küldött ID-val.");
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteDocumentCommand(id));
        return NoContent();
    }
}